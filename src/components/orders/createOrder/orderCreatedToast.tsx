import { toast } from "sonner";
import Link from "next/link";
import { CopyButton } from "@/components/shared/copyButton";

export function orderCreatedToast(orderId: string) {
  toast.success("Order created", {
    description: () => (
      <div className="flex items-center gap-1">
        <Link
          href={`/orders?id_like=${orderId}`}
          className="truncate font-mono text-xs underline underline-offset-2"
        >
          {orderId}
        </Link>
        <CopyButton text={orderId} className="size-6 shrink-0" />
      </div>
    ),
    duration: 8000,
  });
}