import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DataTableCheckboxFilter } from "./dataTableCheckboxFilter";
import { DataTableDateRangeFilter } from "./dataTableDateRangeFilter";
import { DataTableNumericRangeFilter } from "./dataTableNumericRangeFilter";
import { DataTableTextFilter } from "./dataTableTextFilter";

vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button className={className}>{children}</button>
  ),
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/hooks/useColumnFilter", () => ({
  useColumnFilter: () => ({
    selectedValues: ["open"],
    toggleValue: vi.fn(),
    clearFilter: vi.fn(),
  }),
}));

vi.mock("@/hooks/useTextFilter", () => ({
  useTextFilter: () => ({
    value: "abc",
    setValue: vi.fn(),
    clearFilter: vi.fn(),
  }),
}));

vi.mock("@/hooks/useNumericRangeFilter", () => ({
  useNumericRangeFilter: () => ({
    min: 1,
    max: 10,
    setRange: vi.fn(),
    clearFilter: vi.fn(),
    hasFilter: true,
  }),
}));

vi.mock("@/hooks/useDateRangeFilter", () => ({
  useDateRangeFilter: () => ({
    from: "2026-03-01T10:00Z",
    to: "2026-03-01T11:00Z",
    setRange: vi.fn(),
    clearFilter: vi.fn(),
    hasFilter: true,
  }),
}));

describe("data table filter components", () => {
  it("renders checkbox filter content", async () => {
    render(
      <DataTableCheckboxFilter
        field="status"
        title="Status"
        fetchOptions={async () => ["open", "closed"]}
      />,
    );
    expect(screen.getByPlaceholderText("Search status...")).toBeInTheDocument();
  });

  it("renders text, numeric and date filter content", () => {
    render(
      <>
        <DataTableTextFilter field="id" title="ID" />
        <DataTableNumericRangeFilter field="price" title="Price" />
        <DataTableDateRangeFilter field="createdAt" title="Created" />
      </>,
    );

    expect(screen.getByDisplayValue("abc")).toBeInTheDocument();
    expect(screen.getByText("Price range")).toBeInTheDocument();
    expect(screen.getByText("Created range")).toBeInTheDocument();
    fireEvent.click(screen.getAllByText("Clear filter")[0]);
  });
});
