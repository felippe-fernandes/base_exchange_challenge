"use client";

import { useCallback, useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ExecutionsParams } from "@/lib/api/orders";
import { getExecutions } from "@/lib/api/orders";
import { queryKeys } from "@/lib/queryKeys";

const DEBOUNCE_DELAY = 300;

export function useOrderExecutions(orderId: string) {
  const [params, setParams] = useState<ExecutionsParams>({});
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { data } = useSuspenseQuery({
    queryKey: queryKeys.executions(orderId, params),
    queryFn: () => getExecutions(orderId, params),
  });

  const search = useCallback((q: string, perPage?: number) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, q: q || undefined, perPage, page: undefined }));
    }, DEBOUNCE_DELAY);
  }, []);

  const goToPage = useCallback((page: number, q?: string, perPage?: number) => {
    setParams((prev) => ({ ...prev, page, q: q || undefined, perPage }));
  }, []);

  return {
    executions: data.data,
    totalItems: data.items,
    currentPage: data.page,
    totalPages: data.pages,
    search,
    goToPage,
  };
}
