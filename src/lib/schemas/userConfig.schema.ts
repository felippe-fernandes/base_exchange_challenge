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

export const DEFAULT_USER_CONFIG = {
  defaultSort: "",
  perPage: 50,
  tables: {} as Record<string, TableConfig>,
};

export const UserConfigSchema = z.object({
  defaultSort: z.string().default(DEFAULT_USER_CONFIG.defaultSort),
  perPage: z.number().int().min(10).max(200).default(DEFAULT_USER_CONFIG.perPage),
  tables: z.record(z.string(), TableConfigSchema).default({}),
});

export type UserConfig = z.infer<typeof UserConfigSchema>;

export interface TableDefaults {
  tableId: string;
  defaultSort: string;
  columnOrder: string[];
}
