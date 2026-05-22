import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OrderStatusPage from "@/app/order-status/page";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getOrderById, trackOrderPublic } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/types";

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));
vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));
vi.mock("@/context/NotificationContext", () => ({
  useNotification: vi.fn(() => ({ addNotification: vi.fn(), removeNotification: vi.fn() })),
}));
vi.mock("@/lib/realtime/orderUpdates", () => ({
  subscribeOrderStatusUpdates: vi.fn(() => () => undefined),
}));
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("@/lib/api/orders", () => ({
  getOrderById: vi.fn(),
  trackOrderPublic: vi.fn(),
  extractOrderId: (value: string) => value,
}));

const mockDict = {
  orderStatusPage: {
    title: "Status",
    subtitle: "Sprawdź status",
    form: {
      orderNumberLabel: "Numer",
      orderNumberPlaceholder: "Nr zamówienia",
      emailLabel: "Email",
      emailPlaceholder: "Email",
      submit: "Sprawdź",
    },
    notFound: "Nie znaleziono",
    details: {
      title: "Szczegóły",
      orderNumber: "Nr zamówienia",
      placedAt: "Złożono",
      status: "Status",
      estimatedDelivery: "Dostawa",
    },
    statuses: {
      processing: "W trakcie",
    },
    progress: {
      title: "Postęp",
      steps: {
        received: "Otrzymane",
        processing: "W trakcie",
        shipped: "Wysłane",
        delivered: "Dostarczone",
      },
    },
    nextStepsTitle: "Kolejne kroki",
    nextSteps: { processing: "Oczekiwanie" },
    timelineTitle: "Historia",
    items: {
      title: "Produkty",
      quantityLabel: "Ilość",
      unitPriceLabel: "Cena",
      totalItemsLabel: "Suma elementów",
      totalValueLabel: "Suma wartości",
    },
    buttons: { goToShop: "Sklep", contact: "Kontakt" },
  },
  myOrdersPage: { customOrderBadge: "Zamówienie własne" },
};

describe("OrderStatusPage Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLanguage as any).mockReturnValue({ dict: mockDict, lang: "pl" });
    (useAuth as any).mockReturnValue({
      token: null,
      user: null,
      authorizedRequest: (fn: any) => fn("mock-token"),
    });
    (getOrderById as any).mockResolvedValue(null);
    (trackOrderPublic as any).mockRejectedValue(new ApiError("Order not found", 404));
  });

  it("powinien zablokować formularz gdy pusty", () => {
    render(<OrderStatusPage />);
    const submitBtn = screen.getByRole("button", { name: "Sprawdź" });
    expect(submitBtn).toBeDisabled();
  });

  it("powinien wyświetlić brak zamówienia jeśli track API zwróci 404", async () => {
    (trackOrderPublic as any).mockRejectedValue(new ApiError("Order not found", 404));
    render(<OrderStatusPage />);

    fireEvent.change(screen.getByPlaceholderText("Nr zamówienia"), { target: { value: "123" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@a.pl" } });

    fireEvent.submit(screen.getByRole("button", { name: "Sprawdź" }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Nie znaleziono")).toBeInTheDocument();
    });
  });

  it("powinien wyświetlić status po znalezieniu zamówienia przez track API", async () => {
    (trackOrderPublic as any).mockResolvedValue({
      kind: "shop",
      email: "",
      orderNumber: "ORD-1",
      clientOrderNumber: undefined,
      status: "processing",
      placedAt: "2025-01-01",
      estimatedDelivery: "2025-01-05",
      history: [],
      items: [],
    });

    render(<OrderStatusPage />);

    fireEvent.change(screen.getByPlaceholderText("Nr zamówienia"), { target: { value: "123" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@a.pl" } });

    fireEvent.submit(screen.getByRole("button", { name: "Sprawdź" }).closest("form")!);

    await waitFor(() => {
      expect(screen.getAllByText("W trakcie").length).toBeGreaterThan(0);
      expect(screen.getByText("Szczegóły")).toBeInTheDocument();
    });
  });
});
