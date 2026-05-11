"use client";

import { Client, type IMessage } from "@stomp/stompjs";
import type { BackendOrderStatus } from "@/types/order";

export interface OrderStatusUpdateEvent {
  orderId: number;
  status: BackendOrderStatus;
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
      orderId: data.orderId,
      status: data.status as BackendOrderStatus,
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

  client.activate();
  return () => {
    void client.deactivate();
  };
}
