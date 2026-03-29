import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CopyButton } from "./copyButton";
import { ErrorBoundary } from "./errorBoundary";
import { FieldDisplay } from "./fieldDisplay";
import { FieldError } from "./fieldError";
import { MiniTable } from "./miniTable";
import { StatusBadge } from "./statusBadge";
import { Timeline } from "./timeline";
import { copyToClipboard } from "@/lib/utils";

vi.mock("@/lib/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/utils")>();
  return {
    ...actual,
    copyToClipboard: vi.fn().mockResolvedValue(true),
  };
});

function Thrower() {
  throw new Error("boom");
}

describe("shared components", () => {
  it("renders field display and errors", () => {
    render(
      <>
        <FieldDisplay label="Name">Value</FieldDisplay>
        <FieldError message="Required" />
      </>,
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("renders badges and timeline", () => {
    render(
      <>
        <StatusBadge
          status="open"
          colorMap={{ open: "text-blue-500" }}
          labelMap={{ open: "Open" }}
        />
        <Timeline items={[{ label: "Open", timestamp: "Now", description: "Created" }]} />
      </>,
    );

    expect(screen.getAllByText("Open").length).toBeGreaterThan(0);
    expect(screen.getByText("Created")).toBeInTheDocument();
  });

  it("renders mini table", () => {
    render(
      <MiniTable
        columns={[{ key: "id", header: "ID" }]}
        data={[{ id: "1" }]}
        getRowKey={(row) => row.id}
      />,
    );

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("handles copy button state", async () => {
    render(<CopyButton text="abc" />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(copyToClipboard).toHaveBeenCalledWith("abc"));
  });

  it("shows error boundary fallback", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary fallback={<div>Fallback</div>}>
        <Thrower />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Fallback")).toBeInTheDocument();
    errorSpy.mockRestore();
  });
});
