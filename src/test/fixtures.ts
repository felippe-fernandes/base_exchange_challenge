import type { Execution, Order, StatusHistoryEntry } from "@/types/order";

export const sampleOrder: Order = {
  id: "00000000-0000-4000-8000-000000000001",
  instrument: "AAPL",
  side: "buy",
  price: { value: 123.45, ccy: "USD" },
  quantity: 100,
  remainingQuantity: 40,
  status: "partial",
  createdAt: "2026-03-01T10:00:00.000Z",
  updatedAt: "2026-03-01T11:00:00.000Z",
};

export const sampleExecution: Execution = {
  id: "00000000-0000-4000-8000-000000000002",
  buyOrderId: sampleOrder.id,
  sellOrderId: "00000000-0000-4000-8000-000000000003",
  instrument: "AAPL",
  price: { value: 123.45, ccy: "USD" },
  quantity: 60,
  executedAt: "2026-03-01T10:30:00.000Z",
};

export const sampleHistory: StatusHistoryEntry[] = [
  {
    id: "00000000-0000-4000-8000-000000000004",
    orderId: sampleOrder.id,
    fromStatus: null,
    toStatus: "open",
    timestamp: "2026-03-01T10:00:00.000Z",
    reason: "Order created",
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    orderId: sampleOrder.id,
    fromStatus: "open",
    toStatus: "partial",
    timestamp: "2026-03-01T10:30:00.000Z",
    reason: "Partially matched",
  },
];
