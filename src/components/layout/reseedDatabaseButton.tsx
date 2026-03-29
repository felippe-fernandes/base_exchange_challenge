"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DatabaseZap } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/fieldError";
import { useReseedOrders } from "@/hooks/useReseedOrders";
import {
  MAX_RESEED_COUNT,
  MIN_RESEED_COUNT,
  ReseedSchema,
  type ReseedInput,
} from "@/lib/schemas/reseed.schema";

const DEFAULT_COUNT = MIN_RESEED_COUNT;

export function ReseedDatabaseButton() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useReseedOrders();
  const form = useForm<ReseedInput>({
    resolver: zodResolver(ReseedSchema),
    defaultValues: {
      count: DEFAULT_COUNT,
    },
  });
  const {
    control,
    reset,
    formState: { errors },
  } = form;

  const handleConfirm = form.handleSubmit((data) => {
    mutate(data.count, {
      onSuccess: () => setOpen(false),
    });
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) reset({ count: DEFAULT_COUNT });
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <DatabaseZap className="size-4" />
            Regenerate DB
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Regenerate database</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This will recreate the mock database using the same seed logic as `npm run seed`.
        </p>
        <div className="space-y-2">
          <Label htmlFor="reseed-count">How many items should be created?</Label>
          <Controller
            name="count"
            control={control}
            render={({ field }) => (
              <Input
                id="reseed-count"
                type="number"
                min={String(MIN_RESEED_COUNT)}
                max={String(MAX_RESEED_COUNT)}
                step="1"
                placeholder={`${MIN_RESEED_COUNT} to ${MAX_RESEED_COUNT}`}
                value={field.value ?? ""}
                onChange={(e) => {
                  field.onChange(
                    e.target.value === "" ? undefined : e.target.valueAsNumber,
                  );
                }}
                onBlur={field.onBlur}
                aria-invalid={!!errors.count}
              />
            )}
          />
          <p className="text-xs text-muted-foreground">
            Allowed range: {MIN_RESEED_COUNT} to {MAX_RESEED_COUNT} items.
          </p>
          <FieldError message={errors.count?.message} />
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Generating..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
