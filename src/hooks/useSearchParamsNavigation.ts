"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cleanQueryString } from "@/lib/formatters";

interface NavigateOptions {
  resetPage?: boolean;
}

export function useSearchParamsNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = useCallback(
    (updater: (params: URLSearchParams) => void, options?: NavigateOptions) => {
      const params = new URLSearchParams(searchParams.toString());
      updater(params);
      if (options?.resetPage !== false) {
        params.delete("page");
      }
      router.push(`${pathname}?${cleanQueryString(params)}`);
    },
    [router, pathname, searchParams],
  );

  return { searchParams, navigate };
}
