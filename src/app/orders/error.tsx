"use client";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function OrdersError({ error, reset }: ErrorProps) {
  return (
    <PageContainer title="Orders">
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        <p className="text-destructive">{error.message}</p>
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
      </div>
    </PageContainer>
  );
}