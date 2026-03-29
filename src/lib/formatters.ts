import { format } from "date-fns";
import {
  DEFAULT_USER_CONFIG,
  type DateFormat,
  type TimeFormat,
} from "@/lib/schemas/userConfig.schema";

interface DateTimePreferences {
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
}

function parseDateInput(dateString: string): Date {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ? new Date(`${dateString}T00:00:00`)
    : new Date(dateString);
}

function isDateOnly(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function resolveDateTimePreferences(preferences?: Partial<DateTimePreferences>): DateTimePreferences {
  return {
    dateFormat: preferences?.dateFormat ?? DEFAULT_USER_CONFIG.dateFormat,
    timeFormat: preferences?.timeFormat ?? DEFAULT_USER_CONFIG.timeFormat,
  };
}

function formatDateByPreference(date: Date, dateFormat: DateFormat): string {
  switch (dateFormat) {
    case "br":
      return format(date, "dd/MM/yyyy");
    case "us":
      return format(date, "MM/dd/yyyy");
    case "text":
      return format(date, "MMM d, yyyy");
    case "iso":
    default:
      return format(date, "yyyy-MM-dd");
  }
}

function formatTimeByPreference(date: Date, timeFormat: TimeFormat): string {
  return timeFormat === "12h" ? format(date, "hh:mm:ss a") : format(date, "HH:mm:ss");
}

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

export function formatDateTime(dateString: string, preferences?: Partial<DateTimePreferences>): string {
  const date = parseDateInput(dateString);
  const { dateFormat, timeFormat } = resolveDateTimePreferences(preferences);
  return `${formatDateByPreference(date, dateFormat)} ${formatTimeByPreference(date, timeFormat)}`;
}

export function formatDate(dateString: string, preferences?: Partial<DateTimePreferences>): string {
  const date = parseDateInput(dateString);
  const { dateFormat } = resolveDateTimePreferences(preferences);
  return formatDateByPreference(date, dateFormat);
}

export function toLocalDatetime(iso?: string): string {
  if (!iso) return "";
  if (isDateOnly(iso)) return `${iso}T00:00`;
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

export function toLocalDateInput(value?: string): string {
  if (!value) return "";
  if (isDateOnly(value)) return value;

  const date = new Date(value);
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeToIso(value?: string, bound: "start" | "end" = "start"): string | undefined {
  if (!value) return undefined;
  const d = parseDateInput(value);
  if (isNaN(d.getTime())) return undefined;
  if (isDateOnly(value) && bound === "end") {
    d.setHours(23, 59, 59, 999);
  }
  return d.toISOString();
}

export function formatOrderLabel(order: { instrument: string; id: string }): string {
  return `${order.instrument} #${order.id.slice(0, 8)}`;
}

export function cleanQueryString(params: URLSearchParams): string {
  return params.toString().replaceAll("%3A", ":");
}

export function formatFilterValue(value: string, preferences?: Partial<DateTimePreferences>): string {
  if (/^\d{4}-\d{2}-\d{2}(T|$)/.test(value)) {
    return value.includes("T")
      ? formatDateTime(value, preferences)
      : formatDate(value, preferences);
  }
  return value;
}
