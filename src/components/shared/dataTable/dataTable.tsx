"use client";

import { useRef } from "react";
import { type Row, type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronRight, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useColumnDragReorder } from "@/hooks/useColumnDragReorder";
import {
  Table,
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
  renderSubComponent?: (row: Row<TData>) => React.ReactNode;
  onRowClick?: (row: Row<TData>) => void;
}

const ROW_HEIGHT = 40;
const SCROLL_THRESHOLD = 200;

export function DataTable<TData>({
  table,
  onLoadMore,
  hasNextPage,
  isLoadingMore,
  footer,
  renderSubComponent,
  onRowClick,
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

  return (
    <div className="space-y-2">
      <div
        ref={parentRef}
        onScroll={handleScroll}
        className="max-h-[calc(100vh-240px)] overflow-auto rounded-md border"
      >
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_0_var(--border)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.filter((h) => h.column.getCanHide()).map((header) => (
                    <TableHead
                      key={header.id}
                      className="relative border-r last:border-r-0 px-3"
                      style={{ width: header.getSize() }}
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, header.column.id)}
                    >
                      <div className="flex items-center">
                        <span
                          draggable
                          onDragStart={(e) => onDragStart(e, header.column.id)}
                          onDragEnd={onDragEnd}
                          className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground -ml-1 mr-0.5 shrink-0"
                        >
                          <GripVertical className="size-3.5" />
                        </span>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </div>
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        onDoubleClick={() => header.column.resetSize()}
                        className={cn(
                          "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none hover:bg-primary/50",
                          header.column.getIsResizing() && "bg-primary",
                        )}
                      />
                    </TableHead>
                  ))}
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
                  >
                    {row.getVisibleCells().filter((c) => c.column.getCanHide()).map((cell, i) => (
                      <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                        <div className="flex items-center overflow-hidden">
                          {i === 0 && renderSubComponent && (
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
