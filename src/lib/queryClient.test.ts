import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { getQueryClient } from "./queryClient";

describe("getQueryClient", () => {
  it("returns a query client", () => {
    expect(getQueryClient()).toBeInstanceOf(QueryClient);
  });
});
