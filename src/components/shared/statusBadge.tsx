import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva("inline-flex items-center font-medium", {
  variants: {
    variant: {
      pill: "rounded-full px-2.5 py-0.5 text-xs",
      text: "text-sm font-semibold",
    },
  },
  defaultVariants: {
    variant: "pill",
  },
});

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  status: string;
  colorMap: Record<string, string>;
  labelMap: Record<string, string>;
  className?: string;
}

export function StatusBadge({
  status,
  colorMap,
  labelMap,
  variant,
  className,
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant }), colorMap[status], className)}>
      {labelMap[status] ?? status}
    </span>
  );
}

export { statusBadgeVariants };