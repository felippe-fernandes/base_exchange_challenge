import { DEFAULT_USER_CONFIG } from "@/lib/schemas/userConfig.schema";
import { useUserConfigStore } from "@/stores/userConfigStore";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Providers } from "./providers";

vi.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: () => <div>Devtools</div>,
}));

const setThemeMock = vi.fn();

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useTheme: () => ({ setTheme: setThemeMock }),
}));

describe("Providers", () => {
  beforeEach(() => {
    useUserConfigStore.setState({
      ...DEFAULT_USER_CONFIG,
      tableDefaults: { tableId: "", defaultSort: "", columnOrder: [] },
    });
  });

  it("renders children with query provider", () => {
    render(
      <Providers>
        <div>Child</div>
      </Providers>,
    );

    expect(screen.getByText("Child")).toBeInTheDocument();
    expect(screen.getByText("Devtools")).toBeInTheDocument();
  });

  it("syncs the saved theme preference", () => {
    useUserConfigStore.setState({ theme: "dark" });

    render(
      <Providers>
        <div>Child</div>
      </Providers>,
    );

    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });
});
