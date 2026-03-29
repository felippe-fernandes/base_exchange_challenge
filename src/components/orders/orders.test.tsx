import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { OrderDetailsDialog } from "./orderDetails/orderDetailsDialog";
import { OrderDetailsTabs } from "./orderDetailsTabs";
import { OrderExpandedRow } from "./orderTable/orderExpandedRow";
import { OrderInfo } from "./orderDetails/orderInfo";
import { OrderTimeline } from "./orderDetails/orderTimeline";
import { ExecutionDetails } from "./orderTable/executionDetails";
import { CreateOrderDialog } from "./createOrder/createOrderDialog";
import { orderCreatedToast } from "./createOrder/orderCreatedToast";
import { DEFAULT_USER_CONFIG } from "@/lib/schemas/userConfig.schema";
import { useUserConfigStore } from "@/stores/userConfigStore";
import { sampleExecution, sampleHistory, sampleOrder } from "@/test/fixtures";
import { renderWithProviders } from "@/test/testUtils";

vi.mock("@/hooks/useOrderDetails", () => ({
  useOrderDetails: () => ({ history: sampleHistory }),
}));

vi.mock("@/hooks/useOrderExecutions", () => ({
  useOrderExecutions: () => ({
    executions: [sampleExecution],
    totalItems: 1,
    currentPage: 1,
    totalPages: 1,
    search: vi.fn(),
    goToPage: vi.fn(),
  }),
}));

vi.mock("@/hooks/useCreateOrder", () => ({
  useCreateOrder: () => ({
    isPending: false,
    onSubmit: (e?: React.FormEvent) => e?.preventDefault(),
    form: {
      register: () => ({ name: "instrument", onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() }),
      control: {},
      reset: vi.fn(),
      formState: { errors: {} },
    },
  }),
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div role="dialog">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children, render }: { children: React.ReactNode; render?: React.ReactElement }) =>
    render ? React.cloneElement(render, {}, children) : <button>{children}</button>,
}));

vi.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  SelectValue: () => <span>USD</span>,
}));

vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-hook-form")>();
  return {
    ...actual,
    Controller: ({ render }: { render: (props: { field: { value: string; onChange: (value: string) => void; onBlur: () => void } }) => React.ReactNode }) =>
      render({ field: { value: "buy", onChange: vi.fn(), onBlur: vi.fn() } }),
  };
});

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe("order components", () => {
  beforeEach(() => {
    useUserConfigStore.setState({
      ...DEFAULT_USER_CONFIG,
      tableDefaults: { tableId: "", defaultSort: "", columnOrder: [] },
    });
  });

  it("renders order info, timeline and execution details", async () => {
    renderWithProviders(
      <>
        <OrderInfo order={sampleOrder} />
        <OrderTimeline orderId={sampleOrder.id} />
        <ExecutionDetails orderId={sampleOrder.id} orderLabel="AAPL #00000000" />
      </>,
    );

    expect(screen.getAllByText("AAPL").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Partial|Open/).length).toBeGreaterThan(0);
    expect(await screen.findByText("Executions for AAPL #00000000")).toBeInTheDocument();
  });

  it("applies saved date and time preferences to rendered order timestamps", async () => {
    useUserConfigStore.setState({
      dateFormat: "br",
      timeFormat: "12h",
    });

    renderWithProviders(
      <>
        <OrderInfo order={sampleOrder} />
        <OrderTimeline orderId={sampleOrder.id} />
        <ExecutionDetails orderId={sampleOrder.id} orderLabel="AAPL #00000000" />
      </>,
    );

    expect(screen.getAllByText(/01\/03\/2026 \d{2}:\d{2}:\d{2} AM/).length).toBeGreaterThan(1);
  });

  it("renders tabs, expanded row and details dialog", () => {
    renderWithProviders(
      <>
        <OrderDetailsTabs orderId={sampleOrder.id} orderLabel="Label" defaultTab="history" />
        <OrderExpandedRow orderId={sampleOrder.id} orderLabel="Label" />
        <OrderDetailsDialog order={sampleOrder} open onOpenChange={vi.fn()} />
      </>,
    );

    expect(screen.getAllByText("Status History").length).toBeGreaterThan(0);
    expect(screen.getByText("AAPL #00000000")).toBeInTheDocument();
  });

  it("renders create order dialog", async () => {
    renderWithProviders(<CreateOrderDialog />);
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Create Order" })).toBeInTheDocument(),
    );
  });

  it("creates success toast content", () => {
    orderCreatedToast(sampleOrder);
    expect(toast.success).toHaveBeenCalled();
  });
});
