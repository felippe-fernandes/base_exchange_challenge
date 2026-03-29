"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reseedOrders } from "@/lib/api/orders";
import { queryKeys } from "@/lib/queryKeys";

export function useReseedOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reseedOrders,
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      void queryClient.invalidateQueries({ queryKey: ["executions"] });
      void queryClient.invalidateQueries({ queryKey: ["history"] });
      void queryClient.invalidateQueries({ queryKey: ["filters"] });
      void queryClient.invalidateQueries({ queryKey: ["ranges"] });

      toast.success("Database regenerated", {
        description: `${result.orders} orders created`,
      });
    },
    onError: () => {
      toast.error("Failed to regenerate database");
    },
  });
}
