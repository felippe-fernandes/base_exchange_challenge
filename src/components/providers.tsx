"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect } from "react";
import { getQueryClient } from "@/lib/queryClient";
import { useUserConfigHydrated, useUserConfigStore } from "@/stores/userConfigStore";

function UserThemeSync() {
  const hydrated = useUserConfigHydrated();
  const theme = useUserConfigStore((state) => state.theme);
  const { setTheme, theme: activeTheme } = useTheme();

  useEffect(() => {
    if (!hydrated || activeTheme === theme) return;
    setTheme(theme);
  }, [activeTheme, hydrated, theme]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <UserThemeSync />
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
