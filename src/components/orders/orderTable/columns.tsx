"use client";

import type { Order } from "@/types/order";
import { buildColumns } from "@/lib/tableUtils";
import { StatusBadge } from "@/components/shared/statusBadge";
import { SideBadge } from "@/components/shared/sideBadge";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatCurrency, formatNumber, formatDateTime } from "@/lib/formatters";

export const columns = buildColumns<Order>([
  { accessorKey: "id", title: "ID", filterable: true },
  { accessorKey: "instrument", title: "Instrument", filterable: true },
  {
    accessorKey: "side",
    title: "Side",
    filterable: true,
    cell: ({ row }) => <SideBadge side={row.getValue("side")} />,
  },
  {
    accessorKey: "price",
    title: "Price",
    cell: ({ row }) => formatCurrency(row.getValue("price")),
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