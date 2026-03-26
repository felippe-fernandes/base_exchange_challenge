import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { OrderTable } from "@/components/orders/orderTable/orderTable";
import { getOrders } from "@/lib/api/orders";
import { parseOrdersParams } from "@/lib/parseOrdersParams";
import { DataTableSkeleton } from "@/components/shared/dataTable/dataTableSkeleton";

interface OrdersPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const ordersParams = parseOrdersParams(await searchParams);
  const ordersPromise = getOrders(ordersParams);

  return (
    <PageContainer title="Orders">
      <Suspense
        key={JSON.stringify(ordersParams)}
        fallback={<DataTableSkeleton columns={8} />}
      >
        <OrderTable ordersPromise={ordersPromise} params={ordersParams} />
      </Suspense>
    </PageContainer>
  );
}
