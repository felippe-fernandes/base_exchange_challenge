import type { OrdersParams } from "@/lib/api/orders";
import { DEFAULT_USER_CONFIG } from "@/lib/schemas/userConfig.schema";

const DEFAULTS = { perPage: DEFAULT_USER_CONFIG.perPage, sort: DEFAULT_USER_CONFIG.defaultSort } as const;

function optionalNumber(val?: string): number | undefined {
  return val ? Number(val) : undefined;
}

export function parseOrdersParams(
  raw: Record<string, string | undefined>,
): OrdersParams {
  return {
    page: raw.page ? Math.max(1, Number(raw.page)) : 1,
    perPage: raw.perPage ? Number(raw.perPage) : DEFAULTS.perPage,
    sort: raw.sort || DEFAULTS.sort,
    id_like: raw.id_like,
    instrument: raw.instrument,
    side: raw.side,
    status: raw.status,
    price_gte: optionalNumber(raw.price_gte),
    price_lte: optionalNumber(raw.price_lte),
    quantity_gte: optionalNumber(raw.quantity_gte),
    quantity_lte: optionalNumber(raw.quantity_lte),
    remainingQuantity_gte: optionalNumber(raw.remainingQuantity_gte),
    remainingQuantity_lte: optionalNumber(raw.remainingQuantity_lte),
    createdAt_gte: raw.createdAt_gte,
    createdAt_lte: raw.createdAt_lte,
  };
}
