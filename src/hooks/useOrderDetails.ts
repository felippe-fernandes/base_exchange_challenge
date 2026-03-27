"use client";

import { use, useState } from "react";
import type { StatusHistoryEntry } from "@/types/order";
import { getOrderHistory } from "@/lib/api/orders";

const promiseCache = new Map<string, Promise<StatusHistoryEntry[]>>();

function getCachedHistory(orderId: string) {
  if (!promiseCache.has(orderId)) {
    promiseCache.set(orderId, getOrderHistory(orderId));
  }
  return promiseCache.get(orderId)!;
}

export function useOrderDetails(orderId: string) {
  const [promise] = useState(() => getCachedHistory(orderId));
  const history = use(promise);

  return { history };
}