import { INSTRUMENTS } from "./instruments";

describe("INSTRUMENTS", () => {
  it("exposes a non-empty catalog", () => {
    expect(INSTRUMENTS.length).toBeGreaterThan(100);
    expect(INSTRUMENTS[0]).toMatchObject({
      symbol: expect.any(String),
      minPrice: expect.any(Number),
      maxPrice: expect.any(Number),
    });
  });
});
