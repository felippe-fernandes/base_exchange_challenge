import { renderHook } from "@testing-library/react";
import "@/test/navigation";
import { pushMock, resetNavigationState, setNavigationState } from "@/test/navigation";
import { useTextFilter } from "./useTextFilter";
import { describe, it, beforeEach, vi, expect } from "vitest";

describe("useTextFilter", () => {
  beforeEach(() => {
    resetNavigationState();
    vi.useFakeTimers();
  });

  it("debounces text updates", () => {
    setNavigationState({ search: "id_like=abc" });
    const { result } = renderHook(() => useTextFilter("id"));
    expect(result.current.value).toBe("abc");

    result.current.setValue("xyz");
    vi.advanceTimersByTime(300);

    expect(pushMock).toHaveBeenCalledWith("/orders?id_like=xyz");
  });

  it("clears text filter immediately", () => {
    setNavigationState({ search: "id_like=abc" });
    const { result } = renderHook(() => useTextFilter("id"));
    result.current.clearFilter();
    expect(pushMock).toHaveBeenCalledWith("/orders?");
  });
});
