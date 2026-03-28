"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  type ColumnDef,
  type ColumnSizingState,
  type ExpandedState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { OrdersParams } from "@/lib/api/orders";
import { getOrders } from "@/lib/api/orders";
import type { Order } from "@/types/order";
import { useUserConfigStore } from "@/stores/userConfigStore";
import { queryKeys } from "@/lib/queryKeys";

const RESIZE_SAVE_DELAY = 300;

interface UseOrdersTableProps {
  params: OrdersParams;
  columns: ColumnDef<Order, unknown>[];
}

export function useOrdersTable({ params, columns }: UseOrdersTableProps) {
  const { columnOrder, setColumnOrder, columnSizing: savedSizing, setColumnSizing } = useUserConfigStore();

  const [localSizing, setLocalSizing] = useState<ColumnSizingState>(savedSizing);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const perPage = params.perPage ?? 50;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: ({ pageParam }) => getOrders({ ...params, page: pageParam, perPage }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  });

  const allOrders = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  const totalItems = data?.pages[0]?.items ?? 0;

  const loadMore = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const table = useReactTable({
    data: allOrders,
    columns,
    getRowId: (row) => row.id,
    state: {
      columnOrder,
      columnSizing: localSizing,
      expanded,
    },
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
    onColumnOrderChange: (updater) => {
      const newOrder = typeof updater === "function" ? updater(columnOrder) : updater;
      setColumnOrder(newOrder);
    },
    onColumnSizingChange: (updater) => {
      setLocalSizing((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => setColumnSizing(next), RESIZE_SAVE_DELAY);
        return next;
      });
    },
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
  });

  return { table, orders: allOrders, hasNextPage: !!hasNextPage, isLoadingMore: isFetchingNextPage, isLoading, loadMore, totalItems };
}
