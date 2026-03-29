import { getOrders } from "@/lib/api/orders";
import { DEFAULT_USER_CONFIG } from "@/lib/schemas/userConfig.schema";
import { useUserConfigStore } from "@/stores/userConfigStore";
import { sampleOrder } from "@/test/fixtures";
import { createQueryClientWrapper, createTestQueryClient } from "@/test/testUtils";
import type { ColumnDef } from "@tanstack/react-table";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
      ...DEFAULT_USER_CONFIG,
      tables: {
        orders: {
          columnOrder: ["id", "instrument"],
          columnSizing: {},
        },
      },
      tableDefaults: { tableId: "orders", defaultSort: "-createdAt", columnOrder: ["id", "instrument"] },
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

  it("syncs persisted column sizing into the table state", async () => {
    useUserConfigStore.setState({
      ...useUserConfigStore.getState(),
      tables: {
        orders: {
          columnOrder: ["id", "instrument"],
          columnSizing: { id: 180 },
        },
      },
    });

    const queryClient = createTestQueryClient();
    const { result } = renderHook(
      () => useOrdersTable({ params: { page: 1, perPage: 50 }, columns }),
      {
        wrapper: createQueryClientWrapper(queryClient),
      },
    );

    await waitFor(() => expect(result.current.orders).toEqual([sampleOrder]));
    expect(result.current.table.getState().columnSizing).toMatchObject({ id: 180 });
  });
});
