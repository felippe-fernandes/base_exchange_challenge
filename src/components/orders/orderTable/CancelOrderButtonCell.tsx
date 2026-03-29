import { CancelOrderButton } from "@/components/shared/cancelOrderButton";
import { Order } from "@/types/order";
import { Row } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

interface CancelOrdersButtonCellProps {
  row: Row<Order>;
}


export function CancelOrdersButtonCell({ row }: CancelOrdersButtonCellProps) {

  const canCancel = row.original.status === "open"
    || row.original.status === "partial";

  if (!canCancel) return null;

  return (
    <CancelOrderButton
      order={row.original}
      variant="icon"
      icon={<Trash2 className="size-3.5" />} />
  )
}
