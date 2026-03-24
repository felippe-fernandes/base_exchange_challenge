import { type ColumnDef, type Column } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable/dataTableColumnHeader";
import { createElement } from "react";

interface ColumnConfig<TData> {
  accessorKey: string & keyof TData;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  cell?: ColumnDef<TData>["cell"];
}

export function buildColumns<TData>(
  configs: ColumnConfig<TData>[],
): ColumnDef<TData>[] {
  return configs.map(({ accessorKey, title, sortable = true, filterable = false, cell }) => ({
    accessorKey,
    header: sortable
      ? ({ column }: { column: Column<TData> }) =>
          createElement(DataTableColumnHeader, {
            column: column as Column<unknown>,
            title,
          })
      : () => title,
    enableSorting: sortable,
    enableColumnFilter: filterable,
    ...(cell ? { cell } : {}),
  }));
}