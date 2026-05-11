import { Package } from "lucide-react";

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

export function AbaItens({ itens }: AbaItensProps) {
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
            </tr>
          </thead>
          <tbody>
            {itens.map((it, i) => (
              <tr key={i} className={i !== 0 ? "border-t border-border" : ""}>
                <td className="px-4 py-3 text-muted-foreground tabular-nums">{it.lote ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground tabular-nums">{it.item ?? "—"}</td>
                <td className="px-4 py-3 text-foreground">{it.descricao}</td>
                <td className="px-4 py-3 text-right text-foreground tabular-nums">
                  {it.quantidade != null ? it.quantidade.toLocaleString("pt-BR") : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{it.unidade ?? "—"}</td>
                <td className="px-4 py-3 text-right text-foreground tabular-nums">{formatarMoeda(it.valor_item)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
