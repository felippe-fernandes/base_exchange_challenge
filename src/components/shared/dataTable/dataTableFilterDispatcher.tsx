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
}

export function DataTableFilterDispatcher({ field, title, filterType }: DataTableFilterDispatcherProps) {
  switch (filterType.type) {
    case "checkbox":
      return <DataTableCheckboxFilter field={field} title={title} searchable={filterType.searchable} />;
    case "text":
      return <DataTableTextFilter field={field} title={title} />;
    case "numericRange":
      return <DataTableNumericRangeFilter field={field} title={title} />;
    case "dateRange":
      return <DataTableDateRangeFilter field={field} title={title} />;
  }
}
