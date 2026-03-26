"use client";

import { useState, Suspense, useMemo } from "react";
import { Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useColumnFilter } from "@/hooks/useColumnFilter";
import { getFilterValues } from "@/lib/api/orders";
import { cn } from "@/lib/utils";
import { use } from "react";
import { ErrorBoundary } from "@/components/shared/errorBoundary";

interface DataTableColumnFilterProps {
  field: string;
  title: string;
}

function FilterOptions({
  optionsPromise,
  selectedValues,
  onToggle,
}: {
  optionsPromise: Promise<string[]>;
  selectedValues: string[];
  onToggle: (value: string) => void;
}) {
  const options = use(optionsPromise);

  if (options.length === 0) {
    return (
      <p className="text-muted-foreground py-2 text-center text-xs">
        No options.
      </p>
    );
  }

  return (
    <>
      {options.map((value) => (
        <label
          key={value}
          className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
        >
          <Checkbox
            checked={selectedValues.includes(value)}
            onCheckedChange={() => onToggle(value)}
          />
          {value}
        </label>
      ))}
    </>
  );
}

function FilterError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="py-2 text-center">
      <p className="text-muted-foreground text-xs">Failed to load options.</p>
      <button
        type="button"
        className="mt-1 text-xs text-primary hover:underline"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}

export function DataTableColumnFilter({ field, title }: DataTableColumnFilterProps) {
  const { selectedValues, toggleValue, clearFilter } = useColumnFilter(field);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const optionsPromise = useMemo(
    () => (open ? getFilterValues(field, search || undefined) : null),
    [open, field, search, retryCount],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "relative inline-flex h-6 w-6 items-center justify-center rounded-sm hover:bg-accent",
          selectedValues.length > 0 && "text-primary",
        )}
      >
        <Filter className="size-3.5" />
        {selectedValues.length > 0 && (
          <Badge variant="secondary" className="absolute -right-1 -top-1 h-4 min-w-4 px-0.5 text-[10px]">
            {selectedValues.length}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-2">
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
          <div className="max-h-48 overflow-auto">
            {optionsPromise && (
              <ErrorBoundary
                key={`${search}-${retryCount}`}
                fallback={<FilterError onRetry={() => setRetryCount((c) => c + 1)} />}
              >
                <Suspense
                  fallback={
                    <p className="text-muted-foreground py-2 text-center text-xs">
                      Loading...
                    </p>
                  }
                >
                  <FilterOptions
                    optionsPromise={optionsPromise}
                    selectedValues={selectedValues}
                    onToggle={toggleValue}
                  />
                </Suspense>
              </ErrorBoundary>
            )}
          </div>
          {selectedValues.length > 0 && (
            <button
              type="button"
              className="h-7 w-full rounded-sm text-xs text-muted-foreground hover:bg-accent"
              onClick={clearFilter}
            >
              Clear filter
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
