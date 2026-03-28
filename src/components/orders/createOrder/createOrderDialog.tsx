"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateOrder } from "@/hooks/useCreateOrder";

const CURRENCIES = [
  "USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "NZD",
  "CNY", "HKD", "SGD", "KRW", "INR", "BRL", "MXN", "ZAR",
  "SEK", "NOK", "DKK", "PLN", "TRY", "THB", "TWD", "AED",
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

export function CreateOrderDialog() {
  const [open, setOpen] = useState(false);
  const { form, onSubmit, isPending } = useCreateOrder({
    onSuccess: () => setOpen(false),
  });
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) form.reset();
      }}
    >
      <DialogTrigger
        render={
          <Button size="sm">
            <Plus className="size-4" />
            New Order
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instrument">Instrument</Label>
            <Input
              id="instrument"
              placeholder="e.g. AAPL"
              {...register("instrument")}
              aria-invalid={!!errors.instrument}
            />
            <FieldError message={errors.instrument?.message} />
          </div>

          <div className="space-y-2">
            <Label>Side</Label>
            <Controller
              name="side"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={field.value === "buy" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => field.onChange("buy")}
                  >
                    Buy
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={field.value === "sell" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => field.onChange("sell")}
                  >
                    Sell
                  </Button>
                </div>
              )}
            />
            <FieldError message={errors.side?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price-value">Price</Label>
            <div className="flex">
              <Controller
                name="price.value"
                control={control}
                render={({ field }) => (
                  <Input
                    id="price-value"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="rounded-r-none border-r-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                    value={field.value === undefined || field.value === null ? "" : field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber);
                    }}
                    onBlur={field.onBlur}
                    aria-invalid={!!errors.price?.value}
                  />
                )}
              />
              <Controller
                name="price.ccy"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-24 shrink-0 rounded-l-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((code) => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <FieldError message={errors.price?.value?.message || errors.price?.ccy?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="0"
                  className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                  value={field.value === undefined || field.value === null ? "" : field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber);
                  }}
                  onBlur={field.onBlur}
                  aria-invalid={!!errors.quantity}
                />
              )}
            />
            <FieldError message={errors.quantity?.message} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}