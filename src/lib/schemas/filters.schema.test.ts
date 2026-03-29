import { describe, expect, it } from "vitest";
import { OrderFiltersSchema } from "./filters.schema";

describe("OrderFiltersSchema", () => {
  it("accepts optional filters", () => {
    expect(OrderFiltersSchema.parse({ instrument: "AAPL", side: "buy" })).toEqual({
      instrument: "AAPL",
      side: "buy",
    });
  });
});
