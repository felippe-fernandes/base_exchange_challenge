"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { type Column } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { useSearchParamsNavigation } from "@/hooks/useSearchParamsNavigation";

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
  const { searchParams, navigate } = useSearchParamsNavigation();

  const accessorKey = column.id;
  const currentSort = searchParams.get("sort") || "-createdAt";

  const sortState = useMemo(() => {
    if (currentSort === accessorKey) return "asc" as const;
    if (currentSort === `-${accessorKey}`) return "desc" as const;
    return null;
  }, [currentSort, accessorKey]);

  const handleSort = useCallback(() => {
    navigate((params) => {
      if (sortState === null) {
        params.set("sort", accessorKey);
      } else if (sortState === "asc") {
        params.set("sort", `-${accessorKey}`);
      } else {
        params.delete("sort");
      }
    });
  }, [sortState, accessorKey, navigate]);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("-ml-3 h-8", className)}
      onClick={handleSort}
    >
      {title}
      {sortState === "desc" ? (
        <ArrowDown className="ml-2 size-4" />
      ) : sortState === "asc" ? (
        <ArrowUp className="ml-2 size-4" />
      ) : (
        <ArrowUpDown className="ml-2 size-4" />
      )}
    </Button>
  );
}