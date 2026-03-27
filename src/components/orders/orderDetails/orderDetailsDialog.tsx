import type { Order } from "@/types/order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderInfo } from "./orderInfo";
import { OrderDetailsTabs } from "../orderDetailsTabs";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailsDialogProps) {
  if (!order) return null;

  const orderLabel = `${order.instrument} #${order.id.slice(0, 8)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{orderLabel}</DialogTitle>
        </DialogHeader>

        <OrderInfo order={order} />

        <OrderDetailsTabs
          orderId={order.id}
          orderLabel={orderLabel}
          defaultTab="history"
        />
      </DialogContent>
    </Dialog>
  );
}
