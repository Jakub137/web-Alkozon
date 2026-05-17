"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAge } from "@/context/AgeContext";
import { useAuth } from "@/context/AuthContext";
import UnderageRestrictedPage from "@/components/UnderageRestrictedPage";
import { ApiError } from "@/lib/api/types";
import { buildOrderItemsFromCart, createOrder } from "@/lib/api/orders";
import { createCustomOrder } from "@/lib/api/customOrders";

type CheckoutCopy = {
  deliveryAddress?: string;
  deliveryAddressPlaceholder?: string;
  formTitle?: string;
  firstName?: string;
  firstNamePlaceholder?: string;
  lastName?: string;
  lastNamePlaceholder?: string;
  address?: string;
  addressPlaceholder?: string;
  city?: string;
  cityPlaceholder?: string;
  postalCode?: string;
  postalCodePlaceholder?: string;
  courierNotes?: string;
  courierNotesPlaceholder?: string;
  paymentMethod?: string;
  paymentMethodCashOnDelivery?: string;
  openForm?: string;
  summaryTitle?: string;
  orderNumber?: string;
  status?: string;
  statusSubmitted?: string;
  customer?: string;
  delivery?: string;
  payment?: string;
  orderedItems?: string;
  trackOrder?: string;
  newOrder?: string;
  requiredFields?: string;
  invalidPostalCode?: string;
  submit?: string;
  submitting?: string;
  authRequired?: string;
  ageBlocked?: string;
  ageOrRoleBlocked?: string;
  addressRequired?: string;
  customNotSupported?: string;
  invalidCart?: string;
  customMissingPayload?: string;
  rateLimited?: string;
  serverError?: string;
  unexpectedError?: string;
};

type DeliveryForm = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  courierNotes: string;
};

type SubmittedOrderSummary = {
  orderNumber: string;
  trackingOrderNumber: string;
  status: string;
  customerName: string;
  address: string;
  city: string;
  postalCode: string;
  courierNotes: string;
  paymentMethod: string;
  totalPrice: number;
  items: Array<{ id: string; name: string; quantity: number; total: number }>;
};

const CASH_ON_DELIVERY = "Płatność przy odbiorze";
const DEFAULT_DELIVERY_COUNTRY = "Polska";
const MAX_ORDER_NUMBER_ATTEMPTS = 8;
const ORDER_NUMBER_STORAGE_KEY = "alkozon_used_order_numbers";
const ORDER_NUMBER_STORAGE_LIMIT = 200;
const POSTAL_CODE_REGEX = /^\d{2}-\d{3}$/;

function readUsedOrderNumbers(): string[] {
  try {
    const raw = localStorage.getItem(ORDER_NUMBER_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

function rememberUsedOrderNumber(orderNumber: string) {
  const normalized = orderNumber.trim();
  if (!/^\d{6}$/.test(normalized)) return;

  const next = [normalized, ...readUsedOrderNumbers().filter((value) => value !== normalized)].slice(
    0,
    ORDER_NUMBER_STORAGE_LIMIT
  );
  localStorage.setItem(ORDER_NUMBER_STORAGE_KEY, JSON.stringify(next));
}

function generateRawOrderNumber(): string {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return String(100000 + (values[0] % 900000));
}

function generateOrderNumber(): string {
  const usedNumbers = new Set(readUsedOrderNumbers());

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const candidate = generateRawOrderNumber();
    if (!usedNumbers.has(candidate)) {
      return candidate;
    }
  }

  return generateRawOrderNumber();
}

function displayOrderNumber(orderNumber: string): string {
  return orderNumber.replace(/^ORD-/i, "");
}

function isOrderNumberConflict(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  const fieldErrors = error.payload?.fieldErrors?.map((entry) => `${entry.field} ${entry.message}`).join(" ") ?? "";
  const message = `${error.message} ${error.payload?.message ?? ""} ${fieldErrors}`.toLowerCase();
  return (
    error.status === 409 ||
    message.includes("numer zamówienia") ||
    message.includes("zamówienia jest już użyty") ||
    message.includes("użyty") ||
    message.includes("zajęty") ||
    message.includes("istnieje") ||
    message.includes("order number") ||
    message.includes("clientordernumber") ||
    message.includes("ordernumber") ||
    message.includes("already") ||
    message.includes("exists") ||
    message.includes("duplicate")
  );
}

function mapCheckoutErrorMessage(checkoutCopy: CheckoutCopy, error: unknown): string {
  if (!(error instanceof ApiError)) {
    return checkoutCopy.unexpectedError || "Nie udało się złożyć zamówienia. Spróbuj ponownie.";
  }

  if (isOrderNumberConflict(error)) {
    return "Numer zamówienia był już zajęty. Spróbowaliśmy wygenerować nowy numer - jeśli problem wraca, sprawdź Moje zamówienia lub spróbuj ponownie za chwilę.";
  }
  if (error.status === 401) {
    return checkoutCopy.authRequired || "Musisz się zalogować, aby złożyć zamówienie.";
  }
  if (error.status === 403) {
    return checkoutCopy.ageOrRoleBlocked || "Brak uprawnień do złożenia zamówienia.";
  }
  if (error.status === 429) {
    return checkoutCopy.rateLimited || "Wykonano zbyt wiele prób. Spróbuj ponownie za chwilę.";
  }
  if (error.status >= 500) {
    return checkoutCopy.serverError || "Błąd serwera. Spróbuj ponownie później.";
  }
  return error.message || checkoutCopy.unexpectedError || "Nie udało się złożyć zamówienia. Spróbuj ponownie.";
}

export default function CartPage() {
  const { dict } = useLanguage();
  const { cartItems, cartItemsCount, removeFromCart, clearCart } = useCart();
  const { ageStatus } = useAge();
  const { token, user, authorizedRequest } = useAuth();
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState<DeliveryForm>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: "",
    city: "",
    postalCode: "",
    courierNotes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrderSummary | null>(null);
  const checkoutCopy: CheckoutCopy = dict.shop.cart.checkout || {};

  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const paymentMethod = checkoutCopy.paymentMethodCashOnDelivery || CASH_ON_DELIVERY;

  if (ageStatus === "underage") {
    return <UnderageRestrictedPage />;
  }

  const updateDeliveryField = (field: keyof DeliveryForm, value: string) => {
    setDeliveryForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateCheckoutAccess = () => {
    setCheckoutError(null);

    if (!token) {
      setCheckoutError(checkoutCopy.authRequired || "Musisz się zalogować, aby złożyć zamówienie.");
      return false;
    }
    if (user?.role !== "CUSTOMER" || !user.ageConfirmedAt) {
      setCheckoutError(
        checkoutCopy.authRequired || "Zaloguj się na konto klienta i potwierdź pełnoletność, aby złożyć zamówienie."
      );
      return false;
    }
    if (cartItems.length === 0) {
      setCheckoutError(checkoutCopy.invalidCart || "Koszyk nie zawiera produktów, które można wysłać do API.");
      return false;
    }
    return true;
  };

  const handleOpenCheckoutForm = () => {
    if (validateCheckoutAccess()) {
      setIsCheckoutFormOpen(true);
    }
  };

  const handleCreateOrder = async () => {
    if (submitLockRef.current) return;
    submitLockRef.current = true;

    if (!validateCheckoutAccess()) {
      submitLockRef.current = false;
      return;
    }

    const requiredValues = [
      deliveryForm.firstName,
      deliveryForm.lastName,
      deliveryForm.address,
      deliveryForm.city,
      deliveryForm.postalCode,
    ];

    if (requiredValues.some((value) => !value.trim())) {
      setCheckoutError(checkoutCopy.requiredFields || "Uzupełnij wszystkie wymagane pola formularza.");
      submitLockRef.current = false;
      return;
    }

    if (!POSTAL_CODE_REGEX.test(deliveryForm.postalCode.trim())) {
      setCheckoutError(checkoutCopy.invalidPostalCode || "Podaj kod pocztowy w formacie 00-000.");
      submitLockRef.current = false;
      return;
    }

    const delivery = {
      recipientName: `${deliveryForm.firstName.trim()} ${deliveryForm.lastName.trim()}`,
      streetAddress: deliveryForm.address.trim(),
      city: deliveryForm.city.trim(),
      postalCode: deliveryForm.postalCode.trim(),
      country: DEFAULT_DELIVERY_COUNTRY,
      deliveryNotes: deliveryForm.courierNotes.trim(),
      paymentMethod,
    };
    const customItems = cartItems.filter((item) => item.product.id.startsWith("custom-"));
    const regularItems = cartItems.filter((item) => !item.product.id.startsWith("custom-"));
    const items = buildOrderItemsFromCart(regularItems);
    if (items.length === 0 && customItems.length === 0) {
      setCheckoutError(checkoutCopy.invalidCart || "Koszyk nie zawiera produktów, które można wysłać do API.");
      submitLockRef.current = false;
      return;
    }

    try {
      setIsSubmitting(true);
      let createdOrderNumber: string | null = null;
      let trackingOrderNumber: string | null = null;
      let clientOrderNumber = generateOrderNumber();
      if (items.length > 0) {
        let lastCreateOrderError: unknown = null;
        for (let attempt = 0; attempt < MAX_ORDER_NUMBER_ATTEMPTS; attempt += 1) {
          clientOrderNumber = generateOrderNumber();
          try {
            const order = await authorizedRequest((accessToken) =>
              createOrder(accessToken, {
                orderNumber: clientOrderNumber,
                clientOrderNumber,
                items,
                delivery,
              })
            );
            trackingOrderNumber = order.orderNumber;
            lastCreateOrderError = null;
            break;
          } catch (error) {
            lastCreateOrderError = error;
            if (!isOrderNumberConflict(error)) {
              throw error;
            }
            rememberUsedOrderNumber(clientOrderNumber);
          }
        }

        if (lastCreateOrderError) {
          throw lastCreateOrderError;
        }
        rememberUsedOrderNumber(clientOrderNumber);
        createdOrderNumber = clientOrderNumber;
        trackingOrderNumber = trackingOrderNumber || clientOrderNumber;
      }

      if (customItems.length > 0) {
        await authorizedRequest(async (accessToken) => {
          for (const item of customItems) {
            if (!item.product.customOrderDetails?.description) {
              throw new Error(
                checkoutCopy.customMissingPayload || "Brakuje danych zamówienia własnego. Dodaj je ponownie."
              );
            }

            for (let i = 0; i < item.quantity; i += 1) {
              const customOrder = await createCustomOrder(accessToken, {
                description: item.product.customOrderDetails.description,
                preferences: {
                  ...item.product.customOrderDetails.preferences,
                  orderNumber: clientOrderNumber,
                  clientOrderNumber,
                  delivery,
                  paymentMethod,
                },
              });
              if (!createdOrderNumber) {
                createdOrderNumber = clientOrderNumber || `CUSTOM-${customOrder.id}`;
              }
            }
          }
        });
      }
      if (createdOrderNumber) {
        rememberUsedOrderNumber(displayOrderNumber(createdOrderNumber));
      }

      const summaryItems = cartItems.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
      }));

      setSubmittedOrder({
        orderNumber: createdOrderNumber || "UNKNOWN",
        trackingOrderNumber: trackingOrderNumber || createdOrderNumber || "UNKNOWN",
        status: checkoutCopy.statusSubmitted || "Złożone",
        customerName: `${deliveryForm.firstName.trim()} ${deliveryForm.lastName.trim()}`,
        address: deliveryForm.address.trim(),
        city: deliveryForm.city.trim(),
        postalCode: deliveryForm.postalCode.trim(),
        courierNotes: deliveryForm.courierNotes.trim() || "Brak",
        paymentMethod,
        totalPrice,
        items: summaryItems,
      });
      clearCart();
    } catch (error) {
      setCheckoutError(mapCheckoutErrorMessage(checkoutCopy, error));
    } finally {
      setIsSubmitting(false);
      submitLockRef.current = false;
    }
  };

  if (submittedOrder) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow">
        <div className="w-full sm:w-[640px] sm:max-w-[640px] mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm dark:shadow-slate-900/50">
          <div className="mb-6 text-center">
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              {checkoutCopy.summaryTitle || "Zamówienie zostało złożone"}
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              #{displayOrderNumber(submittedOrder.orderNumber)}
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {checkoutCopy.status || "Status"}: {submittedOrder.status}
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <section className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4">
              <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                {checkoutCopy.customer || "Dane klienta"}
              </h2>
              <p className="text-slate-700 dark:text-slate-300">{submittedOrder.customerName}</p>
            </section>

            <section className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4">
              <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                {checkoutCopy.delivery || "Dostawa"}
              </h2>
              <p className="text-slate-700 dark:text-slate-300">{submittedOrder.address}</p>
              <p className="text-slate-700 dark:text-slate-300">
                {submittedOrder.postalCode} {submittedOrder.city}
              </p>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                {checkoutCopy.courierNotes || "Uwagi dla dostawcy"}: {submittedOrder.courierNotes}
              </p>
            </section>

            <section className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4">
              <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                {checkoutCopy.payment || "Płatność"}
              </h2>
              <p className="text-slate-700 dark:text-slate-300">{submittedOrder.paymentMethod}</p>
            </section>

            <section className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4">
              <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-3">
                {checkoutCopy.orderedItems || "Produkty"}
              </h2>
              <ul className="space-y-2">
                {submittedOrder.items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3 text-slate-700 dark:text-slate-300">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-semibold whitespace-nowrap">{item.total.toFixed(2)} zl</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between gap-3 text-base font-bold text-slate-900 dark:text-slate-100">
                <span>{dict.shop.cart.total}</span>
                <span>{submittedOrder.totalPrice.toFixed(2)} zl</span>
              </div>
            </section>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/order-status?orderId=${encodeURIComponent(submittedOrder.trackingOrderNumber)}`}
              className="flex-1 h-11 px-4 inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-700 text-white font-medium transition-colors"
            >
              {checkoutCopy.trackOrder || "Sprawdź status zamówienia"}
            </Link>
            <Link
              href="/shop"
              className="flex-1 h-11 px-4 inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-blue-500 transition-colors"
            >
              {checkoutCopy.newOrder || "Wróć do sklepu"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 transition-colors">
          {dict.shop.cart.pageTitle}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 transition-colors">
          {dict.shop.cart.items}: {cartItemsCount}
        </p>
      </header>

      {cartItems.length === 0 ? (
        <div className="w-full sm:w-[560px] sm:max-w-[560px] mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center shadow-sm dark:shadow-slate-900/50">
          <p className="text-slate-600 dark:text-slate-300 mb-5">{dict.shop.cart.empty}</p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-800 text-white font-medium transition-colors"
          >
            {dict.shop.cart.backToShop}
          </Link>
        </div>
      ) : (
        <div className="w-full sm:w-[560px] sm:max-w-[560px] mx-auto space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-sm dark:shadow-slate-900/50 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                  {item.product.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.product.capacity}</p>
              </div>

              <div className="text-sm text-slate-700 dark:text-slate-200 shrink-0">
                x{item.quantity}
              </div>

              <div className="text-base font-bold text-slate-900 dark:text-slate-100 shrink-0">
                {(item.product.price * item.quantity).toFixed(2)} zl
              </div>

              <button
                type="button"
                onClick={() => removeFromCart(item.product.id)}
                className="h-9 min-w-[92px] px-3 inline-flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-200 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors shrink-0 whitespace-nowrap"
              >
                {dict.shop.cart.remove}
              </button>
            </div>
          ))}

          <div className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm dark:shadow-slate-900/50 flex items-center justify-between gap-4">
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {dict.shop.cart.total}
            </span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {totalPrice.toFixed(2)} zl
            </span>
          </div>

          <div className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm dark:shadow-slate-900/50 space-y-4">
            {checkoutError && (
              <p className="text-sm text-red-600 dark:text-red-400">{checkoutError}</p>
            )}
            {!isCheckoutFormOpen ? (
              <button
                type="button"
                onClick={handleOpenCheckoutForm}
                disabled={cartItems.length === 0}
                className="w-full h-11 px-4 rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {checkoutCopy.openForm || checkoutCopy.submit || "Złóż zamówienie"}
              </button>
            ) : (
              <>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {checkoutCopy.formTitle || "Dane do dostawy"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {checkoutCopy.paymentMethod || "Metoda płatności"}: {paymentMethod}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {checkoutCopy.firstName || "Imię"}
                    <input
                      value={deliveryForm.firstName}
                      onChange={(event) => updateDeliveryField("firstName", event.target.value)}
                      className="mt-1 w-full h-11 px-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder={checkoutCopy.firstNamePlaceholder || "Jan"}
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {checkoutCopy.lastName || "Nazwisko"}
                    <input
                      value={deliveryForm.lastName}
                      onChange={(event) => updateDeliveryField("lastName", event.target.value)}
                      className="mt-1 w-full h-11 px-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder={checkoutCopy.lastNamePlaceholder || "Kowalski"}
                    />
                  </label>
                </div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {checkoutCopy.address || checkoutCopy.deliveryAddress || "Adres"}
                  <input
                    value={deliveryForm.address}
                    onChange={(event) => updateDeliveryField("address", event.target.value)}
                    className="mt-1 w-full h-11 px-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder={checkoutCopy.addressPlaceholder || "ul. Testowa 12/4"}
                  />
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {checkoutCopy.city || "Miasto"}
                    <input
                      value={deliveryForm.city}
                      onChange={(event) => updateDeliveryField("city", event.target.value)}
                      className="mt-1 w-full h-11 px-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder={checkoutCopy.cityPlaceholder || "Warszawa"}
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {checkoutCopy.postalCode || "Kod pocztowy"}
                    <input
                      value={deliveryForm.postalCode}
                      onChange={(event) => updateDeliveryField("postalCode", event.target.value)}
                      className="mt-1 w-full h-11 px-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder={checkoutCopy.postalCodePlaceholder || "00-000"}
                    />
                  </label>
                </div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {checkoutCopy.courierNotes || "Uwagi dla dostawcy"}
                  <textarea
                    value={deliveryForm.courierNotes}
                    onChange={(event) => updateDeliveryField("courierNotes", event.target.value)}
                    className="mt-1 w-full min-h-20 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-y"
                    placeholder={checkoutCopy.courierNotesPlaceholder || "Np. proszę zadzwonić domofonem"}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => void handleCreateOrder()}
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full h-11 px-4 rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting
                    ? checkoutCopy.submitting || "Składanie zamówienia..."
                    : checkoutCopy.submit || "Złóż zamówienie"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
