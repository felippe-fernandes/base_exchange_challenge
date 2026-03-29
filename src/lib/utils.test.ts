import { describe, expect, it, vi } from "vitest";
import { cn, copyToClipboard } from "./utils";

describe("utils", () => {
  it("merges class names", () => {
    expect(cn("a", undefined, "b")).toContain("a");
  });

  it("copies to clipboard when available", async () => {
    expect(await copyToClipboard("abc")).toBe(true);
  });

  it("returns false when clipboard fails", async () => {
    vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error("fail"));
    await expect(copyToClipboard("abc")).resolves.toBe(false);
  });
});
