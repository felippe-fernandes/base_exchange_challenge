import type { OrdersParams } from "@/lib/api/orders";
import { ORDER_TABLE_DEFAULTS } from "@/lib/constants";
import { normalizeToIso } from "@/lib/formatters";

const DEFAULTS = { perPage: 50, sort: ORDER_TABLE_DEFAULTS.defaultSort } as const;

function optionalNumber(val?: string): number | undefined {
  return val ? Number(val) : undefined;
}

export function parseOrdersParams(
  raw: Record<string, string | undefined>,
): OrdersParams {
  const sort =
    raw.sort === undefined ? DEFAULTS.sort : raw.sort === "none" ? "" : raw.sort;

  return {
    page: raw.page ? Math.max(1, Number(raw.page)) : 1,
    perPage: raw.perPage ? Number(raw.perPage) : DEFAULTS.perPage,
    sort,
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
    createdAt_gte: normalizeToIso(raw.createdAt_gte, "start"),
    createdAt_lte: normalizeToIso(raw.createdAt_lte, "end"),
  };
}
