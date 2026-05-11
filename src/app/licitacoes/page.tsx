import { createServerClient } from "@/lib/supabase-server";
import { AppShell } from "@/components/app-shell";
import { FiltrosStatus } from "@/components/licitacoes/filtros-status";
import { TabelaLicitacoes } from "@/components/licitacoes/tabela-licitacoes";
import type { StatusLicitacao } from "@/types/database";

const STATUS_VALIDOS: StatusLicitacao[] = ["ANALISAR", "PARTICIPAR", "MONITORAR", "DESCARTADA", "VENCEDOR", "PERDIDA", "SUSPENSA"];

interface PageProps {
  searchParams: { status?: string };
}

export default async function LicitacoesPage({ searchParams }: PageProps) {
  const statusParam = searchParams.status?.toUpperCase();
  const statusAtivo = STATUS_VALIDOS.includes(statusParam as StatusLicitacao) ? statusParam! : "TODAS";

  const supabase = createServerClient();
  let query = supabase.from("licitacoes").select("*").order("data_cadastro", { ascending: false });

  if (statusAtivo !== "TODAS") {
    query = query.eq("status", statusAtivo as StatusLicitacao);
  }

  const { data: licitacoes, error } = await query;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-foreground">Licitações</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {licitacoes?.length ?? 0} {statusAtivo === "TODAS" ? "registros" : `em ${statusAtivo.toLowerCase()}`}
          </p>
        </div>

        <div className="mb-6">
          <FiltrosStatus statusAtivo={statusAtivo} />
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-destructive">Erro ao carregar licitações: {error.message}</p>
          </div>
        ) : (
          <TabelaLicitacoes licitacoes={licitacoes ?? []} />
        )}
      </div>
    </AppShell>
  );
}
