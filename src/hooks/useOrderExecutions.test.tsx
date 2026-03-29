import { sampleExecution } from "@/test/fixtures";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useOrderExecutions } from "./useOrderExecutions";

const useSuspenseQueryMock = vi.fn();

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useSuspenseQuery: (...args: unknown[]) => useSuspenseQueryMock(...args),
  };
});

describe("useOrderExecutions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useSuspenseQueryMock.mockReturnValue({
      data: {
        data: [sampleExecution],
        page: 1,
        pages: 2,
        items: 1,
      },
    });
  });

  it("loads, searches and paginates executions", () => {
    const { result } = renderHook(() => useOrderExecutions("1"));
    expect(result.current.executions).toEqual([sampleExecution]);

    act(() => {
      result.current.search("abc");
      vi.advanceTimersByTime(300);
    });

    expect(useSuspenseQueryMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        queryKey: ["executions", "1", { q: "abc", perPage: undefined, page: undefined }],
      }),
    );

    act(() => {
      result.current.goToPage(2, "abc", 20);
    });

    expect(useSuspenseQueryMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        queryKey: ["executions", "1", { page: 2, q: "abc", perPage: 20 }],
      }),
    );
  });
});
