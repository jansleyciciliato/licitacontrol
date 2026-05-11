interface CardResumoProps {
  label: string;
  valor: number;
  cor?: string;
}

export function CardResumo({ label, valor, cor }: CardResumoProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {cor && <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cor }} />}
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <span className="font-heading text-3xl font-bold text-foreground">{valor}</span>
    </div>
  );
}
