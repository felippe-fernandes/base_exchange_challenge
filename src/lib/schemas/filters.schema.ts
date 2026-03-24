import { z } from "zod/v4";
import { OrderSideSchema, OrderStatusSchema } from "./order.schema";

export const OrderFiltersSchema = z.object({
  id: z.string().optional(),
  instrument: z.string().optional(),
  side: OrderSideSchema.optional(),
  status: OrderStatusSchema.optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type OrderFilters = z.infer<typeof OrderFiltersSchema>;
