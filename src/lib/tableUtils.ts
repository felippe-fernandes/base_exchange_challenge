import { type ColumnDef, type Column } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable/dataTableColumnHeader";
import { DataTableColumnFilter } from "@/components/shared/dataTable/dataTableColumnFilter";
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
    header: ({ column }: { column: Column<TData> }) =>
      createElement("div", { className: "flex items-center gap-1" },
        sortable
          ? createElement(DataTableColumnHeader, {
              column: column as Column<unknown>,
              title,
            })
          : title,
        filterable
          ? createElement(DataTableColumnFilter, {
              field: accessorKey as string,
              title,
            })
          : null,
      ),
    enableSorting: sortable,
    enableColumnFilter: filterable,
    ...(cell ? { cell } : {}),
  }));
}