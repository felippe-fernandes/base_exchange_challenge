import { z } from "zod/v4";

export const MIN_RESEED_COUNT = 1200;
export const MAX_RESEED_COUNT = 100000;

export const ReseedSchema = z.object({
  count: z
    .number({ error: "Count is required" })
    .int({ error: "Count must be a whole number" })
    .min(MIN_RESEED_COUNT, {
      error: `Count must be at least ${MIN_RESEED_COUNT}`,
    })
    .max(MAX_RESEED_COUNT, {
      error: `Count must be at most ${MAX_RESEED_COUNT}`,
    }),
});

export type ReseedInput = z.infer<typeof ReseedSchema>;
