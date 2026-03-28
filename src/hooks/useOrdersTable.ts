"use client";

import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import {
  type ColumnDef,
  type ColumnSizingState,
  type ExpandedState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { OrdersParams, PaginatedOrders } from "@/lib/api/orders";
import { getOrders } from "@/lib/api/orders";
import type { Order } from "@/types/order";
import { useDataTableStore } from "@/stores/dataTableStore";
import { useUserConfigStore } from "@/stores/userConfigStore";
import { useSearchParamsNavigation } from "./useSearchParamsNavigation";

const RESIZE_SAVE_DELAY = 300;

interface UseOrdersTableProps {
  initialData: PaginatedOrders;
  params: OrdersParams;
  columns: ColumnDef<Order, unknown>[];
}

export function useOrdersTable({ initialData, params, columns }: UseOrdersTableProps) {
  const { navigate } = useSearchParamsNavigation();
  const { setTotalItems } = useDataTableStore();
  const { columnOrder, setColumnOrder, columnSizing: savedSizing, setColumnSizing } = useUserConfigStore();
  const initialPage = params.page ?? 1;

  const [newOrders, setNewOrders] = useState<Order[]>([]);
  const [extraPages, setExtraPages] = useState<Order[][]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isPending, startTransition] = useTransition();
  const [localSizing, setLocalSizing] = useState<ColumnSizingState>(savedSizing);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const prevDataRef = useRef(initialData);
  if (prevDataRef.current !== initialData) {
    prevDataRef.current = initialData;
    setNewOrders([]);
    setExtraPages([]);
    setCurrentPage(initialPage);
    setExpanded({});
  }

  const perPage = params.perPage ?? 50;
  const totalItems = initialData.items;
  const totalPages = Math.ceil(totalItems / perPage);
  const hasNextPage = currentPage < totalPages;

  const loadMore = useCallback(() => {
    if (isPending || !hasNextPage) return;

    const nextPage = currentPage + 1;

    startTransition(async () => {
      const result = await getOrders({ ...params, page: nextPage });
      setExtraPages((prev) => [...prev, result.data]);
      setCurrentPage(nextPage);
      setTotalItems(result.items);

      navigate((p) => {
        p.set("page", String(nextPage));
      }, { resetPage: false });
    });
  }, [currentPage, hasNextPage, isPending, params, navigate, setTotalItems]);

  const addOrder = useCallback((order: Order) => {
    setNewOrders((prev) => [order, ...prev]);
  }, []);

  const allOrders = useMemo(
    () => [...newOrders, ...initialData.data, ...extraPages.flat()],
    [newOrders, initialData.data, extraPages],
  );

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

  return { table, orders: allOrders, hasNextPage, isLoadingMore: isPending, loadMore, totalItems, addOrder };
}