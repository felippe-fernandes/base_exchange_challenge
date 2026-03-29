import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { buildColumns } from "./tableUtils";

vi.mock("@/components/shared/dataTable/dataTableColumnHeader", () => ({
  DataTableColumnHeader: ({ title }: { title: string }) => <span>{title}</span>,
}));

vi.mock("@/components/shared/dataTable/dataTableFilterDispatcher", () => ({
  DataTableFilterDispatcher: ({ field }: { field: string }) => <span>filter:{field}</span>,
}));

describe("buildColumns", () => {
  it("builds sortable and filterable columns", () => {
    const columns = buildColumns<{ id: string; name: string }>([
      { accessorKey: "id", title: "ID", sortable: false },
      { accessorKey: "name", title: "Name", filterable: true },
    ]);

    expect(columns).toHaveLength(2);
    expect(columns[0].enableSorting).toBe(false);
    expect(columns[1].enableColumnFilter).toBe(true);

    render(
      <div>
        {typeof columns[1].header === "function" &&
          columns[1].header?.({
            column: { columnDef: {}, getCanSort: () => true } as never,
          } as never)}
      </div>,
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("filter:name")).toBeInTheDocument();
  });
});
