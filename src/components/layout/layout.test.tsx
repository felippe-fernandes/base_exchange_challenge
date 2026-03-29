import { render, screen } from "@testing-library/react";
import { Header } from "./header";
import { PageContainer } from "./page-container";

vi.mock("./reseedDatabaseButton", () => ({
  ReseedDatabaseButton: () => <button>Regenerate DB</button>,
}));

vi.mock("./userSettingsMenu", () => ({
  UserSettingsMenu: () => <button>Settings</button>,
}));

describe("layout components", () => {
  it("renders header and page container", () => {
    render(
      <>
        <Header />
        <PageContainer>Content</PageContainer>
      </>,
    );

    expect(screen.getByText("BASE Exchange")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Regenerate DB")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
