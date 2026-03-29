import type { Order } from "@/types/order";
import { StatusBadge } from "@/components/shared/statusBadge";
import { FieldDisplay } from "@/components/shared/fieldDisplay";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  ORDER_SIDE_COLORS,
  ORDER_SIDE_LABELS,
} from "@/lib/constants";
import { formatCurrency, formatNumber, formatDateTime } from "@/lib/formatters";
import { useUserConfigStore } from "@/stores/userConfigStore";

interface OrderInfoProps {
  order: Order;
}

export function OrderInfo({ order }: OrderInfoProps) {
  const dateFormat = useUserConfigStore((state) => state.dateFormat);
  const timeFormat = useUserConfigStore((state) => state.timeFormat);

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
      <FieldDisplay label="ID">
        <span className="font-mono text-xs">{order.id}</span>
      </FieldDisplay>
      <FieldDisplay label="Instrument">{order.instrument}</FieldDisplay>
      <FieldDisplay label="Side">
        <StatusBadge
          status={order.side}
          colorMap={ORDER_SIDE_COLORS}
          labelMap={ORDER_SIDE_LABELS}
          variant="text"
        />
      </FieldDisplay>
      <FieldDisplay label="Price">{formatCurrency(order.price.value, order.price.ccy)}</FieldDisplay>
      <FieldDisplay label="Quantity">{formatNumber(order.quantity)}</FieldDisplay>
      <FieldDisplay label="Remaining">{formatNumber(order.remainingQuantity)}</FieldDisplay>
      <FieldDisplay label="Status">
        <StatusBadge
          status={order.status}
          colorMap={ORDER_STATUS_COLORS}
          labelMap={ORDER_STATUS_LABELS}
        />
      </FieldDisplay>
      <FieldDisplay label="Created">{formatDateTime(order.createdAt, { dateFormat, timeFormat })}</FieldDisplay>
      <FieldDisplay label="Updated">{formatDateTime(order.updatedAt, { dateFormat, timeFormat })}</FieldDisplay>
    </dl>
  );
}
