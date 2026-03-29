import "@/test/navigation";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import OrdersError from "./orders/error";
import OrdersLoading from "./orders/loading";
import OrdersPage from "./orders/page";
import Home from "./page";

vi.mock("@/components/orders/orderTable/orderTable", () => ({
  OrderTable: ({ params }: { params: unknown }) => <div>{JSON.stringify(params)}</div>,
}));

describe("app routes", () => {
  it("redirects home to orders", () => {
    expect(() => Home()).toThrow("NEXT_REDIRECT:/orders");
  });

  it("renders loading and error states", () => {
    render(
      <>
        <OrdersLoading />
        <OrdersError error={new Error("boom")} reset={vi.fn()} />
      </>,
    );
    expect(screen.getByText("boom")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Try again"));
  });

  it("redirects orders page when createdAt_gte is missing", async () => {
    await expect(OrdersPage({ searchParams: Promise.resolve({}) })).rejects.toThrow(/NEXT_REDIRECT:\/orders\?/);
  });

  it("renders orders page with parsed params", async () => {
    const page = await OrdersPage({
      searchParams: Promise.resolve({ createdAt_gte: "2026-03-01", sort: "-price" }),
    });
    expect(page).toBeTruthy();
  });
});
