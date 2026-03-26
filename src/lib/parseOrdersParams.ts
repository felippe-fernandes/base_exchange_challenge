import type { OrdersParams } from "@/lib/api/orders";

const DEFAULTS = { perPage: 50, sort: "-createdAt" } as const;

export function parseOrdersParams(
  raw: Record<string, string | undefined>,
): OrdersParams {
  return {
    page: raw.page ? Math.max(1, Number(raw.page)) : 1,
    perPage: raw.perPage ? Number(raw.perPage) : DEFAULTS.perPage,
    sort: raw.sort || DEFAULTS.sort,
    instrument: raw.instrument,
    side: raw.side,
    status: raw.status,
  };
}