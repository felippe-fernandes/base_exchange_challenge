import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  UserConfigSchema,
  DEFAULT_USER_CONFIG,
  type UserConfig,
  type TableDefaults,
} from "@/lib/schemas/userConfig.schema";

interface UserConfigActions {
  tableDefaults: TableDefaults;
  initDefaults: (defaults: TableDefaults) => void;
  setDefaultSort: (sort: string) => void;
  setPerPage: (perPage: number) => void;
  setColumnOrder: (order: string[]) => void;
  setColumnSizing: (sizing: Record<string, number>) => void;
  resetColumnOrder: () => void;
  resetColumnSizing: () => void;
}

type UserConfigState = UserConfig & UserConfigActions;

function safeParse(persisted: unknown): Partial<UserConfig> {
  const result = UserConfigSchema.safeParse(persisted);
  if (result.success) return result.data;
  return {};
}

export const useUserConfigStore = create<UserConfigState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_USER_CONFIG,
      tableDefaults: { defaultSort: "", columnOrder: [] },

      initDefaults: (defaults) => {
        const state = get();
        if (state.tableDefaults.defaultSort === defaults.defaultSort
          && state.tableDefaults.columnOrder.length === defaults.columnOrder.length) return;
        const updates: Partial<UserConfig> = {};
        if (state.columnOrder.length === 0) updates.columnOrder = defaults.columnOrder;
        if (!state.defaultSort) updates.defaultSort = defaults.defaultSort;
        set({ tableDefaults: defaults, ...updates });
      },
      setDefaultSort: (sort) => set({ defaultSort: sort }),
      setPerPage: (perPage) => set({ perPage }),
      setColumnOrder: (order) => set({ columnOrder: order }),
      setColumnSizing: (sizing) => set({ columnSizing: sizing }),
      resetColumnOrder: () => set((s) => ({ columnOrder: [...s.tableDefaults.columnOrder] })),
      resetColumnSizing: () => set({ columnSizing: { ...DEFAULT_USER_CONFIG.columnSizing } }),
    }),
    {
      name: "user-config",
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => ({
        ...current,
        ...safeParse(persisted),
      }),
      partialize: ({ tableDefaults: _td, initDefaults: _id, ...rest }) => rest as UserConfig,
    },
  ),
);

const noop = () => () => {};

export function useUserConfigHydrated() {
  const persist = useUserConfigStore.persist;
  return useSyncExternalStore(
    persist?.onFinishHydration ?? noop,
    () => persist?.hasHydrated() ?? false,
    () => false,
  );
}