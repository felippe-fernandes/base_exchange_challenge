import { createRequire } from "module";

const require = createRequire(import.meta.url);
const seedUtils = require("./seed-utils.cjs");

describe("seed utils", () => {
  it("computes currency from instrument symbols", () => {
    expect(seedUtils.getCcy("BTCUSD")).toBe("USD");
    expect(seedUtils.getCcy("PETR4")).toBe("BRL");
    expect(seedUtils.getCcy("AAPL")).toBe("USD");
  });

  it("generates random primitives within range", () => {
    expect(seedUtils.randomFloat(1, 2)).toBeGreaterThanOrEqual(1);
    expect(seedUtils.randomFloat(1, 2)).toBeLessThanOrEqual(2);
    expect(seedUtils.randomInt(1, 2)).toBeGreaterThanOrEqual(1);
    expect(seedUtils.randomInt(1, 2)).toBeLessThanOrEqual(2);
    expect(["a", "b"]).toContain(seedUtils.randomElement(["a", "b"]));
    expect(seedUtils.randomDate()).toBeInstanceOf(Date);
  });

  it("generates seeded order structures", () => {
    const result = seedUtils.generateOrders(5);
    expect(result.orders).toHaveLength(5);
    expect(result.statusHistory.length).toBeGreaterThanOrEqual(5);
    expect(result.orders[0]).toMatchObject({
      id: expect.any(String),
      instrument: expect.any(String),
      price: {
        value: expect.any(Number),
        ccy: expect.any(String),
      },
    });
  });

  it("writes a seeded database file", () => {
    const writeSpy = vi.spyOn(require("fs"), "writeFileSync").mockImplementation(() => {});
    const result = seedUtils.writeSeedFile(3, "custom-db.json");

    expect(result.counts.orders).toBe(3);
    expect(result.outputPath).toBe("custom-db.json");
    expect(writeSpy).toHaveBeenCalled();

    writeSpy.mockRestore();
  });
});
