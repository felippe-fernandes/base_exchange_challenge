import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { OrderTable } from "@/components/orders/orderTable/orderTable";
import { getOrders, type OrdersParams } from "@/lib/api/orders";

interface OrdersPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;

  const page = params.page ? Number(params.page) : 1;
  const perPage = params.perPage ? Number(params.perPage) : 10;

  const ordersParams: OrdersParams = {
    page,
    perPage,
    sort: params.sort || "-createdAt",
    id: params.id,
    instrument: params.instrument,
    side: params.side,
    status: params.status,
  };

  const ordersPromise = getOrders(ordersParams);

  return (
    <PageContainer title="Orders">
      <Suspense
        key={JSON.stringify(ordersParams)}
        fallback={<div className="text-muted-foreground py-10 text-center">Loading orders...</div>}
      >
        <OrderTable ordersPromise={ordersPromise} page={page} perPage={perPage} />
      </Suspense>
    </PageContainer>
  );
}