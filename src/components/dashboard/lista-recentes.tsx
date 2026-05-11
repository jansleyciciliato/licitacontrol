import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BadgeStatus } from "@/components/licitacoes/badge-status";
import type { Licitacao } from "@/types/database";

function formatarData(data: string | null) {
  if (!data) return "—";
  const [year, month, day] = data.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

export function ListaRecentes({ licitacoes }: { licitacoes: Licitacao[] }) {
  if (licitacoes.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-muted-foreground">
        Nenhuma licitação em Analisar ou Participar.
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {licitacoes.map((lic) => (
        <Link
          key={lic.id}
          href={`/licitacoes/${lic.id}`}
          className="flex items-center gap-3 py-2 px-1 rounded-lg hover:bg-muted/20 transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{lic.orgao ?? "Órgão não informado"}</p>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">{lic.objeto ?? "Sem descrição"}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-muted-foreground hidden sm:block tabular-nums">
              {formatarData(lic.data_abertura)}
            </span>
            <BadgeStatus status={lic.status} />
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </Link>
      ))}
    </div>
  );
}
