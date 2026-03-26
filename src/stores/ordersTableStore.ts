import { create } from "zustand";

interface OrdersTableState {
  totalItems: number;
  isLoadingMore: boolean;

  setTotalItems: (items: number) => void;
  setIsLoadingMore: (loading: boolean) => void;
}

export const useOrdersTableStore = create<OrdersTableState>()((set) => ({
  totalItems: 0,
  isLoadingMore: false,

  setTotalItems: (items) => set({ totalItems: items }),
  setIsLoadingMore: (loading) => set({ isLoadingMore: loading }),
}));