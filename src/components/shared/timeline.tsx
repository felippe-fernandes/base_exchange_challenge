import { cn } from "@/lib/utils";

type TimelineVariant = "default" | "success" | "warning" | "destructive";

export interface TimelineItem {
  label: string;
  description?: string;
  timestamp: string;
  variant?: TimelineVariant;
}

interface TimelineProps {
  items: TimelineItem[];
}

const variantStyles: Record<TimelineVariant, string> = {
  default: "bg-muted-foreground",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  destructive: "bg-destructive",
};

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative space-y-0">
      {items.map((item, i) => {
        const variant = item.variant ?? "default";
        const isLast = i === items.length - 1;

        return (
          <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "mt-1 size-2.5 shrink-0 rounded-full",
                  variantStyles[variant],
                )}
              />
              {!isLast && (
                <div className="w-px flex-1 bg-border" />
              )}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-muted-foreground text-xs">
                  {item.timestamp}
                </span>
              </div>
              {item.description && (
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
