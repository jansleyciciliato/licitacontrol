import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import mammoth from "mammoth";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse/lib/pdf-parse") as (buffer: Buffer) => Promise<{ text: string }>;

const MODELOS_ANTHROPIC = ["claude-opus-4-5", "claude-sonnet-4-5", "claude-haiku-4-5-20251001"];
const MODELOS_OPENAI = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"];

// Remove artefato de caracteres repetidos 4+ vezes (PDFs com negrito duplicam chars)
function cleanRepeatedChars(text: string): string {
  return text.replace(/(.)\1{3,}/g, "$1");
}

async function extrairTexto(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    const data = await pdfParse(buffer);
    return cleanRepeatedChars(data.text);
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

// Remove markdown de código da resposta da IA (```json ... ```)
function stripMarkdown(raw: string): string {
  let text = raw.trim();
  if (text.startsWith("```")) {
    const parts = text.split("```");
    text = parts[1] ?? "";
    if (text.startsWith("json")) text = text.slice(4);
    text = text.split("```")[0].trim();
  }
  return text;
}

// Converte "YYYY-MM-DD HH:MM" para "YYYY-MM-DDTHH:MM" (compatível com datetime-local)
function normalizarDataHora(valor: unknown): string | null {
  if (!valor || typeof valor !== "string") return null;
  return valor.replace(" ", "T");
}

const SYSTEM_PROMPT = `
<papel>
Você é um Analista Sênior de Licitações Públicas, especialista em interpretação de
Editais, Termos de Referência e Anexos, com profundo conhecimento da Lei nº 14.133/2021
e das práticas administrativas brasileiras.
</papel>

<objetivo>
Extrair informações objetivas, literais e estruturadas a partir de textos oficiais de
licitações públicas e retornar EXCLUSIVAMENTE um JSON válido conforme o esquema definido.
</objetivo>

<proibicoes_absolutas>
NÃO invente informações.
NÃO faça suposições ou deduções além do texto.
NÃO escreva explicações, comentários ou markdown fora do JSON.
NÃO normalize, reformule ou complete textos técnicos.
NÃO utilize conhecimento externo ao texto fornecido.
NÃO misture conceitos jurídicos distintos.
Quando uma informação não estiver clara e explicitamente presente, retorne null.
Se houver conflito ou ambiguidade entre trechos, retorne null.
</proibicoes_absolutas>

<regras_gerais_de_extracao>
- Use somente dados explicitamente identificáveis no texto.
- Preserve a ordem dos lotes e itens conforme aparecem no edital.
- Respeite rigorosamente os valores de ENUMs definidos para cada campo.
- Retorne APENAS JSON válido — nenhum texto antes ou depois.
</regras_gerais_de_extracao>
`.trim();

const buildUserPrompt = (texto: string) => `
Analise o texto completo da licitação fornecido ao final e retorne EXCLUSIVAMENTE um JSON válido seguindo o esquema e as regras abaixo.

<campo name="numero_edital">Número do certame (Pregão, Dispensa ou Credenciamento). Priorize sempre o número do Pregão ou da Dispensa.</campo>

<campo name="numero_processo">Número do Processo Administrativo do certame.</campo>

<campo name="orgao">
Órgão promotor do certame. Formato obrigatório: "ORGÃO - ESTADO" (letras maiúsculas, separador " - ", estado no formato de sigla: SP, PR, MG etc.).
- Prefeituras: use apenas "CIDADE - ESTADO" (remova PREFEITURA MUNICIPAL, MUNICÍPIO DE, ESTÂNCIA TURÍSTICA DE).
- Demais órgãos: use a denominação institucional completa exatamente como aparece.
- NÃO abrevie nomes de cidades. NÃO invente estados.
</campo>

<campo name="modalidade">
Valores permitidos (use EXATAMENTE um):
PREGÃO ELETRÔNICO | PREGÃO PRESENCIAL | DISPENSA DE LICITAÇÃO | CREDENCIAMENTO
</campo>

<campo name="modo_disputa">
Valores permitidos (use EXATAMENTE um):
ABERTO | ABERTO E FECHADO | FECHADO E ABERTO | FECHADO
Normalize gênero: ABERTA → ABERTO, FECHADA → FECHADO.
</campo>

<campo name="tipo_disputa">
Forma de julgamento da proposta. "por grupo" equivale a "POR LOTE".
NÃO representa o critério de julgamento (ex.: menor preço).
Valores permitidos (use EXATAMENTE um):
GLOBAL | POR LOTE | POR ITEM
</campo>

<campo name="registro_preco">Indica se o certame é para Registro de Preços. Valores: true | false</campo>

<campo name="data_abertura">Data da sessão pública. Formato: YYYY-MM-DD</campo>

<campo name="data_hora_abertura">Data e horário de início da sessão pública. Formato: YYYY-MM-DD HH:MM</campo>

<campo name="objeto">Descrição literal do objeto do certame, exatamente como consta no edital.</campo>

<campo name="data_evento">Data do evento, somente se explicitamente mencionada. Pode ser um período (texto livre).</campo>

<campo name="plataforma">Nome da Plataforma/Portal de Compras em LETRAS MAIÚSCULAS. Exemplos: BLL | BNC | COMPRAS NET | LICITAR DIGITAL. NÃO insira links.</campo>

<campo name="regionalidade">
Indicação de exclusividade ou preferência regional/local. Só marque SIM se houver declaração expressa no texto.
Valores permitidos (use EXATAMENTE um):
NÃO | SIM - PREFERÊNCIA REGIONAL | SIM - PREFERÊNCIA LOCAL | SIM - EXCLUSIVO REGIONAL | SIM - EXCLUSIVO LOCAL
</campo>

<campo name="itens">
Lista detalhada dos itens ou lotes conforme o edital. Numeração: somente números (1, 2, 3...), sem texto.
NÃO altere descrições, valores ou unidades.
</campo>

<campo name="documentos_habilitacao">Lista única de todos os documentos exigidos para habilitação (Array de Strings). Reúna todos os tópicos (Jurídica, Fiscal, Financeira etc.) em uma lista única.</campo>

Retorne APENAS este JSON (sem markdown, sem explicações):
{
  "numero_edital": "" | null,
  "numero_processo": "" | null,
  "orgao": "" | null,
  "modalidade": "" | null,
  "tipo_disputa": "" | null,
  "registro_preco": true | false,
  "modo_disputa": "" | null,
  "data_abertura": "YYYY-MM-DD" | null,
  "data_hora_abertura": "YYYY-MM-DD HH:MM" | null,
  "objeto": "" | null,
  "data_evento": "" | null,
  "plataforma": "" | null,
  "regionalidade": "" | null,
  "itens": [
    {
      "lote": 0 | null,
      "item": 0 | null,
      "descricao": "",
      "unidade": "" | null,
      "quantidade": 0 | null,
      "valor_item": 0.00 | null
    }
  ],
  "documentos_habilitacao": []
}

<texto_licitacao>
${texto.slice(0, 120000)}
</texto_licitacao>
`.trim();

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

export const dynamic = "force-dynamic";

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
      return NextResponse.json({ error: "Não foi possível extrair texto do arquivo." }, { status: 422 });
    }

    const raw = isAnthropic
      ? await analisarComAnthropic(texto, model)
      : await analisarComOpenAI(texto, model);

    const jsonText = stripMarkdown(raw);

    let dados: Record<string, unknown>;
    try {
      dados = JSON.parse(jsonText);
    } catch {
      console.error("JSON inválido recebido da IA:", jsonText.slice(0, 500));
      return NextResponse.json({ error: "A IA retornou um formato inválido. Tente novamente." }, { status: 422 });
    }

    // Normaliza data_hora_abertura para formato compatível com datetime-local
    dados.data_hora_abertura = normalizarDataHora(dados.data_hora_abertura);

    return NextResponse.json({ dados, caracteresAnalisados: texto.length });

  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro interno.";
    console.error("Erro na análise:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
