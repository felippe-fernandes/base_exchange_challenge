import { cn } from "@/lib/utils";
import { ORDER_SIDE_LABELS, ORDER_SIDE_COLORS } from "@/lib/constants";
import type { OrderSide } from "@/types/order";

interface SideBadgeProps {
  side: OrderSide;
}

export function SideBadge({ side }: SideBadgeProps) {
  return (
    <span className={cn("text-sm font-semibold", ORDER_SIDE_COLORS[side])}>
      {ORDER_SIDE_LABELS[side]}
    </span>
  );
}