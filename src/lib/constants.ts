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
  tableId: "orders",
  defaultSort: "-createdAt",
  columnOrder: ORDER_COLUMNS,
};

export const ORDER_FILTER_LABELS: Record<string, string> = {
  id_like: "ID",
  instrument: "Instrument",
  side: "Side",
  status: "Status",
  price_gte: "Price min",
  price_lte: "Price max",
  quantity_gte: "Qty min",
  quantity_lte: "Qty max",
  remainingQuantity_gte: "Remaining min",
  remainingQuantity_lte: "Remaining max",
  createdAt_gte: "Date from",
  createdAt_lte: "Date to",
};

export const CURRENCIES = [
  "USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "NZD",
  "CNY", "HKD", "SGD", "KRW", "INR", "BRL", "MXN", "ZAR",
  "SEK", "NOK", "DKK", "PLN", "TRY", "THB", "TWD", "AED",
];

export const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

export const DATE_FORMAT_OPTIONS = [
  { value: "iso", label: "YYYY-MM-DD" },
  { value: "br", label: "DD/MM/YYYY" },
  { value: "us", label: "MM/DD/YYYY" },
  { value: "text", label: "Mar 29, 2026" },
] as const;

export const TIME_FORMAT_OPTIONS = [
  { value: "24h", label: "24-hour" },
  { value: "12h", label: "12-hour" },
] as const;
