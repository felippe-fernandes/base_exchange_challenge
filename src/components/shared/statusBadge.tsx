import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  colorMap: Record<string, string>;
  labelMap: Record<string, string>;
}

export function StatusBadge({ status, colorMap, labelMap }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorMap[status],
      )}
    >
      {labelMap[status] ?? status}
    </span>
  );
}