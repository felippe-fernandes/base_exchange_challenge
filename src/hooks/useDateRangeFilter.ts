import { useCallback, useMemo } from "react";
import { useSearchParamsNavigation } from "./useSearchParamsNavigation";

export function useDateRangeFilter(field: string) {
  const { searchParams, navigate } = useSearchParamsNavigation();
  const gteKey = `${field}_gte`;
  const lteKey = `${field}_lte`;

  const from = useMemo(
    () => searchParams.get(gteKey) ?? undefined,
    [searchParams, gteKey],
  );

  const to = useMemo(
    () => searchParams.get(lteKey) ?? undefined,
    [searchParams, lteKey],
  );

  const setRange = useCallback(
    (newFrom?: string, newTo?: string) => {
      navigate((params) => {
        if (newFrom) params.set(gteKey, newFrom);
        else params.delete(gteKey);

        if (newTo) params.set(lteKey, newTo);
        else params.delete(lteKey);
      });
    },
    [gteKey, lteKey, navigate],
  );

  const clearFilter = useCallback(() => {
    navigate((params) => {
      params.delete(gteKey);
      params.delete(lteKey);
    });
  }, [gteKey, lteKey, navigate]);

  const hasFilter = from !== undefined || to !== undefined;

  return { from, to, setRange, clearFilter, hasFilter };
}
