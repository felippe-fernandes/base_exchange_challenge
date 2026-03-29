import "@testing-library/jest-dom/vitest";
import React from "react";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: React.forwardRef(function Link(
    props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
    ref: React.ForwardedRef<HTMLAnchorElement>,
  ) {
    return React.createElement("a", { ...props, ref }, props.children);
  }),
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock);
vi.stubGlobal("IntersectionObserver", class {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
});

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

if (!globalThis.crypto?.randomUUID) {
  vi.stubGlobal("crypto", {
    randomUUID: vi.fn(() => "00000000-0000-4000-8000-000000000000"),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
