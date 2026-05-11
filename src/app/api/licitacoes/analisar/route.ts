import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import mammoth from "mammoth";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ text: string }>;

const MODELOS_ANTHROPIC = ["claude-opus-4-5", "claude-sonnet-4-5", "claude-haiku-4-5-20251001"];
const MODELOS_OPENAI = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"];

async function extrairTexto(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    return buffer.toString("utf-8");
  }

  throw new Error("Formato não suportado. Use PDF, DOCX ou TXT.");
}

const SYSTEM_PROMPT = `Você é um especialista em licitações públicas brasileiras. Sua função é extrair informações estruturadas de editais de licitação.

Regras obrigatórias:
- Retorne APENAS um objeto JSON válido, sem texto antes ou depois
- Nunca invente dados. Se não encontrar uma informação, use null
- Datas devem estar no formato ISO 8601: YYYY-MM-DD para datas e YYYY-MM-DDTHH:MM:SS para timestamps
- registro_preco deve ser true apenas se o edital mencionar explicitamente "registro de preço" ou "SRP"
- modalidade: use exatamente um dos valores: "PREGÃO ELETRÔNICO", "PREGÃO PRESENCIAL", "DISPENSA DE LICITAÇÃO", "CREDENCIAMENTO"
- tipo_disputa: use exatamente um dos valores: "GLOBAL", "POR LOTE", "POR ITEM"
- modo_disputa: use exatamente um dos valores: "ABERTO", "ABERTO E FECHADO", "FECHADO E ABERTO", "FECHADO"
- regionalidade: use exatamente um dos valores: "NÃO", "SIM - PREFERÊNCIA REGIONAL", "SIM - PREFERÊNCIA LOCAL", "SIM - EXCLUSIVO REGIONAL", "SIM - EXCLUSIVO LOCAL"
- plataforma: nome do portal onde será realizado (ex: "ComprasNet", "BLL", "Licitanet", "PNCP", etc.)
- documentos_habilitacao: lista dos documentos exigidos para habilitação
- itens: lista dos itens/lotes. Para cada item extraia: lote (número do lote ou null), item (número do item ou null), descricao, unidade, quantidade e valor_item (valor unitário em reais como número ou null)`;

const buildUserPrompt = (texto: string) => `Analise o edital abaixo e extraia as informações no formato JSON especificado.

Retorne exatamente este objeto JSON (sem markdown, sem explicações):
{
  "numero_edital": string | null,
  "numero_processo": string | null,
  "orgao": string | null,
  "modalidade": "PREGÃO ELETRÔNICO" | "PREGÃO PRESENCIAL" | "DISPENSA DE LICITAÇÃO" | "CREDENCIAMENTO" | null,
  "tipo_disputa": "GLOBAL" | "POR LOTE" | "POR ITEM" | null,
  "modo_disputa": "ABERTO" | "ABERTO E FECHADO" | "FECHADO E ABERTO" | "FECHADO" | null,
  "registro_preco": boolean | null,
  "data_abertura": string | null,
  "data_hora_abertura": string | null,
  "objeto": string | null,
  "plataforma": string | null,
  "regionalidade": "NÃO" | "SIM - PREFERÊNCIA REGIONAL" | "SIM - PREFERÊNCIA LOCAL" | "SIM - EXCLUSIVO REGIONAL" | "SIM - EXCLUSIVO LOCAL" | null,
  "documentos_habilitacao": string[] | null,
  "itens": Array<{ lote: number | null, item: number | null, descricao: string, unidade: string | null, quantidade: number | null, valor_item: number | null }> | null
}

Edital:
${texto.slice(0, 50000)}`;

async function analisarComAnthropic(texto: string, model: string): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(texto) }],
  });
  const content = message.content[0];
  if (content.type !== "text") throw new Error("Resposta inesperada da Anthropic.");
  return content.text;
}

async function analisarComOpenAI(texto: string, model: string): Promise<string> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model,
    max_tokens: 4096,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(texto) },
    ],
    response_format: { type: "json_object" },
  });
  return completion.choices[0].message.content ?? "";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const model = (formData.get("model") as string | null) ?? "gpt-4o-mini";

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    const isAnthropic = MODELOS_ANTHROPIC.includes(model);
    const isOpenAI = MODELOS_OPENAI.includes(model);

    if (!isAnthropic && !isOpenAI) {
      return NextResponse.json({ error: `Modelo "${model}" não suportado.` }, { status: 400 });
    }

    const texto = await extrairTexto(file);

    if (!texto || texto.trim().length < 100) {
      return NextResponse.json(
        { error: "Não foi possível extrair texto do arquivo." },
        { status: 422 }
      );
    }

    const raw = isAnthropic
      ? await analisarComAnthropic(texto, model)
      : await analisarComOpenAI(texto, model);

    const jsonText = raw.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
    const dados = JSON.parse(jsonText);

    return NextResponse.json({ dados, caracteresAnalisados: texto.length });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro interno.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
