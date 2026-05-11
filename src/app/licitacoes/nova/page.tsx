"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { UploadArquivo } from "@/components/nova-licitacao/upload-arquivo";
import { MODELOS, MODELO_PADRAO } from "@/lib/modelos";

type Etapa = "upload" | "analisando" | "salvando";

export default function NovaLicitacaoPage() {
  const router = useRouter();
  const [etapa, setEtapa] = useState<Etapa>("upload");
  const [modeloSelecionado, setModeloSelecionado] = useState(MODELO_PADRAO);
  const [erro, setErro] = useState<string | null>(null);

  const modeloAtual = MODELOS.find((m) => m.id === modeloSelecionado);

  const processar = async (file: File) => {
    setErro(null);
    setEtapa("analisando");

    try {
      // 1. Extrair e analisar com IA
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", modeloSelecionado);

      const resAnalise = await fetch("/api/licitacoes/analisar", {
        method: "POST",
        body: formData,
      });

      const jsonAnalise = await resAnalise.json();
      if (!resAnalise.ok) throw new Error(jsonAnalise.error ?? "Erro ao analisar o edital.");

      setEtapa("salvando");

      // 2. Salvar no banco automaticamente
      const resSalvar = await fetch("/api/licitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...jsonAnalise.dados, status: "ANALISAR" }),
      });

      const jsonSalvar = await resSalvar.json();
      if (!resSalvar.ok) throw new Error(jsonSalvar.error ?? "Erro ao salvar no banco.");

      // 3. Redirecionar para o detalhe
      router.push(`/licitacoes/${jsonSalvar.id}`);

    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro inesperado.");
      setEtapa("upload");
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-foreground">Nova Licitação</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Faça upload do edital — a IA extrai e salva os dados automaticamente
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
                    <span className="text-xs text-muted-foreground capitalize mt-0.5">{modelo.provedor}</span>
                  </button>
                ))}
              </div>
            </div>

            <UploadArquivo onArquivoSelecionado={processar} />

            {erro && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                <p className="text-sm text-destructive">{erro}</p>
              </div>
            )}
          </div>
        )}

        {(etapa === "analisando" || etapa === "salvando") && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">
                {etapa === "analisando" ? "Analisando o edital..." : "Salvando licitação..."}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {etapa === "analisando"
                  ? `${modeloAtual?.nome} está extraindo as informações`
                  : "Registrando no banco de dados"}
              </p>
            </div>
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin mt-2" />
          </div>
        )}
      </div>
    </AppShell>
  );
}
