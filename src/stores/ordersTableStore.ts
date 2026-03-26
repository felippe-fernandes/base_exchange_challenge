import { create } from "zustand";
import type { Order } from "@/types/order";

interface OrdersTableState {
  extraPages: Order[][];
  currentPage: number;

  addPage: (page: number, data: Order[]) => void;
  reset: (page: number) => void;
}

export const useOrdersTableStore = create<OrdersTableState>()((set) => ({
  extraPages: [],
  currentPage: 1,

  addPage: (page, data) =>
    set((state) => ({
      extraPages: [...state.extraPages, data],
      currentPage: page,
    })),

  reset: (page) =>
    set({ extraPages: [], currentPage: page }),
}));