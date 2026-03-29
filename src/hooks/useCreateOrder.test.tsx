import { renderHook, act, waitFor } from "@testing-library/react";
import { createOrder } from "@/lib/api/orders";
import { orderCreatedToast } from "@/components/orders/createOrder/orderCreatedToast";
import { queryKeys } from "@/lib/queryKeys";
import { createQueryClientWrapper, createTestQueryClient } from "@/test/testUtils";
import { sampleOrder } from "@/test/fixtures";
import { useCreateOrder } from "./useCreateOrder";

vi.mock("@/lib/api/orders", () => ({
  createOrder: vi.fn(),
}));

vi.mock("@/components/orders/createOrder/orderCreatedToast", () => ({
  orderCreatedToast: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("useCreateOrder", () => {
  it("uses the preferred currency as the default", () => {
    const { result } = renderHook(() => useCreateOrder({ preferredCurrency: "BRL" }), {
      wrapper: createQueryClientWrapper(createTestQueryClient()),
    });

    expect(result.current.form.getValues("price.ccy")).toBe("BRL");
  });

  it("submits orders and resets on success", async () => {
    vi.mocked(createOrder).mockResolvedValue(sampleOrder);
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(queryKeys.orders.list({}), {
      pages: [{ data: [], items: 0, pages: 1, first: 1, prev: null, next: null, last: 1 }],
      pageParams: [1],
    });

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCreateOrder({ onSuccess, preferredCurrency: "USD" }), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    act(() => {
      result.current.form.setValue("instrument", "AAPL");
      result.current.form.setValue("side", "buy");
      result.current.form.setValue("price.value", 1);
      result.current.form.setValue("price.ccy", "USD");
      result.current.form.setValue("quantity", 1);
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    await waitFor(() => {
      expect(createOrder).toHaveBeenCalled();
      expect(orderCreatedToast).toHaveBeenCalledWith(sampleOrder);
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
