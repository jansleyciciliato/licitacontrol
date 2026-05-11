export const dynamic = "force-dynamic";

import { createServerClient } from "@/lib/supabase-server";
import { AppShell } from "@/components/app-shell";
import { FiltrosStatus } from "@/components/licitacoes/filtros-status";
import { BuscaLicitacoes } from "@/components/licitacoes/busca-licitacoes";
import { TabelaLicitacoes } from "@/components/licitacoes/tabela-licitacoes";
import type { StatusLicitacao } from "@/types/database";

const STATUS_VALIDOS: StatusLicitacao[] = ["ANALISAR", "PARTICIPAR", "MONITORAR", "DESCARTADA", "VENCEDOR", "PERDIDA", "SUSPENSA"];

interface PageProps {
  searchParams: { status?: string; busca?: string };
}

export default async function LicitacoesPage({ searchParams }: PageProps) {
  const statusParam = searchParams.status?.toUpperCase();
  const statusAtivo = STATUS_VALIDOS.includes(statusParam as StatusLicitacao) ? statusParam! : "TODAS";
  const buscaAtiva = searchParams.busca?.trim() ?? "";

  const supabase = createServerClient();
  let query = supabase.from("licitacoes").select("*").order("data_cadastro", { ascending: false });

  if (statusAtivo !== "TODAS") {
    query = query.eq("status", statusAtivo as StatusLicitacao);
  }

  if (buscaAtiva) {
    query = query.or(
      `orgao.ilike.%${buscaAtiva}%,numero_edital.ilike.%${buscaAtiva}%,objeto.ilike.%${buscaAtiva}%`
    );
  }

  const { data: licitacoes, error } = await query;

  const total = licitacoes?.length ?? 0;
  const subtitulo = buscaAtiva
    ? `${total} resultado${total !== 1 ? "s" : ""} para "${buscaAtiva}"`
    : `${total} ${statusAtivo === "TODAS" ? "registros" : `em ${statusAtivo.toLowerCase()}`}`;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-foreground">Licitações</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitulo}</p>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <FiltrosStatus statusAtivo={statusAtivo} busca={buscaAtiva} />
          <BuscaLicitacoes valorInicial={buscaAtiva} />
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
