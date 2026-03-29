"use client";

import { useCallback, useState } from "react";
import { Eye, X, Copy } from "lucide-react";
import type { Order } from "@/types/order";
import { ContextMenu, ContextMenuItem } from "@/components/shared/contextMenu";
import { CancelOrderDialog } from "@/components/shared/cancelOrderButton";
import { copyToClipboard } from "@/lib/utils";

interface OrderRowContextMenuProps {
  onViewDetails: (order: Order) => void;
}

interface MenuState {
  position: { x: number; y: number };
  order: Order;
}

export function useOrderRowContextMenu({ onViewDetails }: OrderRowContextMenuProps) {
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);

  const onContextMenu = useCallback((e: React.MouseEvent, order: Order) => {
    e.preventDefault();
    setMenu({ position: { x: e.clientX, y: e.clientY }, order });
  }, []);

  const close = useCallback(() => setMenu(null), []);

  const contextMenu = (
    <>
      {menu && (
        <ContextMenu position={menu.position} onClose={close}>
          <ContextMenuItem onClick={() => { onViewDetails(menu.order); close(); }}>
            <Eye className="size-4" />
            View Details
          </ContextMenuItem>
          <ContextMenuItem onClick={() => { copyToClipboard(menu.order.id); close(); }}>
            <Copy className="size-4" />
            Copy ID
          </ContextMenuItem>
          {(menu.order.status === "open" || menu.order.status === "partial") && (
            <ContextMenuItem
              variant="destructive"
              onClick={() => { setCancelOrder(menu.order); close(); }}
            >
              <X className="size-4" />
              Cancel Order
            </ContextMenuItem>
          )}
        </ContextMenu>
      )}
      {cancelOrder && (
        <CancelOrderDialog
          order={cancelOrder}
          open={!!cancelOrder}
          onOpenChange={(open) => { if (!open) setCancelOrder(null); }}
        />
      )}
    </>
  );

  return { onContextMenu, contextMenu };
}
