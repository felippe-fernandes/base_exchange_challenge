import { type ColumnDef, type Column } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/dataTable/dataTableColumnHeader";
import { DataTableFilterDispatcher } from "@/components/shared/dataTable/dataTableFilterDispatcher";
import { createElement } from "react";

export type FilterType =
  | { type: "checkbox"; searchable?: boolean }
  | { type: "text" }
  | { type: "numericRange" }
  | { type: "dateRange" };

interface ColumnConfig<TData> {
  accessorKey: string & keyof TData;
  title: string;
  sortable?: boolean;
  filterable?: FilterType | boolean;
  cell?: ColumnDef<TData>["cell"];
}

function resolveFilterType(filterable: FilterType | boolean | undefined): FilterType | null {
  if (!filterable) return null;
  if (filterable === true) return { type: "checkbox", searchable: true };
  return filterable;
}

export function buildColumns<TData>(
  configs: ColumnConfig<TData>[],
): ColumnDef<TData>[] {
  return configs.map(({ accessorKey, title, sortable = true, filterable, cell }) => {
    const filterConfig = resolveFilterType(filterable);

    return {
      accessorKey,
      header: ({ column }: { column: Column<TData> }) =>
        createElement("div", { className: "flex items-center gap-1" },
          sortable
            ? createElement(DataTableColumnHeader, {
                column: column as Column<unknown>,
                title,
              })
            : title,
          filterConfig
            ? createElement(DataTableFilterDispatcher, {
                field: accessorKey as string,
                title,
                filterType: filterConfig,
              })
            : null,
        ),
      enableSorting: sortable,
      enableColumnFilter: !!filterConfig,
      ...(cell ? { cell } : {}),
    };
  });
}
