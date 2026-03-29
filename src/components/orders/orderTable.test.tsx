import "@/test/navigation";
import type React from "react";
import { render, screen } from "@testing-library/react";
import { sampleOrder } from "@/test/fixtures";
import { OrderTable } from "./orderTable/orderTable";

vi.mock("@/hooks/useOrdersTable", () => ({
  useOrdersTable: () => ({
    table: { getRowModel: () => ({ rows: [] }) },
    orders: [sampleOrder],
    hasNextPage: false,
    isLoadingMore: false,
    isLoading: false,
    loadMore: vi.fn(),
    totalItems: 1,
  }),
}));

vi.mock("@/stores/userConfigStore", () => ({
  useUserConfigHydrated: () => true,
  useUserConfigStore: Object.assign(
    () => ({ columnOrder: ["id"], columnSizing: {} }),
    { getState: () => ({ initDefaults: vi.fn() }) },
  ),
}));

vi.mock("@/components/shared/dataTable/dataTable", () => ({
  DataTable: ({ footer }: { footer: React.ReactNode }) => <div>{footer}</div>,
}));

vi.mock("@/components/shared/dataTable/dataTableActiveFilters", () => ({
  DataTableActiveFilters: () => <div>filters</div>,
}));

vi.mock("@/components/orders/orderDetails/orderDetailsDialog", () => ({
  OrderDetailsDialog: () => <div>details-dialog</div>,
}));

vi.mock("./orderTable/columns", () => ({
  columns: [{ id: "id" }],
}));

vi.mock("./createOrder/createOrderDialog", () => ({
  CreateOrderDialog: () => <button>New Order</button>,
}));

vi.mock("./orderTable/orderExpandedRow", () => ({
  OrderExpandedRow: () => <div>expanded</div>,
}));

describe("OrderTable", () => {
  it("renders loaded orders summary", () => {
    render(<OrderTable params={{ page: 1 }} />);
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("New Order")).toBeInTheDocument();
    expect(screen.getByText("1 of 1 orders loaded")).toBeInTheDocument();
  });
});
