import { describe, expect, it, vi } from "vitest";
import { ApiError, request } from "./client";

describe("request", () => {
  it("returns json for successful responses", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok: true,
      json: async () => ({ ok: true }),
    })));

    await expect(request("/orders")).resolves.toEqual({ ok: true });
  });

  it("throws ApiError for failed responses", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok: false,
      status: 500,
      text: async () => "boom",
    })));

    await expect(request("/orders")).rejects.toEqual(new ApiError(500, "boom"));
  });
});
