import { redirect } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { OrderTable } from "@/components/orders/orderTable/orderTable";
import { parseOrdersParams } from "@/lib/parseOrdersParams";
import { startOfTodayIso, cleanQueryString } from "@/lib/formatters";

interface OrdersPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const raw = await searchParams;

  if (!raw.createdAt_gte) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(raw)) {
      if (value !== undefined) params.set(key, value);
    }
    params.set("createdAt_gte", startOfTodayIso());
    redirect(`/orders?${cleanQueryString(params)}`);
  }

  const ordersParams = parseOrdersParams(raw);

  return (
    <PageContainer>
      <OrderTable params={ordersParams} />
    </PageContainer>
  );
}
