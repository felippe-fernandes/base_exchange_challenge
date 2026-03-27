"use client";

import { use } from "react";
import type { PaginatedOrders, OrdersParams } from "@/lib/api/orders";
import { DataTable } from "@/components/shared/dataTable/dataTable";
import { useOrdersTable } from "@/hooks/useOrdersTable";
import { useUserConfigHydrated } from "@/stores/userConfigStore";
import { DataTableSkeleton } from "@/components/shared/dataTable/dataTableSkeleton";
import { columns } from "./columns";

interface OrderTableProps {
  ordersPromise: Promise<PaginatedOrders>;
  params: OrdersParams;
}

export function OrderTable({ ordersPromise, params }: OrderTableProps) {
  const initialData = use(ordersPromise);
  const hydrated = useUserConfigHydrated();
  const { table, orders, hasNextPage, isLoadingMore, loadMore, totalItems } =
    useOrdersTable({ initialData, params, columns });

  if (!hydrated) return <DataTableSkeleton columns={columns.length} />;

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