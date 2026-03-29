import { vi } from "vitest";

let pathname = "/orders";
let search = "";
export const pushMock = vi.fn();

export function setNavigationState(next: {
  pathname?: string;
  search?: string;
}) {
  if (next.pathname !== undefined) pathname = next.pathname;
  if (next.search !== undefined) search = next.search;
}

export function resetNavigationState() {
  pathname = "/orders";
  search = "";
  pushMock.mockReset();
}

export function getSearchParams() {
  return new URLSearchParams(search);
}

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => pathname,
  useSearchParams: () => getSearchParams(),
  redirect: vi.fn((target: string) => {
    throw new Error(`NEXT_REDIRECT:${target}`);
  }),
}));
