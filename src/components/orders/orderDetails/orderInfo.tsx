import type { Order, Money } from "@/types/order";
import { StatusBadge } from "@/components/shared/statusBadge";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  ORDER_SIDE_COLORS,
  ORDER_SIDE_LABELS,
} from "@/lib/constants";
import { formatCurrency, formatNumber, formatDateTime } from "@/lib/formatters";

interface OrderInfoProps {
  order: Order;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-0.5 text-sm">{children}</dd>
    </div>
  );
}

export function OrderInfo({ order }: OrderInfoProps) {
  const price = order.price as Money;

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
      <Field label="ID">
        <span className="font-mono text-xs">{order.id}</span>
      </Field>
      <Field label="Instrument">{order.instrument}</Field>
      <Field label="Side">
        <StatusBadge
          status={order.side}
          colorMap={ORDER_SIDE_COLORS}
          labelMap={ORDER_SIDE_LABELS}
          variant="text"
        />
      </Field>
      <Field label="Price">{formatCurrency(price.value, price.ccy)}</Field>
      <Field label="Quantity">{formatNumber(order.quantity)}</Field>
      <Field label="Remaining">{formatNumber(order.remainingQuantity)}</Field>
      <Field label="Status">
        <StatusBadge
          status={order.status}
          colorMap={ORDER_STATUS_COLORS}
          labelMap={ORDER_STATUS_LABELS}
        />
      </Field>
      <Field label="Created">{formatDateTime(order.createdAt)}</Field>
      <Field label="Updated">{formatDateTime(order.updatedAt)}</Field>
    </dl>
  );
}
