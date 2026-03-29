import { reseedOrders } from "@/lib/api/orders";
import { createQueryClientWrapper, createTestQueryClient } from "@/test/testUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";
import { useReseedOrders } from "./useReseedOrders";

vi.mock("@/lib/api/orders", () => ({
  reseedOrders: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useReseedOrders", () => {
  it("reseed database and invalidates queries", async () => {
    vi.mocked(reseedOrders).mockResolvedValue({
      message: "Database regenerated",
      count: 1200,
      orders: 1200,
      statusHistory: 1800,
      executions: 400,
    });

    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useReseedOrders(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    result.current.mutate(1200);

    await waitFor(() => {
      expect(reseedOrders).toHaveBeenCalledWith(1200, expect.any(Object));
      expect(invalidateSpy).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });
  });
});
