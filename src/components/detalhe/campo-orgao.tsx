"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CampoOrgaoProps {
  licitacaoId: string;
  valorInicial: string | null;
}

export function CampoOrgao({ licitacaoId, valorInicial }: CampoOrgaoProps) {
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(valorInicial ?? "");
  const [salvando, setSalvando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editando) inputRef.current?.focus();
  }, [editando]);

  const salvar = async () => {
    if (valor.trim() === (valorInicial ?? "")) {
      setEditando(false);
      return;
    }
    setSalvando(true);
    try {
      const res = await fetch(`/api/licitacoes/${licitacaoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgao: valor.trim() || null }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(json?.error ?? "Erro ao salvar.");
      } else {
        toast.success("Órgão atualizado.");
      }
    } catch {
      toast.error("Erro inesperado ao salvar.");
    } finally {
      setSalvando(false);
      setEditando(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") salvar();
    if (e.key === "Escape") {
      setValor(valorInicial ?? "");
      setEditando(false);
    }
  };

  if (editando) {
    return (
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <input
          ref={inputRef}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onBlur={salvar}
          onKeyDown={onKeyDown}
          disabled={salvando}
          className="font-heading text-xl font-bold text-foreground bg-transparent border-b-2 border-primary outline-none w-full"
        />
        {salvando && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0 group">
      <h1 className="font-heading text-xl font-bold text-foreground truncate">
        {valor || "Órgão não informado"}
      </h1>
      <button
        onClick={() => setEditando(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0"
        title="Editar órgão"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
