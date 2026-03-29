import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  UserConfigSchema,
  DEFAULT_USER_CONFIG,
  DEFAULT_TABLE_CONFIG,
  type UserConfig,
  type TableDefaults,
  type TableConfig,
} from "@/lib/schemas/userConfig.schema";

interface UserConfigActions {
  tableDefaults: TableDefaults;
  initDefaults: (defaults: TableDefaults) => void;
  setDefaultSort: (sort: string) => void;
  setPerPage: (perPage: number) => void;
  getTableConfig: () => TableConfig;
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
      tableDefaults: { tableId: "", defaultSort: "", columnOrder: [] },

      initDefaults: (defaults) => {
        const state = get();
        if (state.tableDefaults.tableId === defaults.tableId
          && state.tableDefaults.defaultSort === defaults.defaultSort
          && state.tableDefaults.columnOrder.length === defaults.columnOrder.length) return;
        const tableConfig = state.tables[defaults.tableId] ?? DEFAULT_TABLE_CONFIG;
        const updates: Partial<UserConfig> = {};
        if (!state.defaultSort) updates.defaultSort = defaults.defaultSort;
        if (tableConfig.columnOrder.length === 0) {
          updates.tables = {
            ...state.tables,
            [defaults.tableId]: { ...tableConfig, columnOrder: defaults.columnOrder },
          };
        }
        set({ tableDefaults: defaults, ...updates });
      },
      setDefaultSort: (sort) => set({ defaultSort: sort }),
      setPerPage: (perPage) => set({ perPage }),
      getTableConfig: () => {
        const state = get();
        return state.tables[state.tableDefaults.tableId] ?? DEFAULT_TABLE_CONFIG;
      },
      setColumnOrder: (order) => set((s) => ({
        tables: {
          ...s.tables,
          [s.tableDefaults.tableId]: { ...(s.tables[s.tableDefaults.tableId] ?? DEFAULT_TABLE_CONFIG), columnOrder: order },
        },
      })),
      setColumnSizing: (sizing) => set((s) => ({
        tables: {
          ...s.tables,
          [s.tableDefaults.tableId]: { ...(s.tables[s.tableDefaults.tableId] ?? DEFAULT_TABLE_CONFIG), columnSizing: sizing },
        },
      })),
      resetColumnOrder: () => set((s) => ({
        tables: {
          ...s.tables,
          [s.tableDefaults.tableId]: {
            ...(s.tables[s.tableDefaults.tableId] ?? DEFAULT_TABLE_CONFIG),
            columnOrder: [...s.tableDefaults.columnOrder],
          },
        },
      })),
      resetColumnSizing: () => set((s) => ({
        tables: {
          ...s.tables,
          [s.tableDefaults.tableId]: {
            ...(s.tables[s.tableDefaults.tableId] ?? DEFAULT_TABLE_CONFIG),
            columnSizing: {},
          },
        },
      })),
    }),
    {
      name: "user-config",
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => ({
        ...current,
        ...safeParse(persisted),
      }),
      partialize: ({ tableDefaults: _td, initDefaults: _id, getTableConfig: _gtc, ...rest }) => rest as UserConfig,
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
