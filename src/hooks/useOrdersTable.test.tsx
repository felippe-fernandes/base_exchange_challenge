import { renderHook, waitFor, act } from "@testing-library/react";
import type { ColumnDef } from "@tanstack/react-table";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { getOrders } from "@/lib/api/orders";
import { useUserConfigStore } from "@/stores/userConfigStore";
import { createQueryClientWrapper, createTestQueryClient } from "@/test/testUtils";
import { sampleOrder } from "@/test/fixtures";
import { useOrdersTable } from "./useOrdersTable";

vi.mock("@/lib/api/orders", () => ({
  getOrders: vi.fn(),
}));

describe("useOrdersTable", () => {
  const columns: ColumnDef<typeof sampleOrder>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "instrument", header: "Instrument" },
  ];

  beforeEach(() => {
    useUserConfigStore.setState({
      defaultSort: "-createdAt",
      perPage: 50,
      columnOrder: ["id", "instrument"],
      columnSizing: {},
      tableDefaults: { defaultSort: "-createdAt", columnOrder: ["id", "instrument"] },
    });
    vi.mocked(getOrders).mockResolvedValue({
      data: [sampleOrder],
      pages: 2,
      items: 2,
      first: 1,
      prev: null,
      next: 2,
      last: 2,
    });
  });

  it("loads rows and exposes table helpers", async () => {
    const queryClient = createTestQueryClient();
    const { result } = renderHook(
      () => useOrdersTable({ params: { page: 1, perPage: 50 }, columns }),
      {
        wrapper: createQueryClientWrapper(queryClient),
      },
    );

    await waitFor(() => expect(result.current.orders).toEqual([sampleOrder]));
    expect(result.current.totalItems).toBe(2);

    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(getOrders).toHaveBeenCalledWith({ page: 2, perPage: 50 });
    });
  });
});
