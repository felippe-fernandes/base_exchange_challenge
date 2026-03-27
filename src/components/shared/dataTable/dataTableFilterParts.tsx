"use client";

import type { LucideIcon } from "lucide-react";
import { PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FilterTriggerProps {
  icon: LucideIcon;
  isActive: boolean;
  children?: React.ReactNode;
}

export function FilterTrigger({ icon: Icon, isActive, children }: FilterTriggerProps) {
  return (
    <PopoverTrigger
      className={cn(
        "relative inline-flex h-6 w-6 items-center justify-center rounded-sm hover:bg-accent",
        isActive && "text-primary",
      )}
    >
      <Icon className="size-3.5" />
      {children}
    </PopoverTrigger>
  );
}

export function ApplyFilterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="h-7 w-full rounded-sm bg-primary text-xs text-primary-foreground hover:bg-primary/90"
      onClick={onClick}
    >
      Apply
    </button>
  );
}

export function ClearFilterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="h-7 w-full rounded-sm text-xs text-muted-foreground hover:bg-accent"
      onClick={onClick}
    >
      Clear filter
    </button>
  );
}
