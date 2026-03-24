import { z } from "zod/v4";

export const OrderSideSchema = z.enum(["buy", "sell"]);

export const OrderStatusSchema = z.enum([
  "open",
  "partial",
  "executed",
  "cancelled",
]);

export const OrderSchema = z.object({
  id: z.string(),
  instrument: z.string().min(1),
  side: OrderSideSchema,
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  remainingQuantity: z.number().int().min(0),
  status: OrderStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateOrderSchema = z.object({
  instrument: z.string().min(1, "Instrument is required"),
  side: OrderSideSchema,
  price: z
    .number({ error: "Price is required" })
    .positive("Price must be positive"),
  quantity: z
    .number({ error: "Quantity is required" })
    .int("Quantity must be a whole number")
    .positive("Quantity must be positive"),
});

export const ExecutionSchema = z.object({
  id: z.string(),
  buyOrderId: z.string(),
  sellOrderId: z.string(),
  instrument: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  executedAt: z.string().datetime(),
});

export const StatusHistoryEntrySchema = z.object({
  id: z.string(),
  orderId: z.string(),
  fromStatus: OrderStatusSchema.nullable(),
  toStatus: OrderStatusSchema,
  timestamp: z.string().datetime(),
  reason: z.string(),
});
