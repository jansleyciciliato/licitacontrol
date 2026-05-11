const CONFIG: Record<string, string> = {
  "PREGÃO ELETRÔNICO":    "bg-[#1E40AF]",
  "PREGÃO PRESENCIAL":    "bg-[#0F766E]",
  "DISPENSA DE LICITAÇÃO": "bg-[#9D174D]",
  "CREDENCIAMENTO":       "bg-[#65A30D]",
};

const FALLBACK = "bg-muted-foreground";

export function BadgeModalidade({ modalidade }: { modalidade: string | null }) {
  if (!modalidade) return <span className="text-xs text-muted-foreground">—</span>;

  const bg = CONFIG[modalidade] ?? FALLBACK;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white ${bg}`}>
      {modalidade}
    </span>
  );
}
