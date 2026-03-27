import { OrderDetailsTabs } from "../orderDetailsTabs";

interface OrderExpandedRowProps {
  orderId: string;
  orderLabel: string;
}

export function OrderExpandedRow({ orderId, orderLabel }: OrderExpandedRowProps) {
  return (
    <div className="bg-muted/30 p-3">
      <OrderDetailsTabs orderId={orderId} orderLabel={orderLabel} />
    </div>
  );
}
