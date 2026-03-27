import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  UserConfigSchema,
  DEFAULT_USER_CONFIG,
  type UserConfig,
} from "@/lib/schemas/userConfig.schema";

interface UserConfigActions {
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
    (set) => ({
      ...DEFAULT_USER_CONFIG,

      setDefaultSort: (sort) => set({ defaultSort: sort }),
      setPerPage: (perPage) => set({ perPage }),
      setColumnOrder: (order) => set({ columnOrder: order }),
      setColumnSizing: (sizing) => set({ columnSizing: sizing }),
      resetColumnOrder: () => set({ columnOrder: [...DEFAULT_USER_CONFIG.columnOrder] }),
      resetColumnSizing: () => set({ columnSizing: { ...DEFAULT_USER_CONFIG.columnSizing } }),
    }),
    {
      name: "user-config",
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => ({
        ...current,
        ...safeParse(persisted),
      }),
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