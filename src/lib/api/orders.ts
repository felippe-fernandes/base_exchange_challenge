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
  id_like?: string;
  instrument?: string;
  side?: string;
  status?: string;
  price_gte?: number;
  price_lte?: number;
  quantity_gte?: number;
  quantity_lte?: number;
  remainingQuantity_gte?: number;
  remainingQuantity_lte?: number;
  createdAt_gte?: string;
  createdAt_lte?: string;
}

export interface RangeValues {
  min: number;
  max: number;
}

const PARAM_MAP: Record<string, string> = {
  page: "_page",
  perPage: "_per_page",
  sort: "_sort",
};

export async function getOrders(
  params?: OrdersParams,
): Promise<PaginatedOrders> {
  const searchParams = new URLSearchParams();

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      const paramName = PARAM_MAP[key] || key;
      searchParams.set(paramName, String(value));
    }
  }

  const query = searchParams.toString();
  return request<PaginatedOrders>(`/orders${query ? `?${query}` : ""}`);
}

export async function getOrder(id: string): Promise<Order> {
  return request<Order>(`/orders/${id}`);
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  return request<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(input),
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

export interface PaginatedExecutions {
  data: Execution[];
  page: number;
  pages: number;
  items: number;
}

export interface ExecutionsParams {
  page?: number;
  perPage?: number;
  q?: string;
}

export async function getExecutions(
  orderId: string,
  params?: ExecutionsParams,
): Promise<PaginatedExecutions> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("_page", String(params.page));
  if (params?.perPage) searchParams.set("_per_page", String(params.perPage));
  if (params?.q) searchParams.set("q", params.q);

  const query = searchParams.toString();
  return request<PaginatedExecutions>(
    `/executions/by-order/${orderId}${query ? `?${query}` : ""}`,
  );
}

export async function getFilterValues(
  field: string,
  query?: string,
): Promise<string[]> {
  const params = query ? `?q=${encodeURIComponent(query)}` : "";
  return request<string[]>(`/orders/filters/${field}${params}`);
}

export async function getRangeValues(field: string): Promise<RangeValues> {
  return request<RangeValues>(`/orders/range/${field}`);
}
