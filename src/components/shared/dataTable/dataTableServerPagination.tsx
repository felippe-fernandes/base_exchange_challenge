"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useCallback } from "react";

interface DataTableServerPaginationProps {
  page: number;
  pages: number;
  items: number;
  perPage: number;
}

export function DataTableServerPagination({
  page,
  pages,
  items,
  perPage,
}: DataTableServerPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = useCallback(
    (newPage: number, newPerPage?: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      if (newPerPage) params.set("perPage", String(newPerPage));
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-muted-foreground">
        {items} row(s) total
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <select
            className="h-8 w-[70px] rounded-md border border-input bg-background px-2 text-sm"
            value={perPage}
            onChange={(e) => navigate(1, Number(e.target.value))}
          >
            {[10, 20, 30, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page} of {pages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => navigate(1)}
            disabled={page <= 1}
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => navigate(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => navigate(page + 1)}
            disabled={page >= pages}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => navigate(pages)}
            disabled={page >= pages}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}