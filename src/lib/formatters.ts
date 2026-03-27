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

export function toLocalDatetime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function toIso(localDatetime: string): string {
  if (!localDatetime) return "";
  return new Date(localDatetime).toISOString();
}

export function formatFilterValue(key: string, value: string): string {
  if (key.startsWith("createdAt")) {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return value;
}
