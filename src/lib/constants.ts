import type { OrderSide, OrderStatus } from "@/types/order";
import type { TableDefaults } from "@/lib/schemas/userConfig.schema";

export const ORDER_COLUMNS: string[] = [
  "id",
  "instrument",
  "side",
  "price",
  "quantity",
  "remainingQuantity",
  "status",
  "createdAt",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  open: "Open",
  partial: "Partial",
  executed: "Executed",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  open: "bg-blue-100 text-blue-800",
  partial: "bg-yellow-100 text-yellow-800",
  executed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const ORDER_SIDE_LABELS: Record<OrderSide, string> = {
  buy: "Buy",
  sell: "Sell",
};

export const ORDER_SIDE_COLORS: Record<OrderSide, string> = {
  buy: "text-green-600",
  sell: "text-red-600",
};

export const ORDER_TABLE_DEFAULTS: TableDefaults = {
  defaultSort: "-createdAt",
  columnOrder: ORDER_COLUMNS,
};
