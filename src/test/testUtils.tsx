import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: {
    queryClient?: QueryClient;
    suspenseFallback?: React.ReactNode;
  },
) {
  const queryClient = options?.queryClient ?? createTestQueryClient();

  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={options?.suspenseFallback ?? <div>Loading...</div>}>
          {ui}
        </Suspense>
      </QueryClientProvider>,
    ),
  };
}

export function createQueryClientWrapper(queryClient = createTestQueryClient()) {
  return function QueryClientWrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </QueryClientProvider>
    );
  };
}
