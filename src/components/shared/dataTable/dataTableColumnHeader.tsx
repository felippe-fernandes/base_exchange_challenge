"use client";

import { type Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const handleSort = () => {
    if (column.getIsSorted() === "desc") {
      column.clearSorting();
    } else {
      column.toggleSorting(column.getIsSorted() === "asc");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("-ml-3 h-8", className)}
      onClick={handleSort}
    >
      {title}
      {column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 size-4" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 size-4" />
      ) : (
        <ArrowUpDown className="ml-2 size-4" />
      )}
    </Button>
  );
}