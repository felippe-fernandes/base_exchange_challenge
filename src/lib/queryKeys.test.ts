import { describe, expect, it } from "vitest";
import { queryKeys } from "./queryKeys";

describe("queryKeys", () => {
  it("builds stable key structures", () => {
    expect(queryKeys.orders.all).toEqual(["orders"]);
    expect(queryKeys.orders.list({ page: 1 })).toEqual(["orders", "list", { page: 1 }]);
    expect(queryKeys.orders.detail("1")).toEqual(["orders", "detail", "1"]);
    expect(queryKeys.executions("1", { page: 2 })).toEqual(["executions", "1", { page: 2 }]);
    expect(queryKeys.history("1")).toEqual(["history", "1"]);
    expect(queryKeys.filters("status")).toEqual(["filters", "status"]);
    expect(queryKeys.ranges("price")).toEqual(["ranges", "price"]);
  });
});
