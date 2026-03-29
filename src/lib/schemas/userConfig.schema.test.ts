import { describe, expect, it } from "vitest";
import { DEFAULT_USER_CONFIG, UserConfigSchema } from "./userConfig.schema";

describe("UserConfigSchema", () => {
  it("applies defaults", () => {
    expect(UserConfigSchema.parse({})).toEqual(DEFAULT_USER_CONFIG);
  });

  it("rejects invalid page size", () => {
    expect(() => UserConfigSchema.parse({ perPage: 1 })).toThrow();
  });
});
