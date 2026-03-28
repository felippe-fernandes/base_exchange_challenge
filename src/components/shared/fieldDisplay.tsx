interface FieldDisplayProps {
  label: string;
  children: React.ReactNode;
}

export function FieldDisplay({ label, children }: FieldDisplayProps) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-0.5 text-sm">{children}</dd>
    </div>
  );
}
