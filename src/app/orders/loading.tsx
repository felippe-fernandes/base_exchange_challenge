import { PageContainer } from "@/components/layout/page-container";

export default function OrdersLoading() {
  return (
    <PageContainer title="Orders">
      <div className="space-y-4">
        <div className="rounded-md border">
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Loading orders...
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
