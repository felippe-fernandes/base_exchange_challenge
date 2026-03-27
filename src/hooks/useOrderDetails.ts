"use client";

import { use, useState } from "react";
import type { StatusHistoryEntry } from "@/types/order";
import { getOrderHistory } from "@/lib/api/orders";

export function useOrderDetails(orderId: string) {
  const [promise] = useState(() => getOrderHistory(orderId));
  const history = use(promise);

  return { history };
}
