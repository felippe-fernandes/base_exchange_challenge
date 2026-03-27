import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
  columns: number;
  rows?: number;
}

export function DataTableSkeleton({ columns, rows = 10 }: DataTableSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="max-h-[calc(100vh-240px)] overflow-auto rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
