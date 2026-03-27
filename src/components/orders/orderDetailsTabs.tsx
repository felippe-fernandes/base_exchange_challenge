import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderTimeline } from "./orderDetails/orderTimeline";
import { ExecutionDetails } from "./orderTable/executionDetails";

interface OrderDetailsTabsProps {
  orderId: string;
  orderLabel: string;
  defaultTab?: "executions" | "history";
}

export function OrderDetailsTabs({
  orderId,
  orderLabel,
  defaultTab = "executions",
}: OrderDetailsTabsProps) {
  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList>
        <TabsTrigger value="executions">Executions</TabsTrigger>
        <TabsTrigger value="history">Status History</TabsTrigger>
      </TabsList>
      <TabsContent value="executions">
        <ExecutionDetails orderId={orderId} orderLabel={orderLabel} />
      </TabsContent>
      <TabsContent value="history">
        <OrderTimeline orderId={orderId} />
      </TabsContent>
    </Tabs>
  );
}
