import { z } from "zod/v4";

export const OrderSideSchema = z.enum(["buy", "sell"]);

export const OrderStatusSchema = z.enum([
  "open",
  "partial",
  "executed",
  "cancelled",
]);

export const MoneySchema = z.object({
  value: z.number().positive(),
  ccy: z.string().min(1),
});

export const OrderSchema = z.object({
  id: z.uuid(),
  instrument: z.string().min(1),
  side: OrderSideSchema,
  price: MoneySchema,
  quantity: z.number().int().positive(),
  remainingQuantity: z.number().int().min(0),
  status: OrderStatusSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const CreateOrderSchema = z.object({
  instrument: z.string().min(1, { error: "Instrument is required" }),
  side: OrderSideSchema,
  price: MoneySchema,
  quantity: z
    .number({ error: "Quantity is required" })
    .int({ error: "Quantity must be a whole number" })
    .positive({ error: "Quantity must be positive" }),
});

export const ExecutionSchema = z.object({
  id: z.uuid(),
  buyOrderId: z.uuid(),
  sellOrderId: z.uuid(),
  instrument: z.string().min(1),
  price: MoneySchema,
  quantity: z.number().int().positive(),
  executedAt: z.iso.datetime(),
});

export const StatusHistoryEntrySchema = z.object({
  id: z.uuid(),
  orderId: z.uuid(),
  fromStatus: OrderStatusSchema.nullable(),
  toStatus: OrderStatusSchema,
  timestamp: z.iso.datetime(),
  reason: z.string(),
});
