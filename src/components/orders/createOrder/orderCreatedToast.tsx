import { toast } from "sonner";
import Link from "next/link";
import { CopyButton } from "@/components/shared/copyButton";
import type { Order } from "@/types/order";

function getToastTitle(order: Order): string {
  if (order.status === "executed") return "Order executed";
  if (order.status === "partial") return "Order partially filled";
  return "Order created";
}

function getFilledText(order: Order): string | null {
  const filled = order.quantity - order.remainingQuantity;
  if (filled === 0) return null;
  if (order.status === "executed") return `Filled ${filled} units`;
  return `Filled ${filled} of ${order.quantity} units`;
}

export function orderCreatedToast(order: Order) {
  const filledText = getFilledText(order);

  toast.success(getToastTitle(order), {
    description: () => (
      <div className="space-y-1">
        {filledText && <p className="text-xs">{filledText}</p>}
        <div className="flex items-center gap-1">
          <Link
            href={`/orders?id_like=${order.id}`}
            className="truncate font-mono text-xs underline underline-offset-2"
          >
            {order.id}
          </Link>
          <CopyButton text={order.id} className="size-6 shrink-0" />
        </div>
      </div>
    ),
    duration: 8000,
  });
}