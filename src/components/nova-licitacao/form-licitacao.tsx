"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Licitacao } from "@/types/database";

type DadosExtraidos = Omit<Licitacao, "id" | "status" | "data_cadastro" | "data_evento" | "distancia_km">;

interface FormLicitacaoProps {
  dadosIniciais: DadosExtraidos;
}

const OPCOES_MODALIDADE = ["PREGÃO ELETRÔNICO", "PREGÃO PRESENCIAL", "DISPENSA DE LICITAÇÃO", "CREDENCIAMENTO"];
const OPCOES_TIPO_DISPUTA = ["GLOBAL", "POR LOTE", "POR ITEM"];
const OPCOES_MODO_DISPUTA = ["ABERTO", "ABERTO E FECHADO", "FECHADO E ABERTO", "FECHADO"];
const OPCOES_REGIONALIDADE = [
  "NÃO", "SIM - PREFERÊNCIA REGIONAL", "SIM - PREFERÊNCIA LOCAL",
  "SIM - EXCLUSIVO REGIONAL", "SIM - EXCLUSIVO LOCAL",
];

const inputBase =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors";

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, multiline, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; type?: string;
}) {
  return (
    <Campo label={label}>
      {multiline ? (
        <textarea className={`${inputBase} min-h-[80px] resize-y`} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type={type} className={inputBase} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </Campo>
  );
}

function SelectField({ label, value, onChange, opcoes }: {
  label: string; value: string; onChange: (v: string) => void; opcoes: string[];
}) {
  return (
    <Campo label={label}>
      <select className={inputBase} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Selecione...</option>
        {opcoes.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </Campo>
  );
}

export function FormLicitacao({ dadosIniciais }: FormLicitacaoProps) {
  const router = useRouter();
  const [dados, setDados] = useState<DadosExtraidos>(dadosIniciais);
  const [salvando, setSalvando] = useState(false);

  const set = (key: keyof DadosExtraidos, value: unknown) =>
    setDados((prev) => ({ ...prev, [key]: value || null }));

  const salvar = async () => {
    setSalvando(true);
    try {
      const res = await fetch("/api/licitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dados, status: "ANALISAR" }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Erro ao salvar.");
      }

      const licitacao = await res.json();
      router.push(`/licitacoes/${licitacao.id}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao salvar.");
      setSalvando(false);
    }
  };

  type ItemLicitacao = { lote: number | null; item: number | null; descricao: string; unidade: string | null; quantidade: number | null; valor_item: number | null };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <SelectField label="Modalidade" value={(dados.modalidade as string) ?? ""} onChange={(v) => set("modalidade", v)} opcoes={OPCOES_MODALIDADE} />
        <SelectField label="Tipo de Disputa" value={(dados.tipo_disputa as string) ?? ""} onChange={(v) => set("tipo_disputa", v)} opcoes={OPCOES_TIPO_DISPUTA} />
        <SelectField label="Modo de Disputa" value={(dados.modo_disputa as string) ?? ""} onChange={(v) => set("modo_disputa", v)} opcoes={OPCOES_MODO_DISPUTA} />
        <SelectField label="Regionalidade" value={(dados.regionalidade as string) ?? ""} onChange={(v) => set("regionalidade", v)} opcoes={OPCOES_REGIONALIDADE} />

        <InputField label="Número do Edital" value={(dados.numero_edital as string) ?? ""} onChange={(v) => set("numero_edital", v)} />
        <InputField label="Número do Processo" value={(dados.numero_processo as string) ?? ""} onChange={(v) => set("numero_processo", v)} />
        <InputField label="Órgão" value={(dados.orgao as string) ?? ""} onChange={(v) => set("orgao", v)} />
        <InputField label="Plataforma" value={(dados.plataforma as string) ?? ""} onChange={(v) => set("plataforma", v)} />
        <InputField label="Data de Abertura" value={(dados.data_abertura as string) ?? ""} onChange={(v) => set("data_abertura", v)} type="date" />
        <InputField label="Data e Hora da Sessão" value={(dados.data_hora_abertura as string) ?? ""} onChange={(v) => set("data_hora_abertura", v)} type="datetime-local" />

        <div className="sm:col-span-2">
          <InputField label="Objeto" value={(dados.objeto as string) ?? ""} onChange={(v) => set("objeto", v)} multiline />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="registro_preco"
            checked={!!dados.registro_preco}
            onChange={(e) => set("registro_preco", e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          <label htmlFor="registro_preco" className="text-sm text-foreground">
            Registro de Preço (SRP)
          </label>
        </div>
      </div>

      {dados.itens && Array.isArray(dados.itens) && (dados.itens as ItemLicitacao[]).length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Itens ({(dados.itens as ItemLicitacao[]).length})
          </p>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground w-16">Lote</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground w-16">Item</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Descrição</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground w-24">Qtd</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground w-20">Un.</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground w-32">Valor Unit.</th>
                </tr>
              </thead>
              <tbody>
                {(dados.itens as ItemLicitacao[]).map((item, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-2 text-muted-foreground">{item.lote ?? "—"}</td>
                    <td className="px-4 py-2 text-muted-foreground">{item.item ?? "—"}</td>
                    <td className="px-4 py-2 text-foreground">{item.descricao}</td>
                    <td className="px-4 py-2 text-right text-foreground">{item.quantidade ?? "—"}</td>
                    <td className="px-4 py-2 text-foreground">{item.unidade ?? "—"}</td>
                    <td className="px-4 py-2 text-right text-foreground">
                      {item.valor_item != null
                        ? item.valor_item.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-end pt-2 border-t border-border">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={salvando}>
          Cancelar
        </Button>
        <Button type="button" onClick={salvar} disabled={salvando}>
          {salvando ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
          ) : (
            "Salvar Licitação"
          )}
        </Button>
      </div>
    </div>
  );
}
