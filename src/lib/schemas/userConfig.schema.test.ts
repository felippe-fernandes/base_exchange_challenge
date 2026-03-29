import { describe, expect, it } from "vitest";
import { DEFAULT_USER_CONFIG, UserConfigSchema } from "./userConfig.schema";

describe("UserConfigSchema", () => {
  it("applies defaults", () => {
    expect(UserConfigSchema.parse({})).toEqual(DEFAULT_USER_CONFIG);
  });

  it("keeps backward compatibility with older persisted config shapes", () => {
    expect(
      UserConfigSchema.parse({
        defaultSort: "-createdAt",
        perPage: 25,
        tables: {},
      }),
    ).toMatchObject({
      ...DEFAULT_USER_CONFIG,
      defaultSort: "-createdAt",
      perPage: 25,
    });
  });

  it("rejects invalid page size", () => {
    expect(() => UserConfigSchema.parse({ perPage: 1 })).toThrow();
  });
});
