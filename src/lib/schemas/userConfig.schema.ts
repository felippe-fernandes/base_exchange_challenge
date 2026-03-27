import { z } from "zod/v4";

export const DEFAULT_USER_CONFIG = {
  defaultSort: "",
  perPage: 50,
  columnOrder: [] as string[],
  columnSizing: {} as Record<string, number>,
};

export const UserConfigSchema = z.object({
  defaultSort: z.string().default(DEFAULT_USER_CONFIG.defaultSort),
  perPage: z.number().int().min(10).max(200).default(DEFAULT_USER_CONFIG.perPage),
  columnOrder: z.array(z.string()).default(DEFAULT_USER_CONFIG.columnOrder),
  columnSizing: z.record(z.string(), z.number()).default(DEFAULT_USER_CONFIG.columnSizing),
});

export type UserConfig = z.infer<typeof UserConfigSchema>;

export interface TableDefaults {
  defaultSort: string;
  columnOrder: string[];
}