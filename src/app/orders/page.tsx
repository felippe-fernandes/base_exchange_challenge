import { OrderTable } from "@/components/orders/orderTable/orderTable";
import { PageContainer } from "@/components/layout/page-container";
import { getOrders } from "@/lib/api/orders";

export default function OrdersPage() {
  const ordersPromise = getOrders();

  return (
    <PageContainer title="Orders">
      <OrderTable ordersPromise={ordersPromise} />
    </PageContainer>
  );
}