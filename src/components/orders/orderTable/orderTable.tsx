"use client";

import { DataTable } from "@/components/shared/dataTable/dataTable";
import { DataTableActiveFilters } from "@/components/shared/dataTable/dataTableActiveFilters";
import { DataTableSkeleton } from "@/components/shared/dataTable/dataTableSkeleton";
import { useOrdersTable } from "@/hooks/useOrdersTable";
import type { OrdersParams } from "@/lib/api/orders";
import { ORDER_FILTER_LABELS, ORDER_TABLE_DEFAULTS } from "@/lib/constants";
import { formatOrderLabel } from "@/lib/formatters";
import { useUserConfigHydrated, useUserConfigStore } from "@/stores/userConfigStore";
import type { Order } from "@/types/order";
import { useState } from "react";
import { CreateOrderDialog } from "../createOrder/createOrderDialog";
import { OrderDetailsDialog } from "../orderDetails/orderDetailsDialog";
import { columns } from "./columns";
import { OrderExpandedRow } from "./orderExpandedRow";
import { useOrderRowContextMenu } from "./orderRowContextMenu";

useUserConfigStore.getState().initDefaults(ORDER_TABLE_DEFAULTS);

interface OrderTableProps {
  params: OrdersParams;
}

export function OrderTable({ params }: OrderTableProps) {
  const hydrated = useUserConfigHydrated();
  useUserConfigStore((state) => state.dateFormat);
  useUserConfigStore((state) => state.timeFormat);
  const { table, orders, hasNextPage, isLoadingMore, isLoading, loadMore, totalItems } =
    useOrdersTable({ params, columns });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { onContextMenu, contextMenu } = useOrderRowContextMenu({
    onViewDetails: setSelectedOrder,
  });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <CreateOrderDialog />
      </div>
      {hydrated && (
        <DataTableActiveFilters filterLabels={ORDER_FILTER_LABELS} tableDefaults={ORDER_TABLE_DEFAULTS} />
      )}
      {!hydrated || isLoading ? (
        <DataTableSkeleton columns={columns.length} />
      ) : (
        <DataTable
          table={table}
          onLoadMore={loadMore}
          hasNextPage={hasNextPage}
          isLoadingMore={isLoadingMore}
          onRowClick={(row) => setSelectedOrder(row.original)}
          onRowContextMenu={(e, row) => onContextMenu(e, row.original)}
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
      )}
      <OrderDetailsDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      />
      {contextMenu}
    </>
  );
}
