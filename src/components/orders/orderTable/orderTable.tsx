"use client";

import { use } from "react";
import type { PaginatedOrders } from "@/lib/api/orders";
import { DataTable } from "@/components/shared/dataTable/dataTable";
import { DataTableServerPagination } from "@/components/shared/dataTable/dataTableServerPagination";
import { columns } from "./columns";

interface OrderTableProps {
  ordersPromise: Promise<PaginatedOrders>;
  page: number;
  perPage: number;
}

export function OrderTable({ ordersPromise, page, perPage }: OrderTableProps) {
  const { data: orders, pages, items } = use(ordersPromise);

  return (
    <DataTable
      columns={columns}
      data={orders}
      pagination={
        <DataTableServerPagination
          page={page}
          pages={pages}
          items={items}
          perPage={perPage}
        />
      }
    />
  );
}