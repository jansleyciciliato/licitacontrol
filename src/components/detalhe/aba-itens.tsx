"use client";

import { useState, useEffect } from "react";
import { Package, Eye, X } from "lucide-react";

interface Item {
  lote: number | null;
  item: number | null;
  descricao: string;
  unidade: string | null;
  quantidade: number | null;
  valor_item: number | null;
}

interface AbaItensProps {
  itens: Item[] | null;
}

function formatarMoeda(valor: number | null) {
  if (valor == null) return "—";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderDescricao(descricao: string) {
  if (descricao.includes("•") || descricao.includes(";")) {
    const partes = descricao.split(/[•;]/);
    return (
      <div className="flex flex-col gap-1.5">
        {partes.map((parte, i) => {
          const texto = parte.trim();
          if (!texto) return null;
          if (i === 0) {
            return <p key={i} className="font-medium mb-1">{texto}</p>;
          }
          return (
            <div key={i} className="flex gap-2">
              <span className="shrink-0 text-muted-foreground mt-px">•</span>
              <span>{texto}</span>
            </div>
          );
        })}
      </div>
    );
  }

  const linhas = descricao.split(/\r?\n/);
  return (
    <div className="flex flex-col gap-1">
      {linhas.map((linha, i) => {
        if (linha.trim() === "") return <div key={i} className="h-2" />;
        return <p key={i}>{linha}</p>;
      })}
    </div>
  );
}

function ModalDescricao({ item, onFechar }: { item: Item; onFechar: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        onFechar();
      }
    };
    document.addEventListener("keydown", handler, { capture: true });
    return () => document.removeEventListener("keydown", handler, { capture: true });
  }, [onFechar]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onFechar}
    >
      <div
        className="relative w-full max-w-2xl rounded-xl border border-border bg-card shadow-xl flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            {item.lote != null && (
              <span className="text-xs font-medium text-muted-foreground">Lote {item.lote}</span>
            )}
            {item.item != null && (
              <span className="text-xs font-medium text-muted-foreground">Item {item.item}</span>
            )}
          </div>
          <button
            onClick={onFechar}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 text-sm text-foreground leading-relaxed flex flex-col gap-0.5">
          {renderDescricao(item.descricao)}
        </div>
      </div>
    </div>
  );
}

export function AbaItens({ itens }: AbaItensProps) {
  const [itemSelecionado, setItemSelecionado] = useState<Item | null>(null);

  if (!itens || itens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Package className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">Nenhum item listado</p>
        <p className="text-xs text-muted-foreground">A IA não identificou itens neste edital</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          {itens.length} item{itens.length !== 1 ? "s" : ""}
        </p>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-16">Lote</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-16">Item</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Descrição</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-24">Qtd</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-20">Un.</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-32">Valor Unit.</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {itens.map((it, i) => (
                <tr key={i} className={i !== 0 ? "border-t border-border" : ""}>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{it.lote ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{it.item ?? "—"}</td>
                  <td className="px-4 py-3 text-foreground max-w-xs">
                    <p className="line-clamp-2">{it.descricao}</p>
                  </td>
                  <td className="px-4 py-3 text-right text-foreground tabular-nums">
                    {it.quantidade != null ? it.quantidade.toLocaleString("pt-BR") : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{it.unidade ?? "—"}</td>
                  <td className="px-4 py-3 text-right text-foreground tabular-nums">{formatarMoeda(it.valor_item)}</td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => setItemSelecionado(it)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Ver descrição completa"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {itemSelecionado && (
        <ModalDescricao item={itemSelecionado} onFechar={() => setItemSelecionado(null)} />
      )}
    </>
  );
}
