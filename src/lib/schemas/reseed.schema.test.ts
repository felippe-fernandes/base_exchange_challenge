import { describe, expect, it } from "vitest";
import { MAX_RESEED_COUNT, MIN_RESEED_COUNT, ReseedSchema } from "./reseed.schema";

describe("ReseedSchema", () => {
  it("accepts values within the allowed range", () => {
    expect(ReseedSchema.parse({ count: MIN_RESEED_COUNT })).toEqual({
      count: MIN_RESEED_COUNT,
    });
    expect(ReseedSchema.parse({ count: MAX_RESEED_COUNT })).toEqual({
      count: MAX_RESEED_COUNT,
    });
  });

  it("rejects values below the minimum", () => {
    expect(() => ReseedSchema.parse({ count: MIN_RESEED_COUNT - 1 })).toThrow(
      `Count must be at least ${MIN_RESEED_COUNT}`,
    );
  });

  it("rejects values above the maximum", () => {
    expect(() => ReseedSchema.parse({ count: MAX_RESEED_COUNT + 1 })).toThrow(
      `Count must be at most ${MAX_RESEED_COUNT}`,
    );
  });
});
