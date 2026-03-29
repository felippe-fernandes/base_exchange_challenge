"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Order, Money } from "@/types/order";
import { buildColumns } from "@/lib/tableUtils";
import { StatusBadge } from "@/components/shared/statusBadge";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  ORDER_SIDE_COLORS,
  ORDER_SIDE_LABELS,
} from "@/lib/constants";
import { formatCurrency, formatNumber, formatDateTime } from "@/lib/formatters";
import { getFilterValues } from "@/lib/api/orders";
import { useUserConfigStore } from "@/stores/userConfigStore";
import { CancelOrdersButtonCell } from "./CancelOrderButtonCell";

function CreatedAtCell({ value }: { value: string }) {
  const dateFormat = useUserConfigStore((state) => state.dateFormat);
  const timeFormat = useUserConfigStore((state) => state.timeFormat);

  return formatDateTime(value, { dateFormat, timeFormat });
}

const dataColumns = buildColumns<Order>([
  { accessorKey: "id", title: "ID", sortable: false, filterable: { type: "text" } },
  { accessorKey: "instrument", title: "Instrument", filterable: { type: "checkbox", searchable: true } },
  {
    accessorKey: "side",
    title: "Side",
    filterable: { type: "checkbox", searchable: false },
    cell: ({ row }) => (
      <StatusBadge
        status={row.getValue("side")}
        colorMap={ORDER_SIDE_COLORS}
        labelMap={ORDER_SIDE_LABELS}
        variant="text"
      />
    ),
  },
  {
    accessorKey: "price",
    title: "Price",
    filterable: { type: "numericRange" },
    cell: ({ row }) => {
      const price = row.getValue<Money>("price");
      return formatCurrency(price.value, price.ccy);
    },
  },
  {
    accessorKey: "quantity",
    title: "Quantity",
    filterable: { type: "numericRange" },
    cell: ({ row }) => formatNumber(row.getValue("quantity")),
  },
  {
    accessorKey: "remainingQuantity",
    title: "Remaining",
    filterable: { type: "numericRange" },
    cell: ({ row }) => formatNumber(row.getValue("remainingQuantity")),
  },
  {
    accessorKey: "status",
    title: "Status",
    filterable: { type: "checkbox" },
    cell: ({ row }) => (
      <StatusBadge
        status={row.getValue("status")}
        colorMap={ORDER_STATUS_COLORS}
        labelMap={ORDER_STATUS_LABELS}
      />
    ),
  },
  {
    accessorKey: "createdAt",
    title: "Date/Time",
    filterable: { type: "dateRange" },
    cell: ({ row }) => <CreatedAtCell value={row.getValue("createdAt")} />,
  },
], { fetchOptions: getFilterValues });

const actionsColumn: ColumnDef<Order> = {
  id: "actions",
  header: "",
  size: 40,
  enableSorting: false,
  enableColumnFilter: false,
  enableResizing: false,
  enableMultiSort: false,
  cell: ({ row }) => <CancelOrdersButtonCell row={row} />,
};

export const columns = [actionsColumn, ...dataColumns];
