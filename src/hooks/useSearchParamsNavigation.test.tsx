import "@/test/navigation";
import { pushMock, resetNavigationState, setNavigationState } from "@/test/navigation";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useSearchParamsNavigation } from "./useSearchParamsNavigation";

describe("useSearchParamsNavigation", () => {
  beforeEach(() => {
    resetNavigationState();
  });

  it("updates params and resets page by default", () => {
    setNavigationState({ search: "page=2&status=open" });
    const { result } = renderHook(() => useSearchParamsNavigation());

    result.current.navigate((params) => params.set("status", "closed"));

    expect(pushMock).toHaveBeenCalledWith("/orders?status=closed");
  });

  it("keeps page when resetPage is false", () => {
    setNavigationState({ search: "page=2" });
    const { result } = renderHook(() => useSearchParamsNavigation());

    result.current.navigate((params) => params.set("status", "open"), { resetPage: false });

    expect(pushMock).toHaveBeenCalledWith("/orders?page=2&status=open");
  });
});
