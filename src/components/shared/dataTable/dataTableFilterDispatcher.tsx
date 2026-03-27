"use client";

import type { FilterType } from "@/lib/tableUtils";
import { DataTableCheckboxFilter } from "./dataTableCheckboxFilter";
import { DataTableTextFilter } from "./dataTableTextFilter";
import { DataTableNumericRangeFilter } from "./dataTableNumericRangeFilter";
import { DataTableDateRangeFilter } from "./dataTableDateRangeFilter";

interface DataTableFilterDispatcherProps {
  field: string;
  title: string;
  filterType: FilterType;
  fetchOptions?: (field: string, query?: string) => Promise<string[]>;
}

export function DataTableFilterDispatcher({ field, title, filterType, fetchOptions }: DataTableFilterDispatcherProps) {
  switch (filterType.type) {
    case "checkbox":
      return <DataTableCheckboxFilter field={field} title={title} searchable={filterType.searchable} fetchOptions={fetchOptions!} />;
    case "text":
      return <DataTableTextFilter field={field} title={title} />;
    case "numericRange":
      return <DataTableNumericRangeFilter field={field} title={title} />;
    case "dateRange":
      return <DataTableDateRangeFilter field={field} title={title} />;
  }
}
