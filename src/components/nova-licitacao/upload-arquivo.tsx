"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadArquivoProps {
  onArquivoSelecionado: (file: File) => void;
}

const TIPOS_ACEITOS = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
const EXTENSOES_ACEITAS = ".pdf,.docx,.txt";

export function UploadArquivo({ onArquivoSelecionado }: UploadArquivoProps) {
  const [dragging, setDragging] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);

  const processarArquivo = useCallback(
    (file: File) => {
      if (!TIPOS_ACEITOS.includes(file.type) && !file.name.match(/\.(pdf|docx|txt)$/i)) {
        alert("Formato não suportado. Use PDF, DOCX ou TXT.");
        return;
      }
      setArquivo(file);
      onArquivoSelecionado(file);
    },
    [onArquivoSelecionado]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processarArquivo(file);
    },
    [processarArquivo]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processarArquivo(file);
    },
    [processarArquivo]
  );

  const remover = () => {
    setArquivo(null);
  };

  if (arquivo) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{arquivo.name}</p>
          <p className="text-xs text-muted-foreground">
            {(arquivo.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <button
          type="button"
          onClick={remover}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <label
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 cursor-pointer transition-colors",
        dragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Upload className="h-6 w-6 text-primary" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          Arraste o edital ou clique para selecionar
        </p>
        <p className="text-xs text-muted-foreground mt-1">PDF, DOCX ou TXT — até 20 MB</p>
      </div>
      <input
        type="file"
        accept={EXTENSOES_ACEITAS}
        className="sr-only"
        onChange={onInputChange}
      />
    </label>
  );
}
