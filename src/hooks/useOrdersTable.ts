"use client";

import { useCallback, useMemo, useRef, useTransition } from "react";
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { OrdersParams, PaginatedOrders } from "@/lib/api/orders";
import { getOrders } from "@/lib/api/orders";
import type { Order } from "@/types/order";
import { useOrdersTableStore } from "@/stores/ordersTableStore";
import { useSearchParamsNavigation } from "./useSearchParamsNavigation";

interface UseOrdersTableProps {
  initialData: PaginatedOrders;
  params: OrdersParams;
  columns: ColumnDef<Order, unknown>[];
}

export function useOrdersTable({ initialData, params, columns }: UseOrdersTableProps) {
  const { navigate } = useSearchParamsNavigation();
  const initialPage = params.page ?? 1;

  const { extraPages, currentPage, addPage, reset } = useOrdersTableStore();
  const [isPending, startTransition] = useTransition();

  const prevDataRef = useRef(initialData);
  if (prevDataRef.current !== initialData) {
    prevDataRef.current = initialData;
    reset(initialPage);
  }

  const totalPages = initialData.pages;
  const totalItems = initialData.items;
  const hasNextPage = currentPage < totalPages;

  const loadMore = useCallback(() => {
    if (isPending || !hasNextPage) return;

    const nextPage = currentPage + 1;

    startTransition(async () => {
      const result = await getOrders({ ...params, page: nextPage });
      addPage(nextPage, result.data);

      navigate((p) => {
        p.set("page", String(nextPage));
      }, { resetPage: false });
    });
  }, [currentPage, hasNextPage, isPending, params, navigate, addPage]);

  const orders = useMemo(
    () => [initialData.data, ...extraPages].flat(),
    [initialData.data, extraPages],
  );

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
  });

  return { table, orders, hasNextPage, isLoadingMore: isPending, loadMore, totalItems };
}