import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface MiniTableColumn<TData> {
  key: string;
  header: string;
  cell?: (row: TData) => React.ReactNode;
  className?: string;
}

interface MiniTableProps<TData> {
  columns: MiniTableColumn<TData>[];
  data: TData[];
  getRowKey: (row: TData) => string;
  emptyMessage?: string;
  className?: string;
}

export function MiniTable<TData>({
  columns,
  data,
  getRowKey,
  emptyMessage = "No results.",
  className,
}: MiniTableProps<TData>) {
  return (
    <Table className={cn("table-fixed", className)}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map((col) => (
            <TableHead key={col.key} className={col.className}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-16 text-center text-muted-foreground"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row) => (
            <TableRow key={getRowKey(row)}>
              {columns.map((col) => {
                const raw = String((row as Record<string, unknown>)[col.key] ?? "");
                return (
                  <TableCell key={col.key} title={raw} className={cn("truncate", col.className)}>
                    {col.cell ? col.cell(row) : raw}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}