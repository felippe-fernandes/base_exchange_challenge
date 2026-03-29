"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCancelOrder } from "@/hooks/useCancelOrder";
import { formatOrderLabel } from "@/lib/formatters";

interface CancelOrderDialogProps {
  order: { id: string; instrument: string; status: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelOrderDialog({ order, open, onOpenChange }: CancelOrderDialogProps) {
  const { mutate, isPending } = useCancelOrder();

  const handleCancel = () => {
    mutate(order.id, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to cancel <strong>{formatOrderLabel(order)}</strong>? This action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Keep Order
          </Button>
          <Button variant="destructive" size="sm" onClick={handleCancel} disabled={isPending}>
            {isPending ? "Cancelling..." : "Cancel Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface CancelOrderButtonProps {
  order: { id: string; instrument: string; status: string };
  variant?: "icon" | "default";
  icon?: React.ReactNode;
}

export function CancelOrderButton({ order, variant = "default", icon }: CancelOrderButtonProps) {
  const [open, setOpen] = useState(false);

  const canCancel = order.status === "open" || order.status === "partial";
  if (!canCancel) return null;

  return (
    <>
      {variant === "icon" ? (
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Cancel order ${order.instrument}`}
          className="text-destructive hover:text-destructive"
          onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        >
          {icon ?? <X className="size-3.5" />}
        </Button>
      ) : (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          Cancel Order
        </Button>
      )}
      <CancelOrderDialog order={order} open={open} onOpenChange={setOpen} />
    </>
  );
}
