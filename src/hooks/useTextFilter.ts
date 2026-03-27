import { useRef } from "react";
import { useSearchParamsNavigation } from "./useSearchParamsNavigation";

export function useTextFilter(field: string) {
  const { searchParams, navigate } = useSearchParamsNavigation();
  const paramKey = `${field}_like`;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const value = searchParams.get(paramKey) ?? "";

  const setValue = (newValue: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      navigate((params) => {
        if (newValue) {
          params.set(paramKey, newValue);
        } else {
          params.delete(paramKey);
        }
      });
    }, 300);
  };

  const clearFilter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    navigate((params) => {
      params.delete(paramKey);
    });
  };

  return { value, setValue, clearFilter };
}
