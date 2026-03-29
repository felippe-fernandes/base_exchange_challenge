"use client";

import { X, ArrowUp, ArrowDown, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSearchParamsNavigation } from "@/hooks/useSearchParamsNavigation";
import { parseSortParam } from "@/hooks/useMultiSort";
import { useUserConfigStore } from "@/stores/userConfigStore";
import { formatFilterValue } from "@/lib/formatters";
import type { TableDefaults } from "@/lib/schemas/userConfig.schema";

interface DataTableActiveFiltersProps {
  filterLabels: Record<string, string>;
  tableDefaults: TableDefaults;
}

const IGNORED_PARAMS = new Set(["page", "perPage", "sort"]);

function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

export function DataTableActiveFilters({ filterLabels, tableDefaults }: DataTableActiveFiltersProps) {
  const { searchParams, navigate } = useSearchParamsNavigation();
  const { getTableConfig, resetColumnOrder, resetColumnSizing } = useUserConfigStore();
  const tableConfig = getTableConfig();
  const isColumnOrderChanged = !arraysEqual(tableConfig.columnOrder, tableDefaults.columnOrder);
  const isColumnSizingChanged = Object.keys(tableConfig.columnSizing).length > 0;
  const isTableCustomized = isColumnOrderChanged || isColumnSizingChanged;

  const filterEntries: { key: string; value: string; label: string }[] = [];
  searchParams.forEach((value, key) => {
    if (IGNORED_PARAMS.has(key)) return;
    const label = filterLabels[key] || key;
    filterEntries.push({ key, value, label });
  });

  const sortParam = searchParams.get("sort") || tableDefaults.defaultSort;
  const sortEntries = parseSortParam(sortParam);
  const isDefaultSort = sortParam === tableDefaults.defaultSort;
  const sortBadges = isDefaultSort ? [] : sortEntries;

  if (filterEntries.length === 0 && sortBadges.length === 0 && !isTableCustomized) return null;

  const removeFilter = (key: string) => {
    navigate((params) => {
      params.delete(key);
    });
  };

  const removeSort = (field: string) => {
    navigate((params) => {
      const current = parseSortParam(params.get("sort") || "");
      const filtered = current.filter((e) => e.field !== field);
      const serialized = filtered
        .map((e) => (e.direction === "desc" ? `-${e.field}` : e.field))
        .join(",");
      if (serialized) {
        params.set("sort", serialized);
      } else {
        params.delete("sort");
      }
    });
  };

  const clearAll = () => {
    navigate((params) => {
      filterEntries.forEach(({ key }) => params.delete(key));
      params.delete("sort");
    });
    if (isColumnOrderChanged) resetColumnOrder();
    if (isColumnSizingChanged) resetColumnSizing();
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {filterEntries.map(({ key, value, label }) => (
        <Badge
          key={key}
          variant="secondary"
          className="gap-1 pl-2 pr-1 text-xs font-normal"
        >
          {label}: {formatFilterValue(value)}
          <button
            type="button"
            className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
            onClick={() => removeFilter(key)}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      {sortBadges.map((entry) => (
        <Badge
          key={entry.field}
          variant="outline"
          className="gap-1 pl-2 pr-1 text-xs font-normal"
        >
          {entry.direction === "desc" ? <ArrowDown className="size-3" /> : <ArrowUp className="size-3" />}
          {entry.field}
          <button
            type="button"
            className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
            onClick={() => removeSort(entry.field)}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      {isTableCustomized && (
        <Badge
          variant="outline"
          className="gap-1 pl-2 pr-1 text-xs font-normal"
        >
          <RotateCcw className="size-3" />
          Table customized
          <button
            type="button"
            className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
            onClick={() => {
              if (isColumnOrderChanged) resetColumnOrder();
              if (isColumnSizingChanged) resetColumnSizing();
            }}
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs text-muted-foreground"
        onClick={clearAll}
      >
        Clear all
      </Button>
    </div>
  );
}
