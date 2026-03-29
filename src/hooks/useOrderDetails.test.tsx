import { renderHook, waitFor } from "@testing-library/react";
import { getOrderHistory } from "@/lib/api/orders";
import { createQueryClientWrapper, createTestQueryClient } from "@/test/testUtils";
import { sampleHistory } from "@/test/fixtures";
import { useOrderDetails } from "./useOrderDetails";

vi.mock("@/lib/api/orders", () => ({
  getOrderHistory: vi.fn(),
}));

describe("useOrderDetails", () => {
  it("loads history", async () => {
    vi.mocked(getOrderHistory).mockResolvedValue(sampleHistory);
    const queryClient = createTestQueryClient();

    const { result } = renderHook(() => useOrderDetails("1"), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.history).toEqual(sampleHistory);
    });
  });
});
