import { render, screen } from "@testing-library/react";
import { Header } from "./header";
import { PageContainer } from "./page-container";

describe("layout components", () => {
  it("renders header and page container", () => {
    render(
      <>
        <Header />
        <PageContainer>Content</PageContainer>
      </>,
    );

    expect(screen.getByText("BASE Exchange")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
