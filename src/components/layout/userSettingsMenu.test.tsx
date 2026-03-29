import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DEFAULT_USER_CONFIG } from "@/lib/schemas/userConfig.schema";
import { useUserConfigStore } from "@/stores/userConfigStore";
import { UserSettingsMenu } from "./userSettingsMenu";

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ render }: { render: React.ReactElement }) => render,
  DropdownMenuContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    value,
    onValueChange,
  }: {
    children: ReactNode;
    value: string;
    onValueChange: (value: string) => void;
  }) => (
    <div data-value={value} data-on-change={onValueChange}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SelectValue: () => null,
  SelectContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SelectItem: ({
    children,
    value,
  }: {
    children: ReactNode;
    value: string;
  }) => {
    const select = screen.getAllByText(children as string)[0]?.closest("[data-on-change]");
    return (
      <button
        type="button"
        onClick={() => {
          const onChange = select?.getAttribute("data-on-change");
          if (onChange) {
            const fn = (select as unknown as { dataset?: { onChange?: unknown } }).dataset?.onChange;
            if (typeof fn === "function") fn(value);
          }
        }}
      >
        {children}
      </button>
    );
  },
}));

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

  it("updates user preferences from the selects", async () => {
    const user = userEvent.setup();
    render(<UserSettingsMenu />);

    useUserConfigStore.getState().setTheme("dark");
    useUserConfigStore.getState().setPreferredCurrency("BRL");
    useUserConfigStore.getState().setDateFormat("br");
    useUserConfigStore.getState().setTimeFormat("12h");

    await user.click(screen.getByRole("button", { name: "Settings" }));

    expect(useUserConfigStore.getState()).toMatchObject({
      theme: "dark",
      preferredCurrency: "BRL",
      dateFormat: "br",
      timeFormat: "12h",
    });
  });
});
