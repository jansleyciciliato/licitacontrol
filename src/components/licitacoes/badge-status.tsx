import type { StatusLicitacao } from "@/types/database";

const CONFIG: Record<StatusLicitacao, { label: string; dot: string; bg: string; border: string; text: string }> = {
  ANALISAR:   { label: "Analisar",   dot: "bg-[#EAB308]", bg: "bg-[#EAB308]/10", border: "border-[#EAB308]/30", text: "text-[#CA8A04]" },
  PARTICIPAR: { label: "Participar", dot: "bg-[#7B61FF]", bg: "bg-[#7B61FF]/10", border: "border-[#7B61FF]/30", text: "text-[#7B61FF]" },
  MONITORAR:  { label: "Monitorar",  dot: "bg-[#0EA5E9]", bg: "bg-[#0EA5E9]/10", border: "border-[#0EA5E9]/30", text: "text-[#0EA5E9]" },
  DESCARTADA: { label: "Descartada", dot: "bg-[#5A5A72]", bg: "bg-[#5A5A72]/10", border: "border-[#5A5A72]/30", text: "text-[#5A5A72]" },
  VENCEDOR:   { label: "Vencedor",   dot: "bg-[#16A34A]", bg: "bg-[#16A34A]/10", border: "border-[#16A34A]/30", text: "text-[#16A34A]" },
  PERDIDA:    { label: "Perdida",    dot: "bg-[#DC2626]", bg: "bg-[#DC2626]/10", border: "border-[#DC2626]/30", text: "text-[#DC2626]" },
  SUSPENSA:   { label: "Suspensa",   dot: "bg-[#F97316]", bg: "bg-[#F97316]/10", border: "border-[#F97316]/30", text: "text-[#F97316]" },
};

export function BadgeStatus({ status }: { status: StatusLicitacao }) {
  const c = CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${c.bg} ${c.border} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
