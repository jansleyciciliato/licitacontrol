"use client";

import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";

export function BotaoVoltar() {
  const voltar = () => {
    const url = sessionStorage.getItem("licitacoes-lista-url") ?? "/licitacoes";
    window.location.href = url;
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") voltar();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <button
      onClick={voltar}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
    >
      <ChevronLeft className="h-4 w-4" />
      Voltar
    </button>
  );
}
