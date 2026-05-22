import { describe, expect, it } from "vitest";
import {
  applyRealtimeEventToOrderRecord,
  isUnifiedBackendOrderStatus,
  orderMatchesRealtimeEvent,
  syncOrderHistoryWithStatus,
} from "@/lib/realtime/orderRealtimeApply";
import type { OrderRecord } from "@/types/order";

describe("orderRealtimeApply", () => {
  it("dopasowuje zamówienie sklepowe po ORD-{id}", () => {
    const entry: OrderRecord = {
      kind: "shop",
      orderNumber: "ORD-7",
      clientOrderNumber: "430721",
      email: "a@b.c",
      placedAt: "",
      estimatedDelivery: "",
      status: "received",
    };
    expect(
      orderMatchesRealtimeEvent(entry, {
        orderId: 7,
        clientOrderNumber: "430721",
        status: "IN_PRODUCTION",
      })
    ).toBe(true);
  });

  it("dopasowuje zamówienie własne po CUSTOM-{id} i unified OrderStatus", () => {
    const entry: OrderRecord = {
      kind: "custom",
      orderNumber: "CUSTOM-12",
      clientOrderNumber: "991234",
      email: "a@b.c",
      placedAt: "",
      estimatedDelivery: "",
      status: "received",
    };
    expect(
      orderMatchesRealtimeEvent(entry, {
        orderId: 12,
        status: "IN_PRODUCTION",
      })
    ).toBe(true);
  });

  it("dopasowuje custom po clientOrderNumber z CustomOrderRealtimeNotifier", () => {
    const entry: OrderRecord = {
      kind: "custom",
      orderNumber: "CUSTOM-3",
      clientOrderNumber: "701105",
      email: "a@b.c",
      placedAt: "",
      estimatedDelivery: "",
      status: "processing",
    };
    expect(
      orderMatchesRealtimeEvent(entry, {
        orderId: 99,
        clientOrderNumber: "701105",
        status: "IN_DELIVERY",
      })
    ).toBe(true);
  });

  it("nie aktualizuje sklepu przy evencie z numerem custom", () => {
    const entry: OrderRecord = {
      kind: "shop",
      orderNumber: "ORD-5",
      clientOrderNumber: "430721",
      email: "a@b.c",
      placedAt: "",
      estimatedDelivery: "",
      status: "received",
    };
    expect(
      orderMatchesRealtimeEvent(entry, {
        orderId: 5,
        clientOrderNumber: "701105",
        status: "IN_DELIVERY",
      })
    ).toBe(false);
  });

  it("mapuje unified status na UI dla custom (STOMP z main)", () => {
    const entry: OrderRecord = {
      kind: "custom",
      orderNumber: "CUSTOM-1",
      clientOrderNumber: "830868",
      email: "a@b.c",
      placedAt: "",
      estimatedDelivery: "",
      status: "received",
      apiStatus: "SUBMITTED",
    };
    const updated = applyRealtimeEventToOrderRecord(entry, {
      orderId: 1,
      clientOrderNumber: "830868",
      status: "IN_PRODUCTION",
    });
    expect(updated?.status).toBe("processing");
    expect(updated?.apiStatus).toBe("IN_PRODUCTION");
    expect(updated?.history?.map((h) => h.status)).toEqual(["received", "processing"]);
  });

  it("uzupełnia oś czasu o etapy do bieżącego statusu", () => {
    const history = syncOrderHistoryWithStatus(
      [{ status: "received", changedAt: "2026-05-21T18:00:00.000Z" }],
      "shipped",
      "2026-05-21T18:00:00.000Z",
      "2026-05-21T20:15:00.000Z"
    );
    expect(history.map((h) => h.status)).toEqual(["received", "processing", "shipped"]);
    expect(history[2].changedAt).toBe("2026-05-21T20:15:00.000Z");
  });

  it("rozpoznaje unified OrderStatus z API", () => {
    expect(isUnifiedBackendOrderStatus("IN_PRODUCTION")).toBe(true);
    expect(isUnifiedBackendOrderStatus("PENDING")).toBe(false);
  });
});
