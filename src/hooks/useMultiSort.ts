import { useCallback, useMemo } from "react";
import { useSearchParamsNavigation } from "./useSearchParamsNavigation";
import { useUserConfigStore } from "@/stores/userConfigStore";

interface SortEntry {
  field: string;
  direction: "asc" | "desc";
}

interface SortState {
  direction: "asc" | "desc";
  priority: number;
}

export function parseSortParam(sort: string): SortEntry[] {
  if (!sort) return [];
  return sort.split(",").map((s) => {
    const desc = s.startsWith("-");
    return { field: desc ? s.slice(1) : s, direction: desc ? "desc" : "asc" };
  });
}

function serializeSortEntries(entries: SortEntry[]): string {
  return entries
    .map((e) => (e.direction === "desc" ? `-${e.field}` : e.field))
    .join(",");
}

export function useMultiSort() {
  const { searchParams, navigate } = useSearchParamsNavigation();
  const { tableDefaults } = useUserConfigStore();
  const currentSort = searchParams.get("sort") || tableDefaults.defaultSort;

  const sortEntries = useMemo(() => parseSortParam(currentSort), [currentSort]);

  const getSortState = useCallback(
    (field: string): SortState | null => {
      const index = sortEntries.findIndex((e) => e.field === field);
      if (index === -1) return null;
      return { direction: sortEntries[index].direction, priority: index + 1 };
    },
    [sortEntries],
  );

  const toggleSort = useCallback(
    (field: string, multi = false) => {
      const current = sortEntries.find((e) => e.field === field);
      const entries = multi ? sortEntries.filter((e) => e.field !== field) : [];

      if (!current) {
        entries.push({ field, direction: "asc" });
      } else if (current.direction === "asc") {
        entries.push({ field, direction: "desc" });
      }

      navigate((params) => {
        const serialized = serializeSortEntries(entries);
        if (serialized) {
          params.set("sort", serialized);
        } else {
          params.delete("sort");
        }
      });
    },
    [sortEntries, navigate],
  );

  return { sortEntries, getSortState, toggleSort };
}
