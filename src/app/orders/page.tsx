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

  const page = ordersParams.page ?? 1;
  const perPage = ordersParams.perPage ?? 50;
  const fetchParams =
    page > 1
      ? { ...ordersParams, page: 1, perPage: perPage * page }
      : ordersParams;

  const ordersPromise = getOrders(fetchParams);

  return (
    <PageContainer title="Orders">
      <Suspense fallback={<DataTableSkeleton columns={8} />}>
        <OrderTable ordersPromise={ordersPromise} params={ordersParams} />
      </Suspense>
    </PageContainer>
  );
}