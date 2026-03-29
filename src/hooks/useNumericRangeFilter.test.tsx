import "@/test/navigation";
import { pushMock, resetNavigationState, setNavigationState } from "@/test/navigation";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useNumericRangeFilter } from "./useNumericRangeFilter";

describe("useNumericRangeFilter", () => {
  beforeEach(() => {
    resetNavigationState();
  });

  it("reads and applies numeric ranges", () => {
    setNavigationState({ search: "price_gte=1&price_lte=10" });
    const { result } = renderHook(() => useNumericRangeFilter("price"));
    expect(result.current.min).toBe(1);
    expect(result.current.max).toBe(10);
    result.current.setRange(2, 20);
    expect(pushMock).toHaveBeenCalledWith("/orders?price_gte=2&price_lte=20");
  });

  it("clears numeric ranges", () => {
    setNavigationState({ search: "price_gte=1" });
    const { result } = renderHook(() => useNumericRangeFilter("price"));
    result.current.clearFilter();
    expect(pushMock).toHaveBeenCalledWith("/orders?");
  });
});
