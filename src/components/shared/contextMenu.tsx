"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ContextMenuProps {
  position: { x: number; y: number } | null;
  onClose: () => void;
  children: React.ReactNode;
}

export function ContextMenu({ position, onClose, children }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!position) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [position, onClose]);

  if (!position) return null;

  return (
    <div
      ref={ref}
      className="fixed z-50 min-w-[160px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
      style={{ top: position.y, left: position.x }}
    >
      {children}
    </div>
  );
}

interface ContextMenuItemProps {
  onClick: () => void;
  variant?: "default" | "destructive";
  children: React.ReactNode;
}

export function ContextMenuItem({ onClick, variant = "default", children }: ContextMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        variant === "destructive" && "text-destructive hover:bg-destructive/10 hover:text-destructive",
      )}
    >
      {children}
    </button>
  );
}
