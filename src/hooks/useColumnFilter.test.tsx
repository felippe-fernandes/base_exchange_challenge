import { renderHook } from "@testing-library/react";
import "@/test/navigation";
import { pushMock, resetNavigationState, setNavigationState } from "@/test/navigation";
import { useColumnFilter } from "./useColumnFilter";

describe("useColumnFilter", () => {
  beforeEach(() => {
    resetNavigationState();
  });

  it("reads and toggles selected values", () => {
    setNavigationState({ search: "status=open,partial" });
    const { result } = renderHook(() => useColumnFilter("status"));

    expect(result.current.selectedValues).toEqual(["open", "partial"]);
    result.current.toggleValue("executed");
    expect(pushMock).toHaveBeenCalledWith("/orders?status=open%2Cpartial%2Cexecuted");
  });

  it("clears filters", () => {
    setNavigationState({ search: "status=open" });
    const { result } = renderHook(() => useColumnFilter("status"));
    result.current.clearFilter();
    expect(pushMock).toHaveBeenCalledWith("/orders?");
  });
});
