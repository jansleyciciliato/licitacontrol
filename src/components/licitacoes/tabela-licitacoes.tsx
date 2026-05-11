"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronUp, ChevronDown, ChevronsUpDown, FileText } from "lucide-react";
import { BadgeStatus } from "./badge-status";
import { BadgeModalidade } from "./badge-modalidade";
import type { Licitacao } from "@/types/database";

type SortField = "orgao" | "numero_edital" | "modalidade" | "data_abertura" | "status";
type SortDir = "asc" | "desc";

function formatarData(data: string | null) {
  if (!data) return "—";
  const [year, month, day] = data.split("-");
  return `${day}/${month}/${year}`;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="h-3 w-3 opacity-30 shrink-0" />;
  return active && dir === "asc"
    ? <ChevronUp className="h-3 w-3 shrink-0" />
    : <ChevronDown className="h-3 w-3 shrink-0" />;
}

interface TabelaLicitacoesProps {
  licitacoes: Licitacao[];
}

export function TabelaLicitacoes({ licitacoes }: TabelaLicitacoesProps) {
  const [sortField, setSortField] = useState<SortField>("data_abertura");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sorted = [...licitacoes].sort((a, b) => {
    const valA = String(a[sortField] ?? "");
    const valB = String(b[sortField] ?? "");
    const cmp = valA.localeCompare(valB, "pt-BR", { sensitivity: "base" });
    return sortDir === "asc" ? cmp : -cmp;
  });

  if (licitacoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">Nenhuma licitação encontrada</p>
        <p className="text-xs text-muted-foreground">Tente outro filtro ou cadastre uma nova</p>
      </div>
    );
  }

  const th = (label: string, field: SortField, className = "") => (
    <th
      className={`text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors ${className}`}
      onClick={() => toggleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <SortIcon active={sortField === field} dir={sortDir} />
      </span>
    </th>
  );

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {th("Órgão", "orgao")}
            {th("Edital", "numero_edital", "hidden sm:table-cell")}
            {th("Modalidade", "modalidade", "hidden lg:table-cell")}
            {th("Abertura", "data_abertura", "hidden md:table-cell")}
            {th("Status", "status")}
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((lic, i) => (
            <tr
              key={lic.id}
              className={`group transition-colors hover:bg-muted/20 ${i !== 0 ? "border-t border-border" : ""}`}
            >
              <td className="px-5 py-4">
                <span className="font-medium text-foreground line-clamp-1">{lic.orgao ?? "—"}</span>
                <span className="text-xs text-muted-foreground mt-0.5 block sm:hidden">
                  {lic.numero_edital ?? "Sem número"}
                </span>
              </td>
              <td className="px-5 py-4 hidden sm:table-cell text-muted-foreground">
                {lic.numero_edital ?? "—"}
              </td>
              <td className="px-5 py-4 hidden lg:table-cell">
                <BadgeModalidade modalidade={lic.modalidade} />
              </td>
              <td className="px-5 py-4 hidden md:table-cell text-muted-foreground tabular-nums">
                {formatarData(lic.data_abertura)}
              </td>
              <td className="px-5 py-4">
                <BadgeStatus status={lic.status} />
              </td>
              <td className="px-3 py-4">
                <Link
                  href={`/licitacoes/${lic.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
