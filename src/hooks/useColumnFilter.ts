"use client";

import { useCallback, useMemo } from "react";
import { useSearchParamsNavigation } from "./useSearchParamsNavigation";

export function useColumnFilter(field: string) {
  const { searchParams, navigate } = useSearchParamsNavigation();

  const selectedValues = useMemo(
    () => searchParams.get(field)?.split(",").filter(Boolean) ?? [],
    [searchParams, field],
  );

  const toggleValue = useCallback(
    (value: string) => {
      navigate((params) => {
        const current = new Set(selectedValues);

        if (current.has(value)) {
          current.delete(value);
        } else {
          current.add(value);
        }

        if (current.size > 0) {
          params.set(field, Array.from(current).join(","));
        } else {
          params.delete(field);
        }
      });
    },
    [selectedValues, field, navigate],
  );

  const clearFilter = useCallback(() => {
    navigate((params) => {
      params.delete(field);
    });
  }, [field, navigate]);

  return { selectedValues, toggleValue, clearFilter };
}