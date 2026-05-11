"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { UploadArquivo } from "@/components/nova-licitacao/upload-arquivo";
import { FormLicitacao } from "@/components/nova-licitacao/form-licitacao";
import { MODELOS, MODELO_PADRAO } from "@/lib/modelos";

type Etapa = "upload" | "analisando" | "revisao";

export default function NovaLicitacaoPage() {
  const [etapa, setEtapa] = useState<Etapa>("upload");
  const [modeloSelecionado, setModeloSelecionado] = useState(MODELO_PADRAO);
  const [dadosExtraidos, setDadosExtraidos] = useState<Record<string, unknown> | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const analisar = async (file: File) => {
    setEtapa("analisando");
    setErro(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", modeloSelecionado);

      const res = await fetch("/api/licitacoes/analisar", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erro ao analisar.");

      setDadosExtraidos(json.dados);
      setEtapa("revisao");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao analisar.");
      setEtapa("upload");
    }
  };

  const modeloAtual = MODELOS.find((m) => m.id === modeloSelecionado);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-foreground">Nova Licitação</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Faça upload do edital para extração automática via IA
          </p>
        </div>

        {etapa === "upload" && (
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-3">
                Modelo de IA
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {MODELOS.map((modelo) => (
                  <button
                    key={modelo.id}
                    type="button"
                    onClick={() => setModeloSelecionado(modelo.id)}
                    className={`flex flex-col items-start rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      modeloSelecionado === modelo.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30 hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <span className="text-sm font-medium">{modelo.nome}</span>
                    <span className="text-xs text-muted-foreground capitalize mt-0.5">
                      {modelo.provedor}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <UploadArquivo onArquivoSelecionado={analisar} />

            {erro && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                <p className="text-sm text-destructive">{erro}</p>
              </div>
            )}
          </div>
        )}

        {etapa === "analisando" && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Analisando o edital...</p>
              <p className="text-sm text-muted-foreground mt-1">
                {modeloAtual?.nome} está extraindo as informações
              </p>
            </div>
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin mt-2" />
          </div>
        )}

        {etapa === "revisao" && dadosExtraidos && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <p className="text-sm text-primary">
                Dados extraídos por {modeloAtual?.nome} — revise antes de salvar
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <FormLicitacao
                dadosIniciais={dadosExtraidos as Parameters<typeof FormLicitacao>[0]["dadosIniciais"]}
              />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
