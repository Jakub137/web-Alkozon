"use client";

import { Client, type IMessage } from "@stomp/stompjs";
import type { BackendOrderStatus } from "@/types/order";

export type OrderRealtimeEventType =
  | "ORDER_SUBMITTED"
  | "ORDER_STATUS_CHANGED"
  | "DISPATCH_PENDING"
  | "DELIVERY_ASSIGNED"
  | "ORDER_DELIVERED"
  | "ORDER_CANCELLED";

/** Payload STOMP z `/user/queue/order-updates` (zgodny z OrderRealtimeEvent.java). */
export interface OrderStatusUpdateEvent {
  type?: OrderRealtimeEventType;
  orderId: number;
  clientOrderNumber?: string | null;
  status: BackendOrderStatus | string;
  deliveryId?: number;
  courierUserId?: number;
}

function resolveWsUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_WS_URL;
  if (explicit) return explicit;

  const api = process.env.NEXT_PUBLIC_API_URL || "https://api-alcozon.onrender.com";
  if (api.startsWith("https://")) {
    return api.replace("https://", "wss://") + "/ws";
  }
  if (api.startsWith("http://")) {
    return api.replace("http://", "ws://") + "/ws";
  }
  return "ws://localhost:8080/ws";
}

function parseEvent(message: IMessage): OrderStatusUpdateEvent | null {
  try {
    const data = JSON.parse(message.body) as Partial<OrderStatusUpdateEvent>;
    if (typeof data.orderId !== "number" || typeof data.status !== "string") {
      return null;
    }
    return {
      type: data.type as OrderRealtimeEventType | undefined,
      orderId: data.orderId,
      clientOrderNumber: data.clientOrderNumber ?? null,
      status: data.status,
      deliveryId: data.deliveryId,
      courierUserId: data.courierUserId,
    };
  } catch {
    return null;
  }
}

export function subscribeOrderStatusUpdates(
  accessToken: string,
  onEvent: (event: OrderStatusUpdateEvent) => void
) {
  const client = new Client({
    brokerURL: resolveWsUrl(),
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  client.onConnect = () => {
    client.subscribe("/user/queue/order-updates", (message) => {
      const event = parseEvent(message);
      if (event) {
        onEvent(event);
      }
    });
  };
  client.onStompError = (frame) => {
    // Non-fatal: auto-reconnect is enabled and pages can continue in REST mode.
    console.warn("[STOMP] Broker error", frame.headers["message"] || "Unknown error");
  };
  client.onWebSocketError = (event) => {
    console.warn("[STOMP] WebSocket error", event);
  };
  client.onWebSocketClose = (event) => {
    if (event.code !== 1000) {
      console.warn("[STOMP] WebSocket closed unexpectedly", event.code, event.reason || "");
    }
  };

  client.activate();
  return () => {
    void client.deactivate();
  };
}
