import { useCallback } from "react";
import type { Table as TanstackTable } from "@tanstack/react-table";

const DRAG_KEY = "application/x-column-id";

export function useColumnDragReorder<TData>(table: TanstackTable<TData>) {
  const onDragStart = useCallback((e: React.DragEvent, columnId: string) => {
    e.dataTransfer.setData(DRAG_KEY, columnId);
    e.dataTransfer.effectAllowed = "move";
    requestAnimationFrame(() => {
      const th = (e.target as HTMLElement).closest("th");
      if (th) th.style.opacity = "0.5";
    });
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes(DRAG_KEY)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    }
  }, []);

  const onDragEnd = useCallback((e: React.DragEvent) => {
    const th = (e.target as HTMLElement).closest("th");
    if (th) th.style.opacity = "1";
  }, []);

  const onDrop = useCallback((e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData(DRAG_KEY);
    if (!sourceId || sourceId === targetColumnId) return;

    const currentOrder = table.getState().columnOrder.length > 0
      ? [...table.getState().columnOrder]
      : table.getAllLeafColumns().map((c) => c.id);

    const sourceIndex = currentOrder.indexOf(sourceId);
    const targetIndex = currentOrder.indexOf(targetColumnId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    currentOrder.splice(sourceIndex, 1);
    currentOrder.splice(targetIndex, 0, sourceId);

    table.setColumnOrder(currentOrder);
  }, [table]);

  return { onDragStart, onDragOver, onDragEnd, onDrop };
}
