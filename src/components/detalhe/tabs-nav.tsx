import Link from "next/link";

const ABAS = [
  { key: "dados", label: "Dados Gerais" },
  { key: "documentos", label: "Documentos" },
  { key: "itens", label: "Itens" },
];

interface TabsNavProps {
  id: string;
  abaAtiva: string;
}

export function TabsNav({ id, abaAtiva }: TabsNavProps) {
  return (
    <div className="flex border-b border-border">
      {ABAS.map(({ key, label }) => {
        const ativo = abaAtiva === key;
        return (
          <Link
            key={key}
            href={`/licitacoes/${id}?aba=${key}`}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              ativo
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
