import { describe, it, expect, vi, afterEach } from "vitest";
import {
  createCustomOrder,
  getCustomOrderById,
  listMyCustomOrders,
} from "@/lib/api/customOrders";

describe("createCustomOrder", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("wysyła POST /api/custom-orders z clientOrderNumber i description", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 101 }), {
        status: 201,
        headers: { "content-type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await createCustomOrder("jwt-token", {
      clientOrderNumber: "991234",
      description: "Test własne",
      preferences: { base: "vodka", capacity: "0.5L" },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [firstUrl, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(String(firstUrl)).toContain("/api/custom-orders");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject(
      expect.objectContaining({
        Authorization: "Bearer jwt-token",
        "Content-Type": "application/json",
      })
    );
    const body = JSON.parse(init.body as string);
    expect(body.clientOrderNumber).toBe("991234");
    expect(body.description).toBe("Test własne");
    expect(body.preferences.base).toBe("vodka");
    expect(body.preferences.capacity).toBe("0.5L");
  });
});

describe("getCustomOrderById", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("GET /api/custom-orders/:id z tokenem", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 7,
          customerId: 2,
          description: "X",
          preferences: { estimatedPrice: 50 },
          status: "PENDING",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
          clientOrderNumber: "111222",
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const row = await getCustomOrderById("tok", 7);
    expect(row.id).toBe(7);
    expect(row.clientOrderNumber).toBe("111222");
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/api\/custom-orders\/7(\?|$)/);
    expect((fetchMock.mock.calls[0][1] as RequestInit).headers).toMatchObject(
      expect.objectContaining({ Authorization: "Bearer tok" })
    );
  });
});

describe("listMyCustomOrders", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("GET /api/custom-orders/my", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const list = await listMyCustomOrders("abc");
    expect(list).toEqual([]);
    expect(String(fetchMock.mock.calls[0][0])).toContain("/api/custom-orders/my");
    expect((fetchMock.mock.calls[0][1] as RequestInit).headers).toMatchObject(
      expect.objectContaining({ Authorization: "Bearer abc" })
    );
  });
});
