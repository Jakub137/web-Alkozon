import { describe, it, expect, vi, afterEach } from "vitest";
import { ApiError } from "@/lib/api/types";
import { applyCustomEstimatedPriceFromPreferences, getMyOrdersMerged, trackOrderPublic } from "@/lib/api/orders";

describe("trackOrderPublic — odpowiedź sklepu (bez custom fallback)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("przy 200 z /api/orders/track nie woła custom-orders", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            orderId: 7,
            clientOrderNumber: "100001",
            status: "SUBMITTED",
            createdAt: "2026-01-02T10:00:00.000Z",
            updatedAt: "2026-01-02T10:00:00.000Z",
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        )
      )
    );

    const result = await trackOrderPublic("100001", "buyer@example.com");
    expect(result.kind).toBe("shop");
    expect(result.orderNumber).toBe("ORD-7");
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(String((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0])).toContain(
      "/api/orders/track"
    );
  });

  it("przy błędzie≠404 z sklepu nie próbuje /api/custom-orders/track", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Internal error" }), {
          status: 500,
          headers: { "content-type": "application/json" },
        })
      )
    );

    await expect(trackOrderPublic("1", "u@e.com")).rejects.toThrow(ApiError);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});

describe("applyCustomEstimatedPriceFromPreferences", () => {
  it("ustawia cenę pierwszego wiersza dla custom", () => {
    const base = {
      kind: "custom" as const,
      orderNumber: "CUSTOM-1",
      email: "",
      placedAt: "",
      estimatedDelivery: "",
      status: "received" as const,
      items: [
        {
          id: "line",
          name: "X",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    };
    const next = applyCustomEstimatedPriceFromPreferences(base, { estimatedPrice: 99.5 });
    expect(next.items?.[0]?.unitPrice).toBe(99.5);
  });

  it("zostawia rekord bez zmian gdy brak ceny w preferences", () => {
    const base = {
      kind: "custom" as const,
      orderNumber: "CUSTOM-1",
      email: "",
      placedAt: "",
      estimatedDelivery: "",
      status: "received" as const,
      items: [{ id: "a", name: "X", quantity: 1, unitPrice: 0 }],
    };
    expect(applyCustomEstimatedPriceFromPreferences(base, {})).toEqual(base);
  });
});

describe("getMyOrdersMerged — równoległe GET", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("łączy orders/my i custom-orders/my", async () => {
    const shopPayload = [
      {
        id: 1,
        customerId: 1,
        status: "SUBMITTED",
        totalAmount: 10,
        createdAt: "2026-06-01T12:00:00.000Z",
        deliveredAt: null,
        items: [
          {
            productId: 1,
            productName: "Wino",
            quantity: 1,
            unitPrice: 10,
          },
        ],
      },
    ];
    const customPayload = [
      {
        id: 5,
        customerId: 1,
        description: "Trunek",
        preferences: { estimatedPrice: 108.99 },
        status: "PENDING",
        createdAt: "2026-06-02T12:00:00.000Z",
        updatedAt: "2026-06-02T12:00:00.000Z",
        clientOrderNumber: "830868",
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/api/orders/my")) {
          return Promise.resolve(
            new Response(JSON.stringify(shopPayload), {
              status: 200,
              headers: { "content-type": "application/json" },
            })
          );
        }
        if (url.includes("/api/custom-orders/my")) {
          return Promise.resolve(
            new Response(JSON.stringify(customPayload), {
              status: 200,
              headers: { "content-type": "application/json" },
            })
          );
        }
        return Promise.reject(new Error(`unexpected: ${url}`));
      })
    );

    const merged = await getMyOrdersMerged("token", "c@x.pl");
    expect(merged).toHaveLength(2);
    expect(merged[0].kind).toBe("custom"); // nowsza data
    expect(merged[0].orderNumber).toBe("CUSTOM-5");
    expect(merged[1].kind).toBe("shop");
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });
});
