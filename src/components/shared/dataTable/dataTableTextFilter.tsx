"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useTextFilter } from "@/hooks/useTextFilter";
import { FilterTrigger, ClearFilterButton } from "./dataTableFilterParts";

interface DataTableTextFilterProps {
  field: string;
  title: string;
}

export function DataTableTextFilter({ field, title }: DataTableTextFilterProps) {
  const { value, setValue, clearFilter } = useTextFilter(field);
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    setValue(newValue);
  };

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) setLocalValue(value);
    }}>
      <FilterTrigger icon={Search} isActive={!!value} />
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            autoFocus
          />
          {value && (
            <ClearFilterButton onClick={() => {
              clearFilter();
              setLocalValue("");
            }} />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
