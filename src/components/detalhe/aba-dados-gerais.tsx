"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CampoTexto, CampoSelect, CampoToggle } from "./campo-form";
import type { Licitacao } from "@/types/database";

const OPCOES_MODALIDADE = [
  "PREGÃO ELETRÔNICO", "PREGÃO PRESENCIAL", "DISPENSA DE LICITAÇÃO", "CREDENCIAMENTO",
].map((v) => ({ value: v, label: v }));

const OPCOES_TIPO_DISPUTA = [
  "GLOBAL", "POR LOTE", "POR ITEM",
].map((v) => ({ value: v, label: v }));

const OPCOES_MODO_DISPUTA = [
  "ABERTO", "ABERTO E FECHADO", "FECHADO E ABERTO", "FECHADO",
].map((v) => ({ value: v, label: v }));

const OPCOES_REGIONALIDADE = [
  "NÃO", "SIM - PREFERÊNCIA REGIONAL", "SIM - PREFERÊNCIA LOCAL",
  "SIM - EXCLUSIVO REGIONAL", "SIM - EXCLUSIVO LOCAL",
].map((v) => ({ value: v, label: v }));

type FormState = Omit<Licitacao, "id" | "data_cadastro" | "documentos_habilitacao" | "itens" | "status" | "orgao" | "objeto">;

function toStr(v: string | null | undefined) {
  return v ?? "";
}

export function AbaDadosGerais({ licitacao }: { licitacao: Licitacao }) {
  const [form, setForm] = useState<FormState>({
    numero_edital:      licitacao.numero_edital,
    numero_processo:    licitacao.numero_processo,
    modalidade:         licitacao.modalidade,
    tipo_disputa:       licitacao.tipo_disputa,
    modo_disputa:       licitacao.modo_disputa,
    registro_preco:     licitacao.registro_preco,
    data_abertura:      licitacao.data_abertura,
    data_hora_abertura: licitacao.data_hora_abertura,
    plataforma:         licitacao.plataforma,
    regionalidade:      licitacao.regionalidade,
    distancia_km:       licitacao.distancia_km,
    data_evento:        licitacao.data_evento,
  });

  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const set = (key: keyof FormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value || null }));

  const salvar = async () => {
    setSalvando(true);
    try {
      const res = await fetch(`/api/licitacoes/${licitacao.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(json?.error ?? "Erro ao salvar as alterações.");
        return;
      }
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2500);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro inesperado ao salvar.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <CampoTexto
          label="Número do Edital"
          value={toStr(form.numero_edital)}
          onChange={(v) => set("numero_edital", v)}
        />

        <CampoTexto
          label="Número do Processo"
          value={toStr(form.numero_processo)}
          onChange={(v) => set("numero_processo", v)}
        />

        <CampoSelect
          label="Modalidade"
          value={toStr(form.modalidade)}
          onChange={(v) => set("modalidade", v)}
          opcoes={OPCOES_MODALIDADE}
          placeholder="Selecione..."
        />

        <CampoSelect
          label="Tipo de Disputa"
          value={toStr(form.tipo_disputa)}
          onChange={(v) => set("tipo_disputa", v)}
          opcoes={OPCOES_TIPO_DISPUTA}
          placeholder="Selecione..."
        />

        <CampoTexto
          label="Data de Abertura"
          value={toStr(form.data_abertura)}
          onChange={(v) => set("data_abertura", v)}
          type="date"
        />

        <CampoTexto
          label="Data e Hora da Sessão"
          value={toStr(form.data_hora_abertura)}
          onChange={(v) => set("data_hora_abertura", v)}
          type="datetime-local"
        />

        <CampoSelect
          label="Modo de Disputa"
          value={toStr(form.modo_disputa)}
          onChange={(v) => set("modo_disputa", v)}
          opcoes={OPCOES_MODO_DISPUTA}
          placeholder="Selecione..."
        />

        <CampoTexto
          label="Plataforma"
          value={toStr(form.plataforma)}
          onChange={(v) => set("plataforma", v)}
        />

        <CampoSelect
          label="Regionalidade"
          value={toStr(form.regionalidade)}
          onChange={(v) => set("regionalidade", v)}
          opcoes={OPCOES_REGIONALIDADE}
          placeholder="Selecione..."
        />

        <CampoTexto
          label="Distância (km)"
          value={form.distancia_km != null ? String(form.distancia_km) : ""}
          onChange={(v) => set("distancia_km", v ? Number(v) : null)}
          type="number"
        />

        <CampoTexto
          label="Data do Evento"
          value={toStr(form.data_evento)}
          onChange={(v) => set("data_evento", v)}
        />

        <CampoToggle
          label="Registro de Preço (SRP)"
          value={!!form.registro_preco}
          onChange={(v) => set("registro_preco", v)}
        />

      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button onClick={salvar} disabled={salvando}>
          {salvando ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
          ) : salvo ? (
            <><Check className="mr-2 h-4 w-4" />Salvo!</>
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </div>
    </div>
  );
}
