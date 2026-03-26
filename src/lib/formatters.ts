import { format } from "date-fns";

export function formatCurrency(value: number, ccy: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: ccy,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), "yyyy-MM-dd HH:mm:ss");
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "yyyy-MM-dd");
}
