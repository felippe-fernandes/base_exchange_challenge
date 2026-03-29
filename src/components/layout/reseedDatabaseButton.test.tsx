import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReseedDatabaseButton } from "./reseedDatabaseButton";

const mutateMock = vi.fn();

vi.mock("@/hooks/useReseedOrders", () => ({
  useReseedOrders: () => ({
    mutate: mutateMock,
    isPending: false,
  }),
}));

describe("ReseedDatabaseButton", () => {
  it("renders dialog content and submits the desired count", async () => {
    render(<ReseedDatabaseButton />);

    fireEvent.click(screen.getByText("Regenerate DB"));
    expect(screen.getByText("Regenerate database")).toBeInTheDocument();
    expect(screen.getByText("Allowed range: 1200 to 100000 items.")).toBeInTheDocument();

    const input = screen.getByLabelText("How many items should be created?");
    fireEvent.change(input, { target: { value: "1500" } });
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(1500, expect.any(Object));
    });
  });

  it("shows validation when count is below the minimum", async () => {
    render(<ReseedDatabaseButton />);

    fireEvent.click(screen.getByText("Regenerate DB"));
    const input = screen.getByLabelText("How many items should be created?");
    fireEvent.change(input, { target: { value: "1000" } });
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(screen.getByText("Count must be at least 1200")).toBeInTheDocument();
      expect(mutateMock).not.toHaveBeenCalledWith(1000, expect.any(Object));
    });
  });
});
