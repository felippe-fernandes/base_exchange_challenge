"use client";

import type { OrdersParams, PaginatedOrders } from "@/lib/api/orders";
import { getOrders } from "@/lib/api/orders";
import type { Order } from "@/types/order";
import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import { useSearchParamsNavigation } from "./useSearchParamsNavigation";

interface UseInfiniteOrdersProps {
  initialData: PaginatedOrders;
  params: OrdersParams;
}

export function useInfiniteOrders({ initialData, params }: UseInfiniteOrdersProps) {
  const { navigate } = useSearchParamsNavigation();
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

      navigate((p) => {
        p.set("page", String(nextPage));
      }, { resetPage: false });
    });
  }, [currentPage, hasNextPage, isPending, params, navigate]);

  const orders = useMemo(
    () => [initialData.data, ...extraPages].flat(),
    [initialData.data, extraPages],
  );

  return { orders, hasNextPage, isLoadingMore: isPending, loadMore, totalItems };
}