import { FileCheck, FileX } from "lucide-react";

interface AbaDocumentosProps {
  documentos: string[] | null;
}

export function AbaDocumentos({ documentos }: AbaDocumentosProps) {
  if (!documentos || documentos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FileX className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">Nenhum documento listado</p>
        <p className="text-xs text-muted-foreground">A IA não identificou documentos de habilitação neste edital</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground mb-2">
        {documentos.length} documento{documentos.length !== 1 ? "s" : ""} identificado{documentos.length !== 1 ? "s" : ""}
      </p>
      {documentos.map((doc, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3"
        >
          <FileCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span className="text-sm text-foreground">{doc}</span>
        </div>
      ))}
    </div>
  );
}
