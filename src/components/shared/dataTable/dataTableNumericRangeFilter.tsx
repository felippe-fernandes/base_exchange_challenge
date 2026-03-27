"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useNumericRangeFilter } from "@/hooks/useNumericRangeFilter";
import { FilterTrigger, ApplyFilterButton, ClearFilterButton } from "./dataTableFilterParts";

interface DataTableNumericRangeFilterProps {
  field: string;
  title: string;
}

export function DataTableNumericRangeFilter({ field, title }: DataTableNumericRangeFilterProps) {
  const { min, max, setRange, clearFilter, hasFilter } = useNumericRangeFilter(field);
  const [open, setOpen] = useState(false);
  const [localMin, setLocalMin] = useState(min?.toString() ?? "");
  const [localMax, setLocalMax] = useState(max?.toString() ?? "");

  const handleApply = () => {
    setRange(
      localMin ? Number(localMin) : undefined,
      localMax ? Number(localMax) : undefined,
    );
  };

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) {
        setLocalMin(min?.toString() ?? "");
        setLocalMax(max?.toString() ?? "");
      }
    }}>
      <FilterTrigger icon={SlidersHorizontal} isActive={hasFilter} />
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">{title} range</p>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
            />
            <span className="text-muted-foreground text-xs">–</span>
            <Input
              type="number"
              placeholder="Max"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
            />
          </div>
          <ApplyFilterButton onClick={handleApply} />
          {hasFilter && (
            <ClearFilterButton onClick={() => {
              clearFilter();
              setLocalMin("");
              setLocalMax("");
            }} />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
