"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import type { StatusLicitacao } from "@/types/database";

const CONFIG: Record<StatusLicitacao, { label: string; dot: string; bg: string; border: string; text: string }> = {
  ANALISAR:   { label: "Analisar",   dot: "bg-[#EAB308]", bg: "bg-[#EAB308]/10", border: "border-[#EAB308]/30", text: "text-[#CA8A04]" },
  PARTICIPAR: { label: "Participar", dot: "bg-[#7B61FF]", bg: "bg-[#7B61FF]/10", border: "border-[#7B61FF]/30", text: "text-[#7B61FF]" },
  MONITORAR:  { label: "Monitorar",  dot: "bg-[#0EA5E9]", bg: "bg-[#0EA5E9]/10", border: "border-[#0EA5E9]/30", text: "text-[#0EA5E9]" },
  DESCARTADA: { label: "Descartada", dot: "bg-[#5A5A72]", bg: "bg-[#5A5A72]/10", border: "border-[#5A5A72]/30", text: "text-[#5A5A72]" },
  VENCEDOR:   { label: "Vencedor",   dot: "bg-[#16A34A]", bg: "bg-[#16A34A]/10", border: "border-[#16A34A]/30", text: "text-[#16A34A]" },
  PERDIDA:    { label: "Perdida",    dot: "bg-[#DC2626]", bg: "bg-[#DC2626]/10", border: "border-[#DC2626]/30", text: "text-[#DC2626]" },
  SUSPENSA:   { label: "Suspensa",   dot: "bg-[#F97316]", bg: "bg-[#F97316]/10", border: "border-[#F97316]/30", text: "text-[#F97316]" },
};

const TODOS_STATUS = Object.keys(CONFIG) as StatusLicitacao[];

interface SeletorStatusProps {
  licitacaoId: string;
  statusInicial: StatusLicitacao;
}

export function SeletorStatus({ licitacaoId, statusInicial }: SeletorStatusProps) {
  const [status, setStatus] = useState(statusInicial);
  const [aberto, setAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const mudarStatus = async (novoStatus: StatusLicitacao) => {
    setAberto(false);
    if (novoStatus === status) return;
    const anterior = status;
    setStatus(novoStatus);
    setSalvando(true);
    try {
      const res = await fetch(`/api/licitacoes/${licitacaoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(anterior);
        toast.error(json?.error ?? "Erro ao atualizar o status.");
      } else {
        toast.success(`Status alterado para ${CONFIG[novoStatus].label}`);
      }
    } catch {
      setStatus(anterior);
      toast.error("Erro ao atualizar o status.");
    } finally {
      setSalvando(false);
    }
  };

  const c = CONFIG[status];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setAberto((v) => !v)}
        disabled={salvando}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-opacity ${c.bg} ${c.border} ${c.text} ${salvando ? "opacity-60 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
        {c.label}
        <ChevronDown className="h-3 w-3 ml-0.5 opacity-60" />
      </button>

      {aberto && (
        <div className="absolute right-0 top-full mt-1.5 z-50 min-w-[160px] rounded-lg border border-border bg-card shadow-lg py-1 overflow-hidden">
          {TODOS_STATUS.map((s) => {
            const cfg = CONFIG[s];
            const ativo = s === status;
            return (
              <button
                key={s}
                onClick={() => mudarStatus(s)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors hover:bg-muted/50 ${ativo ? "bg-muted/30" : ""}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                <span className={cfg.text}>{cfg.label}</span>
                {ativo && <span className="ml-auto text-muted-foreground text-[10px]">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
