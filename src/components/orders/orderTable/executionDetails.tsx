import { Suspense, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { Money } from "@/types/order";
import type { PaginatedExecutions } from "@/lib/api/orders";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatNumber, formatDateTime } from "@/lib/formatters";
import { getExecutions } from "@/lib/api/orders";
import { useOrderExecutions } from "@/hooks/useOrderExecutions";

interface ExecutionDetailsProps {
  orderId: string;
  orderLabel?: string;
}

function ExecutionSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

function ExecutionDetailsContent({
  orderId,
  orderLabel,
  initialPromise,
}: ExecutionDetailsProps & { initialPromise: Promise<PaginatedExecutions> }) {
  const [searchValue, setSearchValue] = useState("");
  const { executions, totalItems, currentPage, totalPages, isLoading, search, goToPage } =
    useOrderExecutions(orderId, initialPromise);

  return (
    <div className="border-l-2 border-primary/30 bg-muted/30 p-3">
      <div className="mb-2 flex items-center gap-3">
        <h4 className="shrink-0 text-xs font-medium">
          Executions for {orderLabel ?? orderId.slice(0, 8)}
        </h4>
        <div className="relative w-48">
          <Search className="text-muted-foreground absolute left-2 top-1/2 size-3 -translate-y-1/2" />
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              search(e.target.value);
            }}
            className="h-7 pl-7 text-xs"
          />
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1, searchValue)}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <span className="text-muted-foreground text-xs">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={currentPage >= totalPages}
              onClick={() => goToPage(currentPage + 1, searchValue)}
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        )}
        <span className="text-muted-foreground text-xs">
          {totalItems} execution{totalItems !== 1 && "s"}
        </span>
      </div>
      {isLoading ? (
        <ExecutionSkeleton />
      ) : executions.length === 0 ? (
        <div className="text-muted-foreground py-3 text-center text-sm">
          No executions found.
        </div>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground border-b text-left">
              <th className="pb-1.5 pr-4 font-medium">Execution ID</th>
              <th className="pb-1.5 pr-4 font-medium">Instrument</th>
              <th className="pb-1.5 pr-4 font-medium">Price</th>
              <th className="pb-1.5 pr-4 font-medium">Quantity</th>
              <th className="pb-1.5 font-medium">Executed At</th>
            </tr>
          </thead>
          <tbody>
            {executions.map((exec) => (
              <tr key={exec.id} className="border-b last:border-0">
                <td className="max-w-24 truncate py-1.5 pr-4 font-mono">{exec.id}</td>
                <td className="py-1.5 pr-4">{exec.instrument}</td>
                <td className="py-1.5 pr-4">
                  {formatCurrency((exec.price as Money).value, (exec.price as Money).ccy)}
                </td>
                <td className="py-1.5 pr-4">{formatNumber(exec.quantity)}</td>
                <td className="py-1.5">{formatDateTime(exec.executedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function ExecutionDetails({ orderId, orderLabel }: ExecutionDetailsProps) {
  const [promise] = useState(() => getExecutions(orderId));

  return (
    <Suspense fallback={<ExecutionSkeleton />}>
      <ExecutionDetailsContent
        orderId={orderId}
        orderLabel={orderLabel}
        initialPromise={promise}
      />
    </Suspense>
  );
}
