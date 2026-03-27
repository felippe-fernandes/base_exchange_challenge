"use client";

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

export const columns = buildColumns<Order>([
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
    cell: ({ row }) => formatDateTime(row.getValue("createdAt")),
  },
]);
