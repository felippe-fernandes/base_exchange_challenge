"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getOrderHistory } from "@/lib/api/orders";
import { queryKeys } from "@/lib/queryKeys";

export function useOrderDetails(orderId: string) {
  const { data: history } = useSuspenseQuery({
    queryKey: queryKeys.history(orderId),
    queryFn: () => getOrderHistory(orderId),
  });

  return { history };
}
