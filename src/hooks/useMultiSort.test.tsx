import { renderHook } from "@testing-library/react";
import "@/test/navigation";
import { pushMock, resetNavigationState, setNavigationState } from "@/test/navigation";
import { useUserConfigStore } from "@/stores/userConfigStore";
import { parseSortParam, useMultiSort } from "./useMultiSort";

describe("parseSortParam", () => {
  it("parses sort strings", () => {
    expect(parseSortParam("-price,createdAt")).toEqual([
      { field: "price", direction: "desc" },
      { field: "createdAt", direction: "asc" },
    ]);
  });
});

describe("useMultiSort", () => {
  beforeEach(() => {
    resetNavigationState();
    useUserConfigStore.setState({
      tableDefaults: { defaultSort: "-createdAt", columnOrder: [] },
    });
  });

  it("reads sort state and toggles fields", () => {
    setNavigationState({ search: "sort=-price" });
    const { result } = renderHook(() => useMultiSort());

    expect(result.current.getSortState("price")).toEqual({ direction: "desc", priority: 1 });
    result.current.toggleSort("createdAt", true);
    expect(pushMock).toHaveBeenCalledWith("/orders?sort=-price%2CcreatedAt");
  });
});
