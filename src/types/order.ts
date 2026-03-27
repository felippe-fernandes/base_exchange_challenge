import { z } from "zod/v4";
import {
  OrderSchema,
  OrderSideSchema,
  OrderStatusSchema,
  CreateOrderSchema,
  ExecutionSchema,
  StatusHistoryEntrySchema,
  MoneySchema,
} from "@/lib/schemas/order.schema";

export type Money = z.infer<typeof MoneySchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderSide = z.infer<typeof OrderSideSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type Execution = z.infer<typeof ExecutionSchema>;
export type StatusHistoryEntry = z.infer<typeof StatusHistoryEntrySchema>;
