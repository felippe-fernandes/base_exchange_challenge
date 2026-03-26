"use client";

import { useCallback, useMemo, useRef, useState, useTransition } from "react";
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
  const { setTotalItems } = useOrdersTableStore();
  const initialPage = params.page ?? 1;

  const [extraPages, setExtraPages] = useState<Order[][]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isPending, startTransition] = useTransition();

  const prevDataRef = useRef(initialData);
  if (prevDataRef.current !== initialData) {
    prevDataRef.current = initialData;
    setExtraPages([]);
    setCurrentPage(initialPage);
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