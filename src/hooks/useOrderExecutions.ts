"use client";

import { use, useCallback, useRef, useState } from "react";
import type { ExecutionsParams, PaginatedExecutions } from "@/lib/api/orders";
import { getExecutions } from "@/lib/api/orders";

const DEBOUNCE_DELAY = 300;

export function useOrderExecutions(
  orderId: string,
  initialPromise: Promise<PaginatedExecutions>,
) {
  const initialData = use(initialPromise);
  const [result, setResult] = useState<PaginatedExecutions>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchPage = useCallback(
    (params?: ExecutionsParams) => {
      setIsLoading(true);
      getExecutions(orderId, params).then((data) => {
        setResult(data);
        setIsLoading(false);
      });
    },
    [orderId],
  );

  const search = useCallback(
    (q: string, perPage?: number) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fetchPage({ q: q || undefined, perPage });
      }, DEBOUNCE_DELAY);
    },
    [fetchPage],
  );

  const goToPage = useCallback(
    (page: number, q?: string, perPage?: number) => {
      fetchPage({ page, q: q || undefined, perPage });
    },
    [fetchPage],
  );

  return {
    executions: result.data,
    totalItems: result.items,
    currentPage: result.page,
    totalPages: result.pages,
    isLoading,
    search,
    goToPage,
  };
}
