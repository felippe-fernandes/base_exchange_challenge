import { z } from "zod/v4";

export const TableConfigSchema = z.object({
  columnOrder: z.array(z.string()).default([]),
  columnSizing: z.record(z.string(), z.number()).default({}),
});

export type TableConfig = z.infer<typeof TableConfigSchema>;

export const DEFAULT_TABLE_CONFIG: TableConfig = {
  columnOrder: [],
  columnSizing: {},
};

export const UserThemeSchema = z.enum(["light", "dark", "system"]);
export const DateFormatSchema = z.enum(["iso", "br", "us", "text"]);
export const TimeFormatSchema = z.enum(["24h", "12h"]);

export type UserTheme = z.infer<typeof UserThemeSchema>;
export type DateFormat = z.infer<typeof DateFormatSchema>;
export type TimeFormat = z.infer<typeof TimeFormatSchema>;

export const DEFAULT_USER_CONFIG = {
  defaultSort: "",
  perPage: 50,
  theme: "system" as UserTheme,
  preferredCurrency: "USD",
  dateFormat: "iso" as DateFormat,
  timeFormat: "24h" as TimeFormat,
  tables: {} as Record<string, TableConfig>,
};

export const UserConfigSchema = z.object({
  defaultSort: z.string().default(DEFAULT_USER_CONFIG.defaultSort),
  perPage: z.number().int().min(10).max(200).default(DEFAULT_USER_CONFIG.perPage),
  theme: UserThemeSchema.default(DEFAULT_USER_CONFIG.theme),
  preferredCurrency: z.string().min(1).default(DEFAULT_USER_CONFIG.preferredCurrency),
  dateFormat: DateFormatSchema.default(DEFAULT_USER_CONFIG.dateFormat),
  timeFormat: TimeFormatSchema.default(DEFAULT_USER_CONFIG.timeFormat),
  tables: z.record(z.string(), TableConfigSchema).default({}),
});

export type UserConfig = z.infer<typeof UserConfigSchema>;

export interface TableDefaults {
  tableId: string;
  defaultSort: string;
  columnOrder: string[];
}
