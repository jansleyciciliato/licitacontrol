import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { AppShell } from "@/components/app-shell";
import { BadgeStatus } from "@/components/licitacoes/badge-status";
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

        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="font-heading text-xl font-bold text-foreground truncate">
                {licitacao.orgao ?? "Órgão não informado"}
              </h1>
              {licitacao.numero_edital && (
                <p className="text-sm text-muted-foreground mt-1">Edital {licitacao.numero_edital}</p>
              )}
            </div>
            <BadgeStatus status={licitacao.status} />
          </div>

          {licitacao.objeto && (
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{licitacao.objeto}</p>
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
