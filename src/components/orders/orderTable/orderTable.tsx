"use client";

import { use, useState } from "react";
import type { Order } from "@/types/order";
import type { PaginatedOrders, OrdersParams } from "@/lib/api/orders";
import { DataTable } from "@/components/shared/dataTable/dataTable";
import { DataTableActiveFilters } from "@/components/shared/dataTable/dataTableActiveFilters";
import { useOrdersTable } from "@/hooks/useOrdersTable";
import { useUserConfigHydrated, useUserConfigStore } from "@/stores/userConfigStore";
import { DataTableSkeleton } from "@/components/shared/dataTable/dataTableSkeleton";
import { ORDER_TABLE_DEFAULTS } from "@/lib/constants";
import { OrderDetailsDialog } from "../orderDetails/orderDetailsDialog";
import { columns } from "./columns";
import { ExecutionDetails } from "./executionDetails";

useUserConfigStore.getState().initDefaults(ORDER_TABLE_DEFAULTS);

const ORDER_FILTER_LABELS: Record<string, string> = {
  id_like: "ID",
  instrument: "Instrument",
  side: "Side",
  status: "Status",
  price_gte: "Price min",
  price_lte: "Price max",
  quantity_gte: "Qty min",
  quantity_lte: "Qty max",
  remainingQuantity_gte: "Remaining min",
  remainingQuantity_lte: "Remaining max",
  createdAt_gte: "Date from",
  createdAt_lte: "Date to",
};

interface OrderTableProps {
  ordersPromise: Promise<PaginatedOrders>;
  params: OrdersParams;
}

export function OrderTable({ ordersPromise, params }: OrderTableProps) {
  const initialData = use(ordersPromise);
  const hydrated = useUserConfigHydrated();
  const { table, orders, hasNextPage, isLoadingMore, loadMore, totalItems } =
    useOrdersTable({ initialData, params, columns });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!hydrated) return <DataTableSkeleton columns={columns.length} />;

  return (
    <>
      <DataTableActiveFilters filterLabels={ORDER_FILTER_LABELS} tableDefaults={ORDER_TABLE_DEFAULTS} />
      <DataTable
        table={table}
        onLoadMore={loadMore}
        hasNextPage={hasNextPage}
        isLoadingMore={isLoadingMore}
        onRowClick={(row) => setSelectedOrder(row.original)}
        renderSubComponent={(row) => (
          <ExecutionDetails
            orderId={row.original.id}
            orderLabel={`${row.original.instrument} #${row.original.id.slice(0, 8)}`}
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