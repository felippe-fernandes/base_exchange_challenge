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
  toLocalDateInput,
  toLocalDatetime,
} from "./formatters";

describe("formatters", () => {
  it("formats currency and numbers", () => {
    expect(formatCurrency(12.5, "USD")).toBe("$12.50");
    expect(formatNumber(12345)).toBe("12,345");
  });

  it("formats dates using the selected presets", () => {
    expect(formatDateTime("2026-03-01T10:30:00.000Z", { dateFormat: "iso", timeFormat: "24h" })).toMatch(/^2026-03-01 \d{2}:\d{2}:\d{2}$/);
    expect(formatDateTime("2026-03-01T10:30:00.000Z", { dateFormat: "br", timeFormat: "24h" })).toMatch(/^01\/03\/2026 \d{2}:\d{2}:\d{2}$/);
    expect(formatDateTime("2026-03-01T10:30:00.000Z", { dateFormat: "us", timeFormat: "24h" })).toMatch(/^03\/01\/2026 \d{2}:\d{2}:\d{2}$/);
    expect(formatDateTime("2026-03-01T10:30:00.000Z", { dateFormat: "text", timeFormat: "12h" })).toContain("Mar 1, 2026");
    expect(formatDate("2026-03-01T10:30:00.000Z", { dateFormat: "iso" })).toBe("2026-03-01");
  });

  it("converts local date input values", () => {
    expect(toLocalDatetime("2026-03-01T10:30:00.000Z")).toHaveLength(16);
    expect(toLocalDatetime("2026-03-01")).toBe("2026-03-01T00:00");
    expect(toCompactIso("2026-03-01T10:30")).toMatch(/^2026-03-01T\d{2}:30Z$/);
    expect(toCompactIso("")).toBe("");
    expect(toLocalDateInput("2026-03-01")).toBe("2026-03-01");
  });

  it("produces helper values", () => {
    expect(startOfTodayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(normalizeToIso("2026-03-01")).toContain("2026-03-01T");
    expect(normalizeToIso("2026-03-01", "end")).toContain("2026-03-");
    expect(normalizeToIso("not-a-date")).toBeUndefined();
    expect(formatOrderLabel({ instrument: "AAPL", id: "1234567890" })).toBe("AAPL #12345678");
  });

  it("cleans query strings and filter values", () => {
    const params = new URLSearchParams({ createdAt_gte: "2026-03-01T10:30" });
    expect(cleanQueryString(params)).toContain("createdAt_gte=2026-03-01T10:30");
    expect(formatFilterValue("plain")).toBe("plain");
    expect(formatFilterValue("2026-03-01T10:30:00.000Z", { dateFormat: "us", timeFormat: "12h" })).toMatch(/^03\/01\/2026 \d{2}:\d{2}:\d{2} (AM|PM)$/);
    expect(formatFilterValue("2026-03-01", { dateFormat: "br" })).toBe("01/03/2026");
  });
});
