"use client";

import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PaginatedOrders } from "@/lib/api/orders";
import { cancelOrder } from "@/lib/api/orders";
import { queryKeys } from "@/lib/queryKeys";

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: (updatedOrder) => {
      queryClient.setQueriesData<InfiniteData<PaginatedOrders>>(
        { queryKey: queryKeys.orders.all },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
            })),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["executions", updatedOrder.id] });
      queryClient.invalidateQueries({ queryKey: queryKeys.history(updatedOrder.id) });
      toast.success("Order cancelled");
    },
    onError: () => {
      toast.error("Failed to cancel order");
    },
  });
}
