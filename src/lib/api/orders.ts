import type {
  Order,
  CreateOrderInput,
  StatusHistoryEntry,
  Execution,
} from "@/types/order";
import { request } from "./client";

export interface PaginatedOrders {
  data: Order[];
  pages: number;
  items: number;
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
}

export interface OrdersParams {
  page?: number;
  perPage?: number;
  sort?: string;
  id?: string;
  instrument?: string;
  side?: string;
  status?: string;
}

export async function getOrders(
  params?: OrdersParams,
): Promise<PaginatedOrders> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("_page", String(params.page));
  if (params?.perPage) searchParams.set("_per_page", String(params.perPage));
  if (params?.sort) searchParams.set("_sort", params.sort);
  if (params?.id) searchParams.set("id", params.id);
  if (params?.instrument) searchParams.set("instrument", params.instrument);
  if (params?.side) searchParams.set("side", params.side);
  if (params?.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  return request<PaginatedOrders>(`/orders${query ? `?${query}` : ""}`);
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
    `/statusHistory?orderId=${orderId}&_sort=-timestamp`,
  );
}

export async function getExecutions(orderId: string): Promise<Execution[]> {
  const [asBuy, asSell] = await Promise.all([
    request<Execution[]>(`/executions?buyOrderId=${orderId}`),
    request<Execution[]>(`/executions?sellOrderId=${orderId}`),
  ]);
  return [...asBuy, ...asSell];
}