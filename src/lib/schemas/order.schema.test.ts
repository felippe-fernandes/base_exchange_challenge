import { describe, expect, it } from "vitest";
import {
  CreateOrderSchema,
  ExecutionSchema,
  MoneySchema,
  OrderSchema,
  StatusHistoryEntrySchema,
} from "./order.schema";

describe("order schemas", () => {
  it("validates valid entities", () => {
    expect(() => MoneySchema.parse({ value: 1, ccy: "USD" })).not.toThrow();
    expect(() =>
      CreateOrderSchema.parse({
        instrument: "AAPL",
        side: "buy",
        price: { value: 1, ccy: "USD" },
        quantity: 1,
      }),
    ).not.toThrow();
    expect(() =>
      OrderSchema.parse({
        id: "00000000-0000-4000-8000-000000000000",
        instrument: "AAPL",
        side: "buy",
        price: { value: 1, ccy: "USD" },
        quantity: 1,
        remainingQuantity: 1,
        status: "open",
        createdAt: "2026-03-01T00:00:00.000Z",
        updatedAt: "2026-03-01T00:00:00.000Z",
      }),
    ).not.toThrow();
    expect(() =>
      ExecutionSchema.parse({
        id: "00000000-0000-4000-8000-000000000000",
        buyOrderId: "00000000-0000-4000-8000-000000000001",
        sellOrderId: "00000000-0000-4000-8000-000000000002",
        instrument: "AAPL",
        price: { value: 1, ccy: "USD" },
        quantity: 1,
        executedAt: "2026-03-01T00:00:00.000Z",
      }),
    ).not.toThrow();
    expect(() =>
      StatusHistoryEntrySchema.parse({
        id: "00000000-0000-4000-8000-000000000000",
        orderId: "00000000-0000-4000-8000-000000000001",
        fromStatus: null,
        toStatus: "open",
        timestamp: "2026-03-01T00:00:00.000Z",
        reason: "created",
      }),
    ).not.toThrow();
  });

  it("rejects invalid create orders", () => {
    expect(() =>
      CreateOrderSchema.parse({
        instrument: "",
        side: "buy",
        price: { value: -1, ccy: "" },
        quantity: 0,
      }),
    ).toThrow();
  });
});
