"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { toLocalDatetime, toCompactIso } from "@/lib/formatters";
import { FilterTrigger, ApplyFilterButton, ClearFilterButton } from "./dataTableFilterParts";

interface DataTableDateRangeFilterProps {
  field: string;
  title: string;
}

export function DataTableDateRangeFilter({ field, title }: DataTableDateRangeFilterProps) {
  const { from, to, setRange, clearFilter, hasFilter } = useDateRangeFilter(field);
  const [open, setOpen] = useState(false);
  const [localFrom, setLocalFrom] = useState(toLocalDatetime(from));
  const [localTo, setLocalTo] = useState(toLocalDatetime(to));

  const handleApply = () => {
    setRange(
      localFrom ? toCompactIso(localFrom) : undefined,
      localTo ? toCompactIso(localTo) : undefined,
    );
  };

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) {
        setLocalFrom(toLocalDatetime(from));
        setLocalTo(toLocalDatetime(to));
      }
    }}>
      <FilterTrigger icon={CalendarDays} isActive={hasFilter} />
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">{title} range</p>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">From</label>
            <Input
              type="datetime-local"
              value={localFrom}
              onChange={(e) => setLocalFrom(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">To</label>
            <Input
              type="datetime-local"
              value={localTo}
              onChange={(e) => setLocalTo(e.target.value)}
            />
          </div>
          <ApplyFilterButton onClick={handleApply} />
          {hasFilter && (
            <ClearFilterButton onClick={() => {
              clearFilter();
              setLocalFrom("");
              setLocalTo("");
            }} />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
