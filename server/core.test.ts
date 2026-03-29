import {
  addStatusHistory,
  applyFilters,
  applySort,
  getOrderValue,
  hasCustomFilter,
  matchOrder,
  resolveStatus,
} from "./core";

describe("server core helpers", () => {
  const orders = [
    {
      id: "a1",
      instrument: "AAPL",
      side: "buy",
      status: "open",
      price: { value: 100, ccy: "USD" },
      quantity: 10,
      remainingQuantity: 10,
      createdAt: "2026-03-01T10:00:00.000Z",
      updatedAt: "2026-03-01T10:00:00.000Z",
    },
    {
      id: "b2",
      instrument: "AAPL",
      side: "sell",
      status: "partial",
      price: { value: 90, ccy: "USD" },
      quantity: 10,
      remainingQuantity: 5,
      createdAt: "2026-03-01T09:00:00.000Z",
      updatedAt: "2026-03-01T09:00:00.000Z",
    },
    {
      id: "c3",
      instrument: "MSFT",
      side: "sell",
      status: "cancelled",
      price: { value: 200, ccy: "USD" },
      quantity: 20,
      remainingQuantity: 0,
      createdAt: "2026-03-02T09:00:00.000Z",
      updatedAt: "2026-03-02T09:00:00.000Z",
    },
  ];

  it("extracts nested order values", () => {
    expect(getOrderValue(orders[0], "price")).toBe(100);
    expect(getOrderValue(orders[0], "quantity")).toBe(10);
  });

  it("detects custom filters", () => {
    expect(hasCustomFilter({ status: "open,partial" })).toBe(true);
    expect(hasCustomFilter({ id_like: "a1" })).toBe(true);
    expect(hasCustomFilter({ price_gte: "10" })).toBe(true);
    expect(hasCustomFilter({ status: "open" })).toBe(false);
  });

  it("applies filters and sort", () => {
    expect(applyFilters([...orders], { instrument: "AAPL" })).toHaveLength(2);
    expect(applyFilters([...orders], { status: "open,partial" })).toHaveLength(2);
    expect(applyFilters([...orders], { id_like: "b2" })).toEqual([orders[1]]);
    expect(applyFilters([...orders], { price_gte: "95" })).toEqual([orders[0], orders[2]]);
    expect(applyFilters([...orders], { createdAt_lte: "2026-03-01T23:59:59.000Z" })).toHaveLength(2);
    expect(applySort([...orders], "-price")[0].id).toBe("c3");
  });

  it("adds status history entries", () => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("history-id");
    const db = { data: { statusHistory: [] } };
    addStatusHistory(db as never, "a1", null, "open", "now", "created");
    expect(db.data.statusHistory[0]).toMatchObject({
      id: "history-id",
      orderId: "a1",
      toStatus: "open",
    });
  });

  it("resolves status from remaining quantity", () => {
    expect(resolveStatus({ status: "open", quantity: 10, remainingQuantity: 0 })).toBe("executed");
    expect(resolveStatus({ status: "open", quantity: 10, remainingQuantity: 5 })).toBe("partial");
    expect(resolveStatus({ status: "cancelled", quantity: 10, remainingQuantity: 10 })).toBe("cancelled");
  });

  it("matches compatible orders and updates histories", () => {
    vi.spyOn(globalThis.crypto, "randomUUID")
      .mockReturnValueOnce("exec-id")
      .mockReturnValueOnce("candidate-history")
      .mockReturnValueOnce("incoming-history");

    const db = {
      data: {
        orders: [
          {
            id: "sell-1",
            instrument: "AAPL",
            side: "sell",
            status: "open",
            price: { value: 95, ccy: "USD" },
            quantity: 10,
            remainingQuantity: 10,
            createdAt: "2026-03-01T09:00:00.000Z",
            updatedAt: "2026-03-01T09:00:00.000Z",
          },
        ],
        executions: [],
        statusHistory: [],
      },
    };

    const incoming = {
      id: "buy-1",
      instrument: "AAPL",
      side: "buy",
      status: "open",
      price: { value: 100, ccy: "USD" },
      quantity: 8,
      remainingQuantity: 8,
      createdAt: "2026-03-01T10:00:00.000Z",
      updatedAt: "2026-03-01T10:00:00.000Z",
    };

    matchOrder(db as never, incoming as never, "2026-03-01T10:30:00.000Z");

    expect(db.data.executions).toHaveLength(1);
    expect(db.data.executions[0]).toMatchObject({
      id: "exec-id",
      buyOrderId: "buy-1",
      sellOrderId: "sell-1",
      quantity: 8,
    });
    expect(incoming.status).toBe("executed");
    expect(incoming.remainingQuantity).toBe(0);
    expect(db.data.orders[0].status).toBe("partial");
    expect(db.data.orders[0].remainingQuantity).toBe(2);
    expect(db.data.statusHistory).toHaveLength(2);
  });
});
