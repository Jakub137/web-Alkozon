import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  extractOrderId,
  parseEstimatedPriceFromPreferences,
  mapCustomOrderStatusToUi,
  trackOrderPublic,
} from "@/lib/api/orders";

describe("orders API helpers (client-side)", () => {
  it("extractOrderId: digits, CUSTOM-, ORD-", () => {
    expect(extractOrderId("830868")).toBe("830868");
    expect(extractOrderId("CUSTOM-12")).toBe("CUSTOM-12");
    expect(extractOrderId("ORD-99")).toBe("99");
    expect(extractOrderId("")).toBe("");
  });

  it("parseEstimatedPriceFromPreferences", () => {
    expect(parseEstimatedPriceFromPreferences({ estimatedPrice: 108.99 })).toBe(108.99);
    expect(
      parseEstimatedPriceFromPreferences({
        estimatedPrice: "108.99",
      } as Record<string, unknown>)
    ).toBe(108.99);
    expect(
      parseEstimatedPriceFromPreferences({
        estimatedPrice: "108,99",
      } as Record<string, unknown>)
    ).toBe(108.99);
    expect(parseEstimatedPriceFromPreferences(null)).toBeUndefined();
  });

  it("mapCustomOrderStatusToUi", () => {
    expect(mapCustomOrderStatusToUi("PENDING")).toBe("received");
    expect(mapCustomOrderStatusToUi("IN_PROGRESS")).toBe("processing");
    expect(mapCustomOrderStatusToUi("COMPLETED")).toBe("delivered");
    expect(mapCustomOrderStatusToUi("REJECTED")).toBe("cancelled");
  });
});

describe("trackOrderPublic (fetch)", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/api/orders/track")) {
          return Promise.resolve(
            new Response(JSON.stringify({ message: "Order not found" }), {
              status: 404,
              headers: { "content-type": "application/json" },
            })
          );
        }
        if (url.includes("/api/custom-orders/track")) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                customOrderId: 42,
                clientOrderNumber: "830868",
                status: "PENDING",
                description: "trunek własny",
                createdAt: "2026-05-18T12:00:00.000Z",
                updatedAt: "2026-05-18T12:00:00.000Z",
              }),
              { status: 200, headers: { "content-type": "application/json" } }
            )
          );
        }
        return Promise.reject(new Error(`unexpected fetch: ${url}`));
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("falls back to /api/custom-orders/track when shop track returns 404", async () => {
    const result = await trackOrderPublic("830868", "user@example.com");
    expect(result.kind).toBe("custom");
    expect(result.orderNumber).toBe("CUSTOM-42");
    expect(result.clientOrderNumber).toBe("830868");
    expect(result.items?.[0]?.name).toBe("trunek własny");
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });
});
