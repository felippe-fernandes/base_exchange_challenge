"use client";

import { use, useCallback, useRef, useState } from "react";
import type { ExecutionsParams } from "@/lib/api/orders";
import { getExecutions } from "@/lib/api/orders";

const DEBOUNCE_DELAY = 300;

export function useOrderExecutions(orderId: string) {
  const [promise, setPromise] = useState(() => getExecutions(orderId));
  const result = use(promise);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchPage = useCallback(
    (params?: ExecutionsParams) => {
      setPromise(getExecutions(orderId, params));
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
    search,
    goToPage,
  };
}