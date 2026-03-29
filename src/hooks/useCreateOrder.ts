"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateOrderInput, Order } from "@/types/order";
import type { PaginatedOrders } from "@/lib/api/orders";
import { CreateOrderSchema } from "@/lib/schemas/order.schema";
import { createOrder } from "@/lib/api/orders";
import { orderCreatedToast } from "@/components/orders/createOrder/orderCreatedToast";
import { queryKeys } from "@/lib/queryKeys";

function buildOptimisticOrder(data: CreateOrderInput): Order {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    ...data,
    remainingQuantity: data.quantity,
    status: "open",
    createdAt: now,
    updatedAt: now,
  };
}

interface UseCreateOrderOptions {
  onSuccess?: () => void;
  preferredCurrency?: string;
}

function getDefaultValues(preferredCurrency: string): CreateOrderInput {
  return {
    instrument: "",
    side: "buy",
    price: { value: undefined as unknown as number, ccy: preferredCurrency },
    quantity: undefined as unknown as number,
  };
}

export function useCreateOrder({ onSuccess, preferredCurrency = "USD" }: UseCreateOrderOptions) {
  const queryClient = useQueryClient();

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(CreateOrderSchema),
    defaultValues: getDefaultValues(preferredCurrency),
  });

  const mutation = useMutation({
    mutationFn: createOrder,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.orders.all });

      const queriesData = queryClient.getQueriesData<InfiniteData<PaginatedOrders>>({
        queryKey: queryKeys.orders.all,
      });

      const optimisticOrder = buildOptimisticOrder(input);

      queryClient.setQueriesData<InfiniteData<PaginatedOrders>>(
        { queryKey: queryKeys.orders.all },
        (old) => {
          if (!old) return old;
          const firstPage = old.pages[0];
          return {
            ...old,
            pages: [
              { ...firstPage, data: [optimisticOrder, ...firstPage.data], items: firstPage.items + 1 },
              ...old.pages.slice(1),
            ],
          };
        },
      );

      return { previousData: queriesData, optimisticId: optimisticOrder.id };
    },
    onSuccess: (serverOrder, _input, context) => {
      queryClient.setQueriesData<InfiniteData<PaginatedOrders>>(
        { queryKey: queryKeys.orders.all },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((o) => (o.id === context?.optimisticId ? serverOrder : o)),
            })),
          };
        },
      );
      orderCreatedToast(serverOrder);
      form.reset(getDefaultValues(preferredCurrency));
      onSuccess?.();
    },
    onError: (_err, _input, context) => {
      if (context?.previousData) {
        for (const [key, data] of context.previousData) {
          queryClient.setQueryData(key, data);
        }
      }
      toast.error("Failed to create order");
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return { form, onSubmit, isPending: mutation.isPending };
}
