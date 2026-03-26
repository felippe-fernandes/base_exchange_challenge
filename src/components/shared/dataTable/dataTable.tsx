"use client";

import { useRef, useCallback } from "react";
import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData> {
  table: TanstackTable<TData>;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  footer?: React.ReactNode;
}

const ROW_HEIGHT = 40;
const SCROLL_THRESHOLD = 200;

export function DataTable<TData>({
  table,
  onLoadMore,
  hasNextPage,
  isLoadingMore,
  footer,
}: DataTableProps<TData>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;
  const columnCount = table.getAllColumns().length;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? virtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
      : 0;

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom < SCROLL_THRESHOLD && hasNextPage && !isLoadingMore) {
        onLoadMore?.();
      }
    },
    [hasNextPage, isLoadingMore, onLoadMore],
  );

  return (
    <div className="space-y-4">
      <div
        ref={parentRef}
        onScroll={handleScroll}
        className="max-h-[calc(100vh-240px)] overflow-auto rounded-md border"
      >
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_0_var(--border)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="border-r last:border-r-0 px-3"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: paddingTop }} />
              </tr>
            )}
            {virtualRows.length > 0 ? (
              virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <TableRow
                    key={row.id}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: paddingBottom }} />
              </tr>
            )}
            {isLoadingMore && (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="text-muted-foreground text-center"
                >
                  Loading more...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {footer}
    </div>
  );
}