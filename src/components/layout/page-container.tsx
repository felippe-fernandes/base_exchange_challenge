interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="container mx-auto flex-1 px-4 py-6">
      {children}
    </main>
  );
}
