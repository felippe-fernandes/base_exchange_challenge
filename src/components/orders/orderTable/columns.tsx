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
  { accessorKey: "id", title: "ID", sortable: false },
  { accessorKey: "instrument", title: "Instrument", filterable: true },
  {
    accessorKey: "side",
    title: "Side",
    filterable: true,
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
    cell: ({ row }) => {
      const price = row.getValue<Money>("price");
      return formatCurrency(price.value, price.ccy);
    },
  },
  {
    accessorKey: "quantity",
    title: "Quantity",
    cell: ({ row }) => formatNumber(row.getValue("quantity")),
  },
  {
    accessorKey: "remainingQuantity",
    title: "Remaining",
    cell: ({ row }) => formatNumber(row.getValue("remainingQuantity")),
  },
  {
    accessorKey: "status",
    title: "Status",
    filterable: true,
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
    cell: ({ row }) => formatDateTime(row.getValue("createdAt")),
  },
]);