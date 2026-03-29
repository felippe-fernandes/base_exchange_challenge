import { describe, expect, it } from "vitest";
import { parseOrdersParams } from "./parseOrdersParams";

describe("parseOrdersParams", () => {
  it("applies defaults and parses values", () => {
    const result = parseOrdersParams({
      page: "0",
      perPage: "20",
      sort: "-price",
      id_like: "abc",
      instrument: "AAPL",
      side: "buy",
      status: "open",
      price_gte: "10",
      price_lte: "20",
      quantity_gte: "1",
      quantity_lte: "2",
      remainingQuantity_gte: "3",
      remainingQuantity_lte: "4",
      createdAt_gte: "2026-03-01",
      createdAt_lte: "2026-03-02",
    });

    expect(result).toMatchObject({
      page: 1,
      perPage: 20,
      sort: "-price",
      id_like: "abc",
      instrument: "AAPL",
      side: "buy",
      status: "open",
      price_gte: 10,
      price_lte: 20,
      quantity_gte: 1,
      quantity_lte: 2,
      remainingQuantity_gte: 3,
      remainingQuantity_lte: 4,
    });
    expect(result.createdAt_gte).toContain("2026-03-01T");
    expect(result.createdAt_lte).toContain("2026-03-02T");
  });

  it("falls back to defaults", () => {
    const result = parseOrdersParams({});
    expect(result.page).toBe(1);
    expect(result.perPage).toBe(50);
    expect(result.sort).toBe("-createdAt");
  });
});
