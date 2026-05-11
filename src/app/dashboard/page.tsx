import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { AppShell } from "@/components/app-shell";
import { CardResumo } from "@/components/dashboard/card-resumo";
import { GraficoStatus } from "@/components/dashboard/grafico-status";
import { GraficoAbertura } from "@/components/dashboard/grafico-abertura";
import { ListaRecentes } from "@/components/dashboard/lista-recentes";
import type { Licitacao, StatusLicitacao } from "@/types/database";

const STATUS_CONFIG: { status: StatusLicitacao; label: string; cor: string }[] = [
  { status: "ANALISAR",   label: "Analisar",   cor: "#EAB308" },
  { status: "PARTICIPAR", label: "Participar", cor: "#7B61FF" },
  { status: "MONITORAR",  label: "Monitorar",  cor: "#0EA5E9" },
  { status: "VENCEDOR",   label: "Vencedor",   cor: "#16A34A" },
  { status: "PERDIDA",    label: "Perdida",    cor: "#DC2626" },
  { status: "SUSPENSA",   label: "Suspensa",   cor: "#F97316" },
  { status: "DESCARTADA", label: "Descartada", cor: "#5A5A72" },
];

function formatarDataCurta(data: string) {
  const [, month, day] = data.split("-");
  return `${day}/${month}`;
}

export default async function DashboardPage() {
  const supabase = createServerClient();

  const { data: licitacoes } = await supabase
    .from("licitacoes")
    .select("*")
    .order("data_cadastro", { ascending: false });

  const todas = (licitacoes ?? []) as Licitacao[];
  const recentes = todas
    .filter((l) => l.status === "ANALISAR" || l.status === "PARTICIPAR")
    .sort((a, b) => {
      const da = a.data_hora_abertura ?? a.data_abertura ?? "";
      const db = b.data_hora_abertura ?? b.data_abertura ?? "";
      return da.localeCompare(db);
    })
    .slice(0, 5);

  const contagem = (status: StatusLicitacao) =>
    todas.filter((l) => l.status === status).length;

  const total = todas.length;

  const dadosGrafico = STATUS_CONFIG.map(({ status, label, cor }) => ({
    status: label,
    total: contagem(status),
    cor,
  }));

  const porData = new Map<string, { ANALISAR: number; PARTICIPAR: number }>();
  for (const l of todas) {
    if (l.status !== "ANALISAR" && l.status !== "PARTICIPAR") continue;
    const key = l.data_abertura ?? "Sem data";
    if (!porData.has(key)) porData.set(key, { ANALISAR: 0, PARTICIPAR: 0 });
    porData.get(key)![l.status]++;
  }
  const dadosAbertura = Array.from(porData.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([data, counts]) => ({
      data: data !== "Sem data" ? formatarDataCurta(data) : "Sem data",
      ANALISAR: counts.ANALISAR,
      PARTICIPAR: counts.PARTICIPAR,
    }));

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8">

        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral do pipeline de licitações</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mb-8">
          <CardResumo label="Total" valor={total} />
          {STATUS_CONFIG.slice(0, 3).map(({ status, label, cor }) => (
            <CardResumo key={status} label={label} valor={contagem(status)} cor={cor} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-4">
            <h2 className="font-heading text-sm font-semibold text-foreground mb-3">Por status</h2>
            <GraficoStatus dados={dadosGrafico} />
            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {STATUS_CONFIG.map(({ status, label, cor }) => (
                <div key={status} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: cor }} />
                  <span className="text-[11px] text-muted-foreground">{label}</span>
                  <span className="ml-auto text-[11px] font-medium text-foreground">{contagem(status)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading text-sm font-semibold text-foreground">Próximas</h2>
              <Link href="/licitacoes" className="text-xs text-primary hover:underline">
                Ver todas
              </Link>
            </div>
            <ListaRecentes licitacoes={recentes} />
          </div>

        </div>

        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-heading text-sm font-semibold text-foreground">Licitações por data de abertura</h2>
            <span className="text-xs text-muted-foreground">Analisar + Participar</span>
          </div>
          <GraficoAbertura dados={dadosAbertura} />
        </div>

      </div>
    </AppShell>
  );
}
