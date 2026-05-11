"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function BotaoExcluir({ licitacaoId }: { licitacaoId: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const excluir = async () => {
    setExcluindo(true);
    try {
      const res = await fetch(`/api/licitacoes/${licitacaoId}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(json?.error ?? "Erro ao excluir a licitação.");
        return;
      }
      toast.success("Licitação excluída.");
      const url = sessionStorage.getItem("licitacoes-lista-url") ?? "/licitacoes";
      window.location.href = url;
    } catch {
      toast.error("Erro inesperado ao excluir.");
    } finally {
      setExcluindo(false);
      setConfirmando(false);
    }
  };

  if (excluindo) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-destructive">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Excluindo...
      </div>
    );
  }

  if (confirmando) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Confirmar exclusão?</span>
        <button
          onClick={excluir}
          className="text-xs font-medium text-destructive hover:underline"
        >
          Sim
        </button>
        <button
          onClick={() => setConfirmando(false)}
          className="text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Não
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirmando(true)}
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
      title="Excluir licitação"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
