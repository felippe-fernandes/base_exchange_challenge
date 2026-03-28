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

export function toCompactIso(localDatetime: string): string {
  if (!localDatetime) return "";
  const iso = new Date(localDatetime).toISOString();
  return iso.slice(0, 16) + "Z";
}

export function startOfTodayIso(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().slice(0, 10);
}

export function normalizeToIso(value?: string): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export function cleanQueryString(params: URLSearchParams): string {
  return params.toString().replaceAll("%3A", ":");
}

export function formatFilterValue(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}(T|$)/.test(value)) {
    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return value;
}
