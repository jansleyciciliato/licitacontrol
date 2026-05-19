"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadArquivoProps {
  onArquivosSelecionados: (files: File[]) => void;
}

const TIPOS_ACEITOS = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
const EXTENSOES_ACEITAS = ".pdf,.docx,.txt";

function validarArquivo(file: File): boolean {
  return TIPOS_ACEITOS.includes(file.type) || !!file.name.match(/\.(pdf|docx|txt)$/i);
}

export function UploadArquivo({ onArquivosSelecionados }: UploadArquivoProps) {
  const [dragging, setDragging] = useState(false);
  const [arquivos, setArquivos] = useState<File[]>([]);

  const adicionarArquivos = useCallback((novos: File[]) => {
    const validos = novos.filter(validarArquivo);
    if (validos.length < novos.length) {
      alert("Alguns arquivos foram ignorados. Use apenas PDF, DOCX ou TXT.");
    }
    if (!validos.length) return;
    setArquivos((prev) => {
      const nomes = new Set(prev.map((f) => f.name));
      const unicos = validos.filter((f) => !nomes.has(f.name));
      return [...prev, ...unicos];
    });
  }, []);

  const remover = (index: number) => {
    setArquivos((prev) => prev.filter((_, i) => i !== index));
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      adicionarArquivos(Array.from(e.dataTransfer.files));
    },
    [adicionarArquivos]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) adicionarArquivos(Array.from(e.target.files));
      e.target.value = "";
    },
    [adicionarArquivos]
  );

  const iniciar = () => {
    if (arquivos.length > 0) onArquivosSelecionados(arquivos);
  };

  return (
    <div className="flex flex-col gap-3">
      <label
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors",
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
            Arraste os arquivos ou clique para selecionar
          </p>
          <p className="text-xs text-muted-foreground mt-1">PDF, DOCX ou TXT — múltiplos arquivos permitidos</p>
        </div>
        <input
          type="file"
          accept={EXTENSOES_ACEITAS}
          multiple
          className="sr-only"
          onChange={onInputChange}
        />
      </label>

      {arquivos.length > 0 && (
        <div className="flex flex-col gap-2">
          {arquivos.map((arquivo, i) => (
            <div key={arquivo.name} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{arquivo.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(arquivo.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => remover(i)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={iniciar}
            className="mt-1 w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            Analisar {arquivos.length === 1 ? "1 arquivo" : `${arquivos.length} arquivos`}
          </button>
        </div>
      )}
    </div>
  );
}
