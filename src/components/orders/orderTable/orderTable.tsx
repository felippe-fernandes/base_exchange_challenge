"use client";

import { useState } from "react";
import type { Order } from "@/types/order";
import type { OrdersParams } from "@/lib/api/orders";
import { DataTable } from "@/components/shared/dataTable/dataTable";
import { DataTableActiveFilters } from "@/components/shared/dataTable/dataTableActiveFilters";
import { useOrdersTable } from "@/hooks/useOrdersTable";
import { useUserConfigHydrated, useUserConfigStore } from "@/stores/userConfigStore";
import { DataTableSkeleton } from "@/components/shared/dataTable/dataTableSkeleton";
import { ORDER_TABLE_DEFAULTS, ORDER_FILTER_LABELS } from "@/lib/constants";
import { formatOrderLabel } from "@/lib/formatters";
import { OrderDetailsDialog } from "../orderDetails/orderDetailsDialog";
import { CreateOrderDialog } from "../createOrder/createOrderDialog";
import { columns } from "./columns";
import { OrderExpandedRow } from "./orderExpandedRow";

useUserConfigStore.getState().initDefaults(ORDER_TABLE_DEFAULTS);

interface OrderTableProps {
  params: OrdersParams;
}

export function OrderTable({ params }: OrderTableProps) {
  const hydrated = useUserConfigHydrated();
  const { table, orders, hasNextPage, isLoadingMore, isLoading, loadMore, totalItems } =
    useOrdersTable({ params, columns });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!hydrated || isLoading) return <DataTableSkeleton columns={columns.length} />;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <CreateOrderDialog />
      </div>
      <DataTableActiveFilters filterLabels={ORDER_FILTER_LABELS} tableDefaults={ORDER_TABLE_DEFAULTS} />
      <DataTable
        table={table}
        onLoadMore={loadMore}
        hasNextPage={hasNextPage}
        isLoadingMore={isLoadingMore}
        onRowClick={(row) => setSelectedOrder(row.original)}
        renderSubComponent={(row) => (
          <OrderExpandedRow
            orderId={row.original.id}
            orderLabel={formatOrderLabel(row.original)}
          />
        )}
        footer={
          <div className="text-muted-foreground px-2 text-sm">
            {orders.length} of {totalItems} orders loaded
          </div>
        }
      />
      <OrderDetailsDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      />
    </>
  );
}
