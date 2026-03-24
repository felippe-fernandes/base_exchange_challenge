import type {
  Order,
  CreateOrderInput,
  StatusHistoryEntry,
  Execution,
} from "@/types/order";
import { request } from "./client";

export async function getOrders(
  params?: Record<string, string>,
): Promise<Order[]> {
  const searchParams = new URLSearchParams(params);
  const query = searchParams.toString();
  return request<Order[]>(`/orders${query ? `?${query}` : ""}`);
}

export async function getOrder(id: string): Promise<Order> {
  return request<Order>(`/orders/${id}`);
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const now = new Date().toISOString();
  return request<Order>("/orders", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      remainingQuantity: input.quantity,
      status: "open",
      createdAt: now,
      updatedAt: now,
    }),
  });
}

export async function cancelOrder(id: string): Promise<Order> {
  return request<Order>(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      status: "cancelled",
      remainingQuantity: 0,
      updatedAt: new Date().toISOString(),
    }),
  });
}

export async function getOrderHistory(
  orderId: string,
): Promise<StatusHistoryEntry[]> {
  return request<StatusHistoryEntry[]>(
    `/statusHistory?orderId=${orderId}&_sort=timestamp&_order=desc`,
  );
}

export async function getExecutions(orderId: string): Promise<Execution[]> {
  const [asBuy, asSell] = await Promise.all([
    request<Execution[]>(`/executions?buyOrderId=${orderId}`),
    request<Execution[]>(`/executions?sellOrderId=${orderId}`),
  ]);
  return [...asBuy, ...asSell];
}
