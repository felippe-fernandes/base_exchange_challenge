"use client";

import type { OrdersParams, PaginatedOrders } from "@/lib/api/orders";
import { getOrders } from "@/lib/api/orders";
import type { Order } from "@/types/order";
import { useCallback, useMemo, useState, useTransition } from "react";

interface UseInfiniteOrdersProps {
  initialData: PaginatedOrders;
  params: OrdersParams;
}

export function useInfiniteOrders({ initialData, params }: UseInfiniteOrdersProps) {
  const [extraPages, setExtraPages] = useState<Order[][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const totalPages = initialData.pages;
  const totalItems = initialData.items;
  const hasNextPage = currentPage < totalPages;

  const loadMore = useCallback(() => {
    if (isPending || !hasNextPage) return;

    const nextPage = currentPage + 1;

    startTransition(async () => {
      const result = await getOrders({ ...params, page: nextPage });
      setExtraPages((prev) => [...prev, result.data]);
      setCurrentPage(nextPage);
    });
  }, [currentPage, hasNextPage, isPending, params]);

  const orders = useMemo(
    () => [initialData.data, ...extraPages].flat(),
    [initialData.data, extraPages],
  );

  return { orders, hasNextPage, isLoadingMore: isPending, loadMore, totalItems };
}
