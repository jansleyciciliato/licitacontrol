export interface ModeloIA {
  id: string;
  nome: string;
  provedor: "anthropic" | "openai";
}

export const MODELOS: ModeloIA[] = [
  { id: "gpt-4o", nome: "GPT-4o", provedor: "openai" },
  { id: "gpt-4o-mini", nome: "GPT-4o Mini", provedor: "openai" },
  { id: "gpt-4-turbo", nome: "GPT-4 Turbo", provedor: "openai" },
  { id: "claude-opus-4-5", nome: "Claude Opus", provedor: "anthropic" },
  { id: "claude-sonnet-4-5", nome: "Claude Sonnet", provedor: "anthropic" },
  { id: "claude-haiku-4-5-20251001", nome: "Claude Haiku", provedor: "anthropic" },
];

export const MODELO_PADRAO = "gpt-4o-mini";
