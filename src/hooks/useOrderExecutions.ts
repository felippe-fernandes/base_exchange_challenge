"use client";

import { use, useCallback, useRef, useState, startTransition } from "react";
import type { ExecutionsParams, PaginatedExecutions } from "@/lib/api/orders";
import { getExecutions } from "@/lib/api/orders";

const DEBOUNCE_DELAY = 300;

const promiseCache = new Map<string, Promise<PaginatedExecutions>>();

function getCachedExecutions(orderId: string, params?: ExecutionsParams) {
  const key = JSON.stringify({ orderId, ...params });
  if (!promiseCache.has(key)) {
    promiseCache.set(key, getExecutions(orderId, params));
  }
  return promiseCache.get(key)!;
}

export function useOrderExecutions(orderId: string) {
  const [promise, setPromise] = useState(() => getCachedExecutions(orderId));
  const result = use(promise);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchPage = useCallback(
    (params?: ExecutionsParams) => {
      const key = JSON.stringify({ orderId, ...params });
      const newPromise = getExecutions(orderId, params);
      promiseCache.set(key, newPromise);
      startTransition(() => {
        setPromise(newPromise);
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
    search,
    goToPage,
  };
}