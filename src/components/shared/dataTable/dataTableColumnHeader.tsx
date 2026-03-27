"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { type Column } from "@tanstack/react-table";
import { useMultiSort } from "@/hooks/useMultiSort";

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { getSortState, toggleSort, sortEntries } = useMultiSort();
  const sortState = getSortState(column.id);
  const isMultiSort = sortEntries.length > 1;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-8", className)}
              onClick={(e) => toggleSort(column.id, e.shiftKey)}
            />
          }
        >
          {title}
          {sortState?.direction === "desc" ? (
            <ArrowDown className="ml-1 size-4" />
          ) : sortState?.direction === "asc" ? (
            <ArrowUp className="ml-1 size-4" />
          ) : (
            <ArrowUpDown className="ml-1 size-4 text-muted-foreground" />
          )}
          {sortState && isMultiSort && (
            <Badge variant="secondary" className="ml-0.5 h-4 min-w-4 px-1 text-[10px]">
              {sortState.priority}
            </Badge>
          )}
        </TooltipTrigger>
        <TooltipContent>
          Click to sort · Shift+Click to multi-sort
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}