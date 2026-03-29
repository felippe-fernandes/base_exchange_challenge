import { render, screen } from "@testing-library/react";
import { Providers } from "./providers";

vi.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: () => <div>Devtools</div>,
}));

describe("Providers", () => {
  it("renders children with query provider", () => {
    render(
      <Providers>
        <div>Child</div>
      </Providers>,
    );

    expect(screen.getByText("Child")).toBeInTheDocument();
    expect(screen.getByText("Devtools")).toBeInTheDocument();
  });
});
