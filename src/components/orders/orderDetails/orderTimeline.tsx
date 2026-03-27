import { Suspense } from "react";
import type { OrderStatus } from "@/types/order";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatDateTime } from "@/lib/formatters";
import { Timeline, type TimelineItem } from "@/components/shared/timeline";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrderDetails } from "@/hooks/useOrderDetails";

interface OrderTimelineProps {
  orderId: string;
}

const statusVariantMap: Record<OrderStatus, TimelineItem["variant"]> = {
  open: "default",
  partial: "warning",
  executed: "success",
  cancelled: "destructive",
};

function TimelineSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="size-2.5 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderTimelineContent({ orderId }: OrderTimelineProps) {
  const { history } = useOrderDetails(orderId);

  const items: TimelineItem[] = history.map((entry) => ({
    label: ORDER_STATUS_LABELS[entry.toStatus] ?? entry.toStatus,
    description: entry.reason,
    timestamp: formatDateTime(entry.timestamp),
    variant: statusVariantMap[entry.toStatus] ?? "default",
  }));

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground text-center text-sm">
        No history available.
      </p>
    );
  }

  return <Timeline items={items} />;
}

export function OrderTimeline({ orderId }: OrderTimelineProps) {
  return (
    <Suspense fallback={<TimelineSkeleton />}>
      <OrderTimelineContent orderId={orderId} />
    </Suspense>
  );
}
