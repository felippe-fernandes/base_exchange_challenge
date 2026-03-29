import "@/test/navigation";
import { pushMock, resetNavigationState, setNavigationState } from "@/test/navigation";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useDateRangeFilter } from "./useDateRangeFilter";

describe("useDateRangeFilter", () => {
  beforeEach(() => {
    resetNavigationState();
  });

  it("reads and applies date ranges", () => {
    setNavigationState({ search: "createdAt_gte=2026-03-01&createdAt_lte=2026-03-02" });
    const { result } = renderHook(() => useDateRangeFilter("createdAt"));
    expect(result.current.from).toBe("2026-03-01");
    expect(result.current.to).toBe("2026-03-02");
    expect(result.current.hasFilter).toBe(true);

    result.current.setRange("2026-03-03", undefined);
    expect(pushMock).toHaveBeenCalledWith("/orders?createdAt_gte=2026-03-03");
  });

  it("clears date ranges", () => {
    setNavigationState({ search: "createdAt_gte=2026-03-01" });
    const { result } = renderHook(() => useDateRangeFilter("createdAt"));
    result.current.clearFilter();
    expect(pushMock).toHaveBeenCalledWith("/orders?");
  });
});
