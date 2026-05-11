import Link from "next/link";
import type { StatusLicitacao } from "@/types/database";

const FILTROS: { label: string; valor: StatusLicitacao | "TODAS" }[] = [
  { label: "Todas", valor: "TODAS" },
  { label: "Analisar", valor: "ANALISAR" },
  { label: "Participar", valor: "PARTICIPAR" },
  { label: "Monitorar", valor: "MONITORAR" },
  { label: "Vencedor", valor: "VENCEDOR" },
  { label: "Perdida", valor: "PERDIDA" },
  { label: "Suspensa", valor: "SUSPENSA" },
  { label: "Descartada", valor: "DESCARTADA" },
];

interface FiltrosStatusProps {
  statusAtivo: string;
  busca?: string;
}

export function FiltrosStatus({ statusAtivo, busca }: FiltrosStatusProps) {
  const buildHref = (valor: StatusLicitacao | "TODAS") => {
    const params = new URLSearchParams();
    if (valor !== "TODAS") params.set("status", valor);
    if (busca) params.set("busca", busca);
    const qs = params.toString();
    return qs ? `/licitacoes?${qs}` : "/licitacoes";
  };

  return (
    <div className="flex flex-wrap gap-2">
      {FILTROS.map(({ label, valor }) => {
        const ativo = valor === "TODAS" ? statusAtivo === "TODAS" : statusAtivo === valor;
        return (
          <Link
            key={valor}
            href={buildHref(valor)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              ativo
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
