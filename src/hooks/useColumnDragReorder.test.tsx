import { renderHook } from "@testing-library/react";
import { useColumnDragReorder } from "./useColumnDragReorder";

describe("useColumnDragReorder", () => {
  it("reorders columns on drop", () => {
    const setColumnOrder = vi.fn();
    const table = {
      getState: () => ({ columnOrder: ["id", "price"] }),
      getAllLeafColumns: () => [{ id: "id" }, { id: "price" }],
      setColumnOrder,
    } as never;

    const { result } = renderHook(() => useColumnDragReorder(table));
    const event = {
      preventDefault: vi.fn(),
      dataTransfer: {
        getData: vi.fn(() => "id"),
        setData: vi.fn(),
        types: ["application/x-column-id"],
      },
    } as unknown as React.DragEvent;

    result.current.onDrop(event, "price");
    expect(setColumnOrder).toHaveBeenCalledWith(["price", "id"]);
  });
});
