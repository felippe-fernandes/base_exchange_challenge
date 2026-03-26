"use client";

import { use } from "react";
import type { PaginatedOrders, OrdersParams } from "@/lib/api/orders";
import { DataTable } from "@/components/shared/dataTable/dataTable";
import { useOrdersTable } from "@/hooks/useOrdersTable";
import { columns } from "./columns";

interface OrderTableProps {
  ordersPromise: Promise<PaginatedOrders>;
  params: OrdersParams;
}

export function OrderTable({ ordersPromise, params }: OrderTableProps) {
  const initialData = use(ordersPromise);
  const { table, orders, hasNextPage, isLoadingMore, loadMore, totalItems } =
    useOrdersTable({ initialData, params, columns });

  return (
    <DataTable
      table={table}
      onLoadMore={loadMore}
      hasNextPage={hasNextPage}
      isLoadingMore={isLoadingMore}
      footer={
        <div className="text-muted-foreground px-2 text-sm">
          {orders.length} of {totalItems} orders loaded
        </div>
      }
    />
  );
}