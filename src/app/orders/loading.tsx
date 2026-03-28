import { PageContainer } from "@/components/layout/page-container";
import { DataTableSkeleton } from "@/components/shared/dataTable/dataTableSkeleton";

export default function OrdersLoading() {
  return (
    <PageContainer>
      <DataTableSkeleton columns={8} />
    </PageContainer>
  );
}