"use client";

import { useState, Suspense, useMemo } from "react";
import { Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useColumnFilter } from "@/hooks/useColumnFilter";
import { use } from "react";
import { ErrorBoundary } from "@/components/shared/errorBoundary";
import { FilterTrigger, ClearFilterButton } from "./dataTableFilterParts";

interface DataTableCheckboxFilterProps {
  field: string;
  title: string;
  searchable?: boolean;
  fetchOptions: (field: string, query?: string) => Promise<string[]>;
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

export function DataTableCheckboxFilter({ field, title, searchable = true, fetchOptions }: DataTableCheckboxFilterProps) {
  const { selectedValues, toggleValue, clearFilter } = useColumnFilter(field);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const optionsPromise = useMemo(
    () => (open ? fetchOptions(field, searchable && search ? search : undefined) : null),
    [open, field, search, searchable, retryCount],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <FilterTrigger icon={Filter} isActive={selectedValues.length > 0}>
        {selectedValues.length > 0 && (
          <Badge variant="secondary" className="absolute -right-1 -top-1 h-4 min-w-4 px-0.5 text-[10px]">
            {selectedValues.length}
          </Badge>
        )}
      </FilterTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-2">
          {searchable && (
            <Input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
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
            <ClearFilterButton onClick={clearFilter} />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
