import type { Order } from "@/types/order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderInfo } from "./orderInfo";
import { OrderTimeline } from "./orderTimeline";
import { ExecutionDetails } from "../orderTable/executionDetails";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {order.instrument} #{order.id.slice(0, 8)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <section>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Order Info
            </h3>
            <OrderInfo order={order} />
          </section>

          <section>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Executions
            </h3>
            <ExecutionDetails
              orderId={order.id}
              orderLabel={`${order.instrument} #${order.id.slice(0, 8)}`}
            />
          </section>

          <section>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Status History
            </h3>
            <OrderTimeline orderId={order.id} />
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
