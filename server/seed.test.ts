import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { DEFAULT_ORDER_COUNT, resolveOrderCount } = require("./seed.js");

describe("seed script", () => {
  it("uses the official default count when no valid input is provided", () => {
    expect(resolveOrderCount(["node", "server/seed.js"], "")).toBe(DEFAULT_ORDER_COUNT);
  });

  it("uses the cli argument when provided", () => {
    expect(resolveOrderCount(["node", "server/seed.js", "10000"], "")).toBe(10000);
  });

  it("falls back to the lifecycle suffix when present", () => {
    expect(resolveOrderCount(["node", "server/seed.js"], "seed:5000")).toBe(5000);
  });
});
