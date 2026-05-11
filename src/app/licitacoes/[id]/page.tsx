export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { AppShell } from "@/components/app-shell";
import { SeletorStatus } from "@/components/detalhe/seletor-status";
import { BotaoVoltar } from "@/components/detalhe/botao-voltar";
import { BotaoExcluir } from "@/components/detalhe/botao-excluir";
import { CampoOrgao } from "@/components/detalhe/campo-orgao";
import { TabsNav } from "@/components/detalhe/tabs-nav";
import { AbaDadosGerais } from "@/components/detalhe/aba-dados-gerais";
import { AbaDocumentos } from "@/components/detalhe/aba-documentos";
import { AbaItens } from "@/components/detalhe/aba-itens";
import type { Licitacao } from "@/types/database";

interface PageProps {
  params: { id: string };
  searchParams: { aba?: string };
}

const ABAS_VALIDAS = ["dados", "documentos", "itens"];

export default async function DetalheLicitacaoPage({ params, searchParams }: PageProps) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("licitacoes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) notFound();

  const licitacao = data as Licitacao;
  const abaAtiva = ABAS_VALIDAS.includes(searchParams.aba ?? "") ? searchParams.aba! : "dados";

  const documentos = Array.isArray(licitacao.documentos_habilitacao)
    ? (licitacao.documentos_habilitacao as string[])
    : null;

  const itens = Array.isArray(licitacao.itens)
    ? (licitacao.itens as Array<{ lote: number | null; item: number | null; descricao: string; unidade: string | null; quantidade: number | null; valor_item: number | null }>)
    : null;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8">

        <BotaoVoltar />

        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CampoOrgao licitacaoId={params.id} valorInicial={licitacao.orgao} />
              {licitacao.numero_edital && (
                <p className="text-sm text-muted-foreground mt-1">Edital {licitacao.numero_edital}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <BotaoExcluir licitacaoId={params.id} />
              <SeletorStatus licitacaoId={params.id} statusInicial={licitacao.status} />
            </div>
          </div>

          {licitacao.objeto && (
            <div className="mt-4 rounded-lg border border-border bg-card px-4 py-3 flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Objeto</p>
              <div className="rounded-md bg-muted/50 px-3 py-2 text-sm text-foreground leading-relaxed">
                {licitacao.objeto}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <TabsNav id={params.id} abaAtiva={abaAtiva} />

          <div className="p-6">
            {abaAtiva === "dados" && <AbaDadosGerais licitacao={licitacao} />}
            {abaAtiva === "documentos" && <AbaDocumentos documentos={documentos} />}
            {abaAtiva === "itens" && <AbaItens itens={itens} />}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
