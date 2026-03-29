"use client";

import { useMemo, useRef } from "react";
import { type Row, type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronRight, GripVertical } from "lucide-react";
import { useColumnDragReorder } from "@/hooks/useColumnDragReorder";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  table: TanstackTable<TData>;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  footer?: React.ReactNode;
  renderSubComponent?: (row: Row<TData>) => React.ReactNode;
  onRowClick?: (row: Row<TData>) => void;
  onRowContextMenu?: (e: React.MouseEvent, row: Row<TData>) => void;
}

const ROW_HEIGHT = 40;
const SCROLL_THRESHOLD = 200;

function splitPinned<T extends { column: { getCanResize: () => boolean } }>(items: T[]) {
  const pinned: T[] = [];
  const reorderable: T[] = [];
  for (const item of items) {
    if (item.column.getCanResize()) {
      reorderable.push(item);
    } else {
      pinned.push(item);
    }
  }
  return [...pinned, ...reorderable];
}

export function DataTable<TData>({
  table,
  onLoadMore,
  hasNextPage,
  isLoadingMore,
  footer,
  renderSubComponent,
  onRowClick,
  onRowContextMenu,
}: DataTableProps<TData>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;
  const visibleColumns = table.getAllColumns().filter((c) => c.getCanHide());
  const columnCount = visibleColumns.length;
  const { onDragStart, onDragOver, onDragEnd, onDrop } = useColumnDragReorder(table);

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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom < SCROLL_THRESHOLD && hasNextPage && !isLoadingMore) {
      onLoadMore?.();
    }
  };

  const headerGroups = table.getHeaderGroups();
  const sortedHeaders = useMemo(
    () => headerGroups.map((hg) => ({
      ...hg,
      headers: splitPinned(hg.headers.filter((h) => h.column.getCanHide())),
    })),
    [headerGroups],
  );

  return (
    <div className="space-y-2">
      <div
        ref={parentRef}
        onScroll={handleScroll}
        className="max-h-[calc(100vh-240px)] overflow-auto rounded-md border"
      >
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_0_var(--border)]">
            {sortedHeaders.map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                    const canResize = header.column.getCanResize();
                    return (
                      <TableHead
                        key={header.id}
                        className="relative border-r last:border-r-0 px-3"
                        style={{ width: header.getSize() }}
                        onDragOver={canResize ? onDragOver : undefined}
                        onDrop={canResize ? (e) => onDrop(e, header.column.id) : undefined}
                      >
                        <div className="flex items-center">
                          {canResize && (
                            <span
                              draggable
                              onDragStart={(e) => onDragStart(e, header.column.id)}
                              onDragEnd={onDragEnd}
                              className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground -ml-1 mr-0.5 shrink-0"
                            >
                              <GripVertical className="size-3.5" />
                            </span>
                          )}
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </div>
                      </TableHead>
                    );
                  })}
              </TableRow>
            ))}
          </TableHeader>
          {paddingTop > 0 && (
            <tbody>
              <tr>
                <td style={{ height: paddingTop }} />
              </tr>
            </tbody>
          )}
          {virtualRows.length > 0 ? (
            virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              const isExpanded = row.getIsExpanded() && renderSubComponent;
              const cells = splitPinned(row.getVisibleCells().filter((c) => c.column.getCanHide()));
              const firstReorderableIndex = cells.findIndex((c) => c.column.getCanResize());
              return (
                <tbody
                  key={row.id}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                >
                  <TableRow
                    className={onRowClick ? "cursor-pointer" : undefined}
                    onClick={(e) => {
                      if (!onRowClick) return;
                      const target = e.target as HTMLElement;
                      if (target.closest("button, a")) return;
                      onRowClick(row);
                    }}
                    onContextMenu={onRowContextMenu ? (e) => onRowContextMenu(e, row) : undefined}
                  >
                    {cells.map((cell, i) => (
                      <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                        <div className="flex items-center overflow-hidden">
                          {i === firstReorderableIndex && renderSubComponent && (
                            <button
                              type="button"
                              onClick={row.getToggleExpandedHandler()}
                              className="mr-1 shrink-0 text-muted-foreground/50 hover:text-muted-foreground"
                            >
                              <ChevronRight
                                className={cn(
                                  "size-4 transition-transform duration-200",
                                  row.getIsExpanded() && "rotate-90",
                                )}
                              />
                            </button>
                          )}
                          <span className="truncate" title={String(cell.getValue() ?? "")}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </span>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  {isExpanded && (
                    <tr>
                      <td colSpan={columnCount} className="p-0">
                        {renderSubComponent(row)}
                      </td>
                    </tr>
                  )}
                </tbody>
              );
            })
          ) : (
            <tbody>
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            </tbody>
          )}
          {paddingBottom > 0 && (
            <tbody>
              <tr>
                <td style={{ height: paddingBottom }} />
              </tr>
            </tbody>
          )}
          {isLoadingMore && (
            <tbody>
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="text-muted-foreground text-center"
                >
                  Loading more...
                </TableCell>
              </TableRow>
            </tbody>
          )}
        </Table>
      </div>
      {footer}
    </div>
  );
}
