import { DEFAULT_USER_CONFIG } from "@/lib/schemas/userConfig.schema";
import { useUserConfigStore } from "@/stores/userConfigStore";
import { fireEvent, render, screen } from "@testing-library/react";
import { createContext, useContext, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserSettingsMenu } from "./userSettingsMenu";

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ render }: { render: React.ReactElement }) => render,
  DropdownMenuContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/select", () => {
  const SelectContext = createContext<((value: string) => void) | null>(null);

  return {
    Select: ({
      children,
      onValueChange,
    }: {
      children: ReactNode;
      value: string;
      onValueChange: (value: string) => void;
    }) => (
      <SelectContext.Provider value={onValueChange}>{children}</SelectContext.Provider>
    ),
    SelectTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    SelectValue: ({ children }: { children?: ReactNode }) => <>{children}</>,
    SelectContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    SelectItem: ({
      children,
      value,
    }: {
      children: ReactNode;
      value: string;
    }) => {
      const onValueChange = useContext(SelectContext);
      return (
        <button type="button" onClick={() => onValueChange?.(value)}>
          {children}
        </button>
      );
    },
  };
});

describe("UserSettingsMenu", () => {
  beforeEach(() => {
    useUserConfigStore.setState({
      ...DEFAULT_USER_CONFIG,
      tableDefaults: { tableId: "", defaultSort: "", columnOrder: [] },
    });
  });

  it("renders all configuration fields", () => {
    render(<UserSettingsMenu />);

    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByText("Preferred currency")).toBeInTheDocument();
    expect(screen.getByText("Date format")).toBeInTheDocument();
    expect(screen.getByText("Time format")).toBeInTheDocument();
  });

  it("updates user preferences from the selects", () => {
    render(<UserSettingsMenu />);

    fireEvent.click(screen.getByRole("button", { name: "Dark" }));
    fireEvent.click(screen.getByRole("button", { name: "BRL" }));
    fireEvent.click(screen.getByRole("button", { name: "DD/MM/YYYY" }));
    fireEvent.click(screen.getByRole("button", { name: "12-hour" }));

    expect(useUserConfigStore.getState()).toMatchObject({
      theme: "dark",
      preferredCurrency: "BRL",
      dateFormat: "br",
      timeFormat: "12h",
    });
  });
});
