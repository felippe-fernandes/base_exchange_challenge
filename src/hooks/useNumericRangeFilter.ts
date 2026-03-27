import { useCallback, useMemo } from "react";
import { useSearchParamsNavigation } from "./useSearchParamsNavigation";

export function useNumericRangeFilter(field: string) {
  const { searchParams, navigate } = useSearchParamsNavigation();
  const gteKey = `${field}_gte`;
  const lteKey = `${field}_lte`;

  const min = useMemo(() => {
    const val = searchParams.get(gteKey);
    return val ? Number(val) : undefined;
  }, [searchParams, gteKey]);

  const max = useMemo(() => {
    const val = searchParams.get(lteKey);
    return val ? Number(val) : undefined;
  }, [searchParams, lteKey]);

  const setRange = useCallback(
    (newMin?: number, newMax?: number) => {
      navigate((params) => {
        if (newMin !== undefined) params.set(gteKey, String(newMin));
        else params.delete(gteKey);

        if (newMax !== undefined) params.set(lteKey, String(newMax));
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

  const hasFilter = min !== undefined || max !== undefined;

  return { min, max, setRange, clearFilter, hasFilter };
}
