import { afterEach, describe, expect, it, vi } from "vitest";
import * as client from "./client";
import {
  cancelOrder,
  createOrder,
  getExecutions,
  getFilterValues,
  getOrder,
  getOrderHistory,
  getOrders,
  getRangeValues,
  reseedOrders,
} from "./orders";

describe("orders api", () => {
  const requestSpy = vi.spyOn(client, "request").mockResolvedValue({} as never);

  afterEach(() => {
    requestSpy.mockClear();
  });

  it("builds order list query params", async () => {
    await getOrders({ page: 2, perPage: 10, sort: "-createdAt", status: "open" });
    expect(requestSpy).toHaveBeenCalledWith("/orders?_page=2&_per_page=10&_sort=-createdAt&status=open");
  });

  it("calls order detail and mutation endpoints", async () => {
    await getOrder("1");
    await createOrder({ instrument: "AAPL", side: "buy", price: { value: 1, ccy: "USD" }, quantity: 1 });
    await cancelOrder("1");
    expect(requestSpy).toHaveBeenNthCalledWith(1, "/orders/1");
    expect(requestSpy).toHaveBeenNthCalledWith(2, "/orders", expect.objectContaining({ method: "POST" }));
    expect(requestSpy).toHaveBeenNthCalledWith(3, "/orders/1", expect.objectContaining({ method: "PATCH" }));
  });

  it("calls secondary endpoints", async () => {
    await getOrderHistory("1");
    await getExecutions("1", { page: 3, perPage: 5, q: "abc" });
    await getFilterValues("status", "op");
    await getRangeValues("price");
    await reseedOrders(1200);

    expect(requestSpy).toHaveBeenNthCalledWith(1, "/statusHistory?orderId=1&_sort=-timestamp");
    expect(requestSpy).toHaveBeenNthCalledWith(2, "/executions/by-order/1?_page=3&_per_page=5&q=abc");
    expect(requestSpy).toHaveBeenNthCalledWith(3, "/orders/filters/status?q=op");
    expect(requestSpy).toHaveBeenNthCalledWith(4, "/orders/range/price");
    expect(requestSpy).toHaveBeenNthCalledWith(5, "/admin/reseed", expect.objectContaining({ method: "POST" }));
  });
});
