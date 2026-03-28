import type { OrdersParams, ExecutionsParams } from "./api/orders";

export const queryKeys = {
  orders: {
    all: ["orders"] as const,
    list: (params?: OrdersParams) => [...queryKeys.orders.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.orders.all, "detail", id] as const,
  },
  executions: (orderId: string, params?: ExecutionsParams) =>
    ["executions", orderId, params] as const,
  history: (orderId: string) => ["history", orderId] as const,
  filters: (field: string) => ["filters", field] as const,
  ranges: (field: string) => ["ranges", field] as const,
};
