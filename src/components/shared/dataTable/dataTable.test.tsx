import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import "@/test/navigation";
import { pushMock, resetNavigationState, setNavigationState } from "@/test/navigation";
import { useUserConfigStore } from "@/stores/userConfigStore";
import { sampleOrder } from "@/test/fixtures";
import { DataTable } from "./dataTable";
import { DataTableActiveFilters } from "./dataTableActiveFilters";
import { DataTableColumnHeader } from "./dataTableColumnHeader";
import { DataTableFilterDispatcher } from "./dataTableFilterDispatcher";
import { DataTablePagination } from "./dataTablePagination";
import { DataTableServerPagination } from "./dataTableServerPagination";
import { DataTableSkeleton } from "./dataTableSkeleton";
import { ApplyFilterButton, ClearFilterButton, FilterTrigger } from "./dataTableFilterParts";

vi.mock("./dataTableCheckboxFilter", () => ({
  DataTableCheckboxFilter: () => <div>checkbox-filter</div>,
}));
vi.mock("./dataTableTextFilter", () => ({
  DataTableTextFilter: () => <div>text-filter</div>,
}));
vi.mock("./dataTableNumericRangeFilter", () => ({
  DataTableNumericRangeFilter: () => <div>numeric-filter</div>,
}));
vi.mock("./dataTableDateRangeFilter", () => ({
  DataTableDateRangeFilter: () => <div>date-filter</div>,
}));
vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button className={className}>{children}</button>
  ),
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/hooks/useMultiSort", () => ({
  useMultiSort: () => ({
    sortEntries: [{ field: "price", direction: "desc" }],
    getSortState: () => ({ direction: "desc", priority: 1 }),
    toggleSort: vi.fn(),
  }),
  parseSortParam: (value: string) =>
    value
      ? value.split(",").map((entry) => ({
          field: entry.startsWith("-") ? entry.slice(1) : entry,
          direction: entry.startsWith("-") ? "desc" : "asc",
        }))
      : [],
}));

function TestTable() {
  const helper = createColumnHelper<typeof sampleOrder>();
  const table = useReactTable({
    data: [sampleOrder],
    columns: [
      helper.accessor("id", { header: "ID", enableHiding: true }),
      helper.accessor("instrument", { header: "Instrument", enableHiding: true }),
    ],
    getCoreRowModel: getCoreRowModel(),
    state: { columnOrder: ["id", "instrument"] },
    onColumnOrderChange: vi.fn(),
  });

  return <DataTable table={table} onRowClick={vi.fn()} renderSubComponent={() => <div>Expanded</div>} />;
}

describe("data table components", () => {
  beforeEach(() => {
    resetNavigationState();
    useUserConfigStore.setState({
      columnOrder: ["id", "instrument"],
      columnSizing: { id: 100 },
      tableDefaults: { defaultSort: "-createdAt", columnOrder: ["id", "instrument", "status"] },
    });
  });

  it("renders core table components", () => {
    render(<TestTable />);
    expect(screen.getByText("ID")).toBeInTheDocument();
  });

  it("renders active filters and handles clearing", () => {
    setNavigationState({ search: "status=open&sort=-price" });
    render(
      <DataTableActiveFilters
        filterLabels={{ status: "Status" }}
        tableDefaults={{ defaultSort: "-createdAt", columnOrder: ["id", "instrument"] }}
      />,
    );
    expect(screen.getByText(/Status: open/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText("Clear all"));
    expect(pushMock).toHaveBeenCalled();
  });

  it("renders column header and filter dispatcher", () => {
    const column = { id: "price" } as never;
    render(
      <>
        <DataTableColumnHeader column={column} title="Price" />
        <DataTableFilterDispatcher field="id" title="ID" filterType={{ type: "text" }} />
        <DataTableFilterDispatcher field="status" title="Status" filterType={{ type: "checkbox" }} fetchOptions={vi.fn()} />
        <DataTableFilterDispatcher field="price" title="Price" filterType={{ type: "numericRange" }} />
        <DataTableFilterDispatcher field="createdAt" title="Created" filterType={{ type: "dateRange" }} />
      </>,
    );

    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("text-filter")).toBeInTheDocument();
    expect(screen.getByText("checkbox-filter")).toBeInTheDocument();
    expect(screen.getByText("numeric-filter")).toBeInTheDocument();
    expect(screen.getByText("date-filter")).toBeInTheDocument();
  });

  it("renders pagination helpers and filter buttons", () => {
    const table = {
      getFilteredRowModel: () => ({ rows: [sampleOrder] }),
      getState: () => ({ pagination: { pageSize: 10, pageIndex: 0 } }),
      setPageSize: vi.fn(),
      getPageCount: () => 2,
      setPageIndex: vi.fn(),
      previousPage: vi.fn(),
      nextPage: vi.fn(),
      getCanPreviousPage: () => true,
      getCanNextPage: () => true,
    } as never;

    render(
      <>
        <DataTablePagination table={table} />
        <DataTableServerPagination page={1} pages={2} items={3} perPage={10} />
        <DataTableSkeleton columns={2} rows={1} />
        <div>
          <FilterTrigger icon={() => <span>icon</span>} isActive />
        </div>
        <ApplyFilterButton onClick={vi.fn()} />
        <ClearFilterButton onClick={vi.fn()} />
      </>,
    );

    expect(screen.getAllByText(/row\(s\) total/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Apply")).toBeInTheDocument();
    expect(screen.getByText("Clear filter")).toBeInTheDocument();
  });
});
