import { create } from "zustand";

interface DataTableState {
  totalItems: number;
  setTotalItems: (items: number) => void;
}

export const useDataTableStore = create<DataTableState>()((set) => ({
  totalItems: 0,
  setTotalItems: (items) => set({ totalItems: items }),
}));