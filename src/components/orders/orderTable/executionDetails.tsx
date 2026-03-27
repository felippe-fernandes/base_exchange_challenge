import { Suspense, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { Money, Execution } from "@/types/order";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MiniTable, type MiniTableColumn } from "@/components/shared/miniTable";
import { formatCurrency, formatNumber, formatDateTime } from "@/lib/formatters";
import { useOrderExecutions } from "@/hooks/useOrderExecutions";

const executionColumns: MiniTableColumn<Execution>[] = [
  {
    key: "id",
    header: "Execution ID",
    className: "max-w-24",
    cell: (row) => <span className="truncate font-mono">{row.id}</span>,
  },
  { key: "instrument", header: "Instrument" },
  {
    key: "price",
    header: "Price",
    cell: (row) => {
      const price = row.price as Money;
      return formatCurrency(price.value, price.ccy);
    },
  },
  {
    key: "quantity",
    header: "Quantity",
    cell: (row) => formatNumber(row.quantity),
  },
  {
    key: "executedAt",
    header: "Executed At",
    cell: (row) => formatDateTime(row.executedAt),
  },
];

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

function ExecutionDetailsContent({ orderId, orderLabel }: ExecutionDetailsProps) {
  const [searchValue, setSearchValue] = useState("");
  const { executions, totalItems, currentPage, totalPages, search, goToPage } =
    useOrderExecutions(orderId);

  return (
    <div>
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
      <MiniTable
        columns={executionColumns}
        data={executions}
        getRowKey={(row) => row.id}
        emptyMessage="No executions found."
        className="text-xs"
      />
    </div>
  );
}

export function ExecutionDetails({ orderId, orderLabel }: ExecutionDetailsProps) {
  return (
    <Suspense fallback={<ExecutionSkeleton />}>
      <ExecutionDetailsContent orderId={orderId} orderLabel={orderLabel} />
    </Suspense>
  );
}