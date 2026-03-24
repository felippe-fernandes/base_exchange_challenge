"use client";

import { use } from "react";
import type { Order } from "@/types/order";
import { DataTable } from "@/components/shared/dataTable/dataTable";
import { columns } from "./columns";

interface OrderTableProps {
  ordersPromise: Promise<Order[]>;
}

export function OrderTable({ ordersPromise }: OrderTableProps) {
  const orders = use(ordersPromise);

  return <DataTable columns={columns} data={orders} />;
}