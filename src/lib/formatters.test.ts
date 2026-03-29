import { describe, expect, it } from "vitest";
import {
  cleanQueryString,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatFilterValue,
  formatNumber,
  formatOrderLabel,
  normalizeToIso,
  startOfTodayIso,
  toCompactIso,
  toLocalDatetime,
} from "./formatters";

describe("formatters", () => {
  it("formats currency and numbers", () => {
    expect(formatCurrency(12.5, "USD")).toBe("$12.50");
    expect(formatNumber(12345)).toBe("12,345");
  });

  it("formats dates", () => {
    expect(formatDateTime("2026-03-01T10:30:00.000Z")).toContain("2026-03-01");
    expect(formatDate("2026-03-01T10:30:00.000Z")).toBe("2026-03-01");
  });

  it("converts local date input values", () => {
    expect(toLocalDatetime("2026-03-01T10:30:00.000Z")).toHaveLength(16);
    expect(toCompactIso("2026-03-01T10:30")).toMatch(/^2026-03-01T\d{2}:30Z$/);
    expect(toCompactIso("")).toBe("");
  });

  it("produces helper values", () => {
    expect(startOfTodayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(normalizeToIso("2026-03-01")).toContain("2026-03-01T");
    expect(normalizeToIso("not-a-date")).toBeUndefined();
    expect(formatOrderLabel({ instrument: "AAPL", id: "1234567890" })).toBe("AAPL #12345678");
  });

  it("cleans query strings and filter values", () => {
    const params = new URLSearchParams({ createdAt_gte: "2026-03-01T10:30" });
    expect(cleanQueryString(params)).toContain("createdAt_gte=2026-03-01T10:30");
    expect(formatFilterValue("plain")).toBe("plain");
    expect(formatFilterValue("2026-03-01T10:30:00.000Z")).toMatch(/Mar|AM|PM/);
  });
});
