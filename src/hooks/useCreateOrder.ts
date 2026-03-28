"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { CreateOrderInput, Order } from "@/types/order";
import { CreateOrderSchema } from "@/lib/schemas/order.schema";
import { createOrder } from "@/lib/api/orders";
import { orderCreatedToast } from "@/components/orders/createOrder/orderCreatedToast";

interface UseCreateOrderOptions {
  onSuccess?: () => void;
  onOrderCreated: (order: Order) => void;
}

export function useCreateOrder({ onSuccess, onOrderCreated }: UseCreateOrderOptions) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(CreateOrderSchema),
    defaultValues: {
      instrument: "",
      side: "buy",
      price: { value: undefined as unknown as number, ccy: "USD" },
      quantity: undefined as unknown as number,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        const order = await createOrder(data);
        onOrderCreated(order);
        orderCreatedToast(order.id);
        form.reset();
        onSuccess?.();
      } catch {
        toast.error("Failed to create order");
      }
    });
  });

  return { form, onSubmit, isPending };
}