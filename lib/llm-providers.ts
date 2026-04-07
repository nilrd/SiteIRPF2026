import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Cliente Groq via OpenAI SDK (chatbot, admin IA, blog fallback)
export const groqLlama = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

// Clientes Gemini — chave principal + chave de backup (contas diferentes)
// Se a chave 1 atingir cota/RPM ou falhar, a chave 2 assume automaticamente
const geminiClients: Array<{ client: GoogleGenerativeAI; label: string }> = [
  ...(process.env.GEMINI_API_KEY
    ? [{ client: new GoogleGenerativeAI(process.env.GEMINI_API_KEY), label: "key1" }]
    : []),
  ...(process.env.GEMINI_API_KEY_2
    ? [{ client: new GoogleGenerativeAI(process.env.GEMINI_API_KEY_2), label: "key2" }]
    : []),
];

// Mantém compatibilidade com código legado que usa geminiClient diretamente
export const geminiClient = geminiClients[0]?.client ?? null;

// Cliente OpenAI direto (fallback tier 3 — GPT-4o-mini, só quando Gemini + Groq falharem)
const openaiDirectClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export const MODELS = {
  chatbot: "llama-3.3-70b-versatile",
  adminIA: "llama-3.3-70b-versatile",
  blogGeneration: "gemini-2.5-flash",
  blogVerifier: "llama-3.1-8b-instant",
} as const;

// ─── DEAD MODEL CACHE ─────────────────────────────────────────────────────────
// Persiste pelo lifetime da instância serverless (~5 min na Vercel).
// Evita retentar modelos confirmados descontinuados/inexistentes na mesma instância.
const deadModels = new Set<string>();

// ─── GEMINI CASCADE ───────────────────────────────────────────────────────────
// Apenas modelos GA estáveis (sem data de expiração no ID).
// Se um modelo retornar 404/deprecated, o próximo é tentado automaticamente (RN3).
const GEMINI_MODELS = [
  "gemini-2.5-flash",      // GA desde jun/2025 — principal (sem descontinuação prevista)
  "gemini-2.5-flash-lite", // GA desde jul/2025 — leve e rápido
  "gemini-2.0-flash",      // GA (aposentadoria prevista jun/2026 — backup temporário)
] as const;

// ─── GROQ CASCADE ─────────────────────────────────────────────────────────────
// Apenas modelos confirmados ativos. Prompt compacto obrigatório (RN5/RN6).
// llama-3.1-70b-versatile e mixtral-8x7b-32768 foram descontinuados pela Groq.
const GROQ_FALLBACK_MODELS = [
  "llama-3.3-70b-versatile", // Ativo — melhor qualidade disponível no plano on_demand
  "llama3-70b-8192",         // Ativo — Llama 3 original (contexto 8k)
] as const;

// Último recurso: modelo mais leve, prompt ultra-compacto obrigatório (RN7)
const GROQ_LAST_RESORT = "llama-3.1-8b-instant";

// Limites de chars para prompts Groq (evita 413 TPM nos planos on_demand) — RN6/RN7
const GROQ_SYSTEM_MAX_CHARS = 12_000;            // ≈ 3 000 tokens
const GROQ_USER_MAX_CHARS = 6_000;               // ≈ 1 500 tokens
const GROQ_LAST_RESORT_SYSTEM_MAX_CHARS = 3_000; // ≈ 750 tokens
const GROQ_LAST_RESORT_USER_MAX_CHARS = 2_000;   // ≈ 500 tokens

// ─── HELPERS ──────────────────────────────────────────────────────────────────

type ModelErrorType = "dead" | "size_limit" | "transient";

/**
 * Classifica o erro para decidir ação de fallback (RN3/RN4/RN5):
 * - "dead"       → modelo inexistente/descontinuado; marcar no cache e pular
 * - "size_limit" → request muito grande ou rate limit; pular sem marcar morto
 * - "transient"  → erro temporário; pular sem marcar morto
 */
function classifyError(err: unknown): ModelErrorType {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  const status = (err as Record<string, unknown>)?.status as number | undefined;

  if (
    status === 404 ||
    msg.includes("not found") ||
    msg.includes("decommissioned") ||
    msg.includes("no longer supported") ||
    msg.includes("does not exist") ||
    msg.includes("was decommissioned") ||
    msg.includes("model not found") ||
    msg.includes("deprecated")
  ) {
    return "dead";
  }

  if (
    status === 413 ||
    status === 429 ||
    msg.includes("too large") ||
    msg.includes("rate_limit") ||
    msg.includes("rate limit") ||
    msg.includes("quota") ||
    msg.includes("tokens per") ||
    msg.includes("tpm") ||
    msg.includes("rpm") ||
    msg.includes("request too large") ||
    msg.includes("tokens per day") ||
    msg.includes("exceeded")
  ) {
    return "size_limit";
  }

  return "transient";
}

/** Trunca texto para caber no limite de chars (RN6/RN7). */
function safeTrim(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n[CONTEÚDO TRUNCADO PARA CABER NO LIMITE DO MODELO]";
}

/**
 * Limpa fences markdown e valida JSON.
 * Retorna o texto limpo se válido (ou se JSON não é exigido), ou null se JSON inválido/truncado.
 * Garante que o cascade nunca retorne JSON corrompido.
 */
function cleanAndValidateJson(text: string, requireJson: boolean): string | null {
  const t = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  if (!requireJson) return t;
  try {
    JSON.parse(t);
    return t;
  } catch {
    // Tenta extrair objeto JSON do texto (ex: modelo adicionou prefácio antes do JSON)
    const match = t.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        JSON.parse(match[0]);
        return match[0];
      } catch { /* JSON truncado mesmo */ }
    }
    return null; // cascade deve continuar para próximo modelo
  }
}

export type FallbackResult = {
  text: string;
  model: string;
};

/**
 * Chama LLM com fallback automático e cascata resiliente a descontinuações.
 *
 * 1. Gemini cascade (gemini-2.5-flash → gemini-2.5-flash-lite → gemini-2.0-flash)
 *    - 404/deprecated → modelo marcado como morto na instância, próximo tentado (RN3)
 *    - Prompt completo enviado (contexto 1M tokens)
 *
 * 2. Groq cascade (llama-3.3-70b-versatile → llama3-70b-8192)
 *    - Sempre usa compactSystemPrompt se disponível (RN5)
 *    - System cap 12.000 chars, user cap 6.000 chars (RN6)
 *
 * 3. Último recurso: llama-3.1-8b-instant
 *    - System cap 3.000 chars, user cap 2.000 chars, maxTokens cap 2.000 (RN7)
 *
 * @param compactSystemPrompt — versão reduzida do system prompt para fallbacks Groq
 */
export async function callWithFallback(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 4000,
  extraOptions?: {
    temperature?: number;
    response_format?: { type: "json_object" };
    compactSystemPrompt?: string;
  }
): Promise<FallbackResult> {
  const requireJson = extraOptions?.response_format?.type === "json_object";
  // ── 1. GEMINI CASCADE (itera por modelo × chave) ───────────────────────────
  // Ordem: modelo1/chave1 → modelo1/chave2 → modelo2/chave1 → modelo2/chave2 → ...
  if (geminiClients.length > 0) {
    for (const model of GEMINI_MODELS) {
      if (deadModels.has(model)) {
        console.log(`[LLM] Pulando ${model} (marcado morto nesta instância)`);
        continue;
      }
      for (const { client, label } of geminiClients) {
        try {
          console.log(`[LLM] Tentando Gemini: ${model} [${label}]`);
          const gemini = client.getGenerativeModel({
            model,
            systemInstruction: systemPrompt,
            generationConfig: {
              temperature: extraOptions?.temperature ?? 0.35,
              // Sem maxOutputTokens: Gemini usa o máximo que precisar (até 65k+)
              // Thinking tokens não competem com output tokens assim
              ...(requireJson ? { responseMimeType: "application/json" } : {}),
            },
          });
          const result = await gemini.generateContent(userPrompt);
          const raw = result.response.text();
          const validated = raw ? cleanAndValidateJson(raw, requireJson) : null;
          if (validated) {
            console.log(`[LLM] Sucesso: ${model} [${label}]`);
            return { text: validated, model: `${model}` };
          } else if (raw) {
            console.warn(`[LLM] ${model} [${label}] retornou JSON inválido/truncado — continuando cascade`);
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          const errType = classifyError(err);
          if (errType === "dead") {
            deadModels.add(model);
            console.warn(`[LLM] ${model} MORTO (descontinuado): ${msg.slice(0, 100)}`);
            break; // modelo morto — não tenta a segunda chave para ele
          } else {
            console.warn(`[LLM] ${model} [${label}] falhou [${errType}]: ${msg.slice(0, 100)}`);
            // continua para próxima chave
          }
        }
      }
    }
  } else {
    console.warn("[LLM] Nenhuma GEMINI_API_KEY configurada — usando Groq diretamente...");
  }

  // ── 2. GROQ CASCADE (prompt compacto + chars truncados) ───────────────────
  const groqSystem = safeTrim(
    extraOptions?.compactSystemPrompt ?? systemPrompt,
    GROQ_SYSTEM_MAX_CHARS
  );
  const groqUser = safeTrim(userPrompt, GROQ_USER_MAX_CHARS);
  const groqMaxTokens = Math.min(maxTokens, 4000);

  for (const model of GROQ_FALLBACK_MODELS) {
    if (deadModels.has(model)) {
      console.log(`[LLM] Pulando ${model} (marcado morto nesta instância)`);
      continue;
    }
    try {
      console.log(`[LLM] Tentando Groq: ${model}`);
      const response = await groqLlama.chat.completions.create({
        model,
        messages: [
          { role: "system", content: groqSystem },
          { role: "user", content: groqUser },
        ],
        max_tokens: groqMaxTokens,
        temperature: extraOptions?.temperature ?? 0.35,
        ...(extraOptions?.response_format
          ? { response_format: extraOptions.response_format }
          : {}),
      });
      const raw = response.choices[0]?.message?.content;
      const validated = raw ? cleanAndValidateJson(raw, requireJson) : null;
      if (validated) {
        console.log(`[LLM] Sucesso: ${model}`);
        return { text: validated, model };
      } else if (raw) {
        console.warn(`[LLM] ${model} retornou JSON inválido/truncado — continuando cascade`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const errType = classifyError(err);
      if (errType === "dead") {
        deadModels.add(model);
        console.warn(`[LLM] ${model} MORTO: ${msg.slice(0, 100)}`);
      } else {
        console.warn(`[LLM] ${model} falhou [${errType}]: ${msg.slice(0, 120)}`);
      }
    }
  }

  // ── 3. OPENAI CASCADE (fallback pago — GPT-4o-mini, só quando Gemini + Groq falharem) ──
  if (openaiDirectClient) {
    const oaiModels = ["gpt-4o-mini", "gpt-3.5-turbo"] as const;
    const oaiSystem = safeTrim(
      extraOptions?.compactSystemPrompt ?? systemPrompt,
      GROQ_SYSTEM_MAX_CHARS
    );
    const oaiUser = safeTrim(userPrompt, GROQ_USER_MAX_CHARS);
    for (const model of oaiModels) {
      try {
        console.log(`[LLM] Tentando OpenAI: ${model}`);
        const response = await openaiDirectClient.chat.completions.create({
          model,
          messages: [
            { role: "system", content: oaiSystem },
            { role: "user", content: oaiUser },
          ],
          max_tokens: Math.min(maxTokens, 4096),
          temperature: extraOptions?.temperature ?? 0.35,
          ...(extraOptions?.response_format
            ? { response_format: extraOptions.response_format }
            : {}),
        });
        const raw = response.choices[0]?.message?.content;
        const validated = raw ? cleanAndValidateJson(raw, requireJson) : null;
        if (validated) {
          console.log(`[LLM] Sucesso: ${model} (OpenAI)`);
          return { text: validated, model };
        } else if (raw) {
          console.warn(`[LLM] ${model} retornou JSON inválido — continuando cascade`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const errType = classifyError(err);
        console.warn(`[LLM] OpenAI ${model} falhou [${errType}]: ${msg.slice(0, 120)}`);
      }
    }
  }

  // ── 4. ÚLTIMO RECURSO: 8b (ultra-compacto, tokens limitados) ──────────────
  if (!deadModels.has(GROQ_LAST_RESORT)) {
    const lastSystem = safeTrim(
      extraOptions?.compactSystemPrompt ?? systemPrompt,
      GROQ_LAST_RESORT_SYSTEM_MAX_CHARS
    );
    const lastUser = safeTrim(userPrompt, GROQ_LAST_RESORT_USER_MAX_CHARS);
    try {
      console.log(`[LLM] Último recurso: ${GROQ_LAST_RESORT}`);
      const response = await groqLlama.chat.completions.create({
        model: GROQ_LAST_RESORT,
        messages: [
          { role: "system", content: lastSystem },
          { role: "user", content: lastUser },
        ],
        max_tokens: Math.min(maxTokens, 2000),
        temperature: extraOptions?.temperature ?? 0.35,
        ...(extraOptions?.response_format
          ? { response_format: extraOptions.response_format }
          : {}),
      });
      const raw = response.choices[0]?.message?.content;
      const validated = raw ? cleanAndValidateJson(raw, requireJson) : null;
      if (validated) {
        console.log(`[LLM] Sucesso: ${GROQ_LAST_RESORT}`);
        return { text: validated, model: GROQ_LAST_RESORT };
      } else if (raw) {
        console.warn(`[LLM] ${GROQ_LAST_RESORT} retornou JSON inválido — sem mais fallbacks`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const errType = classifyError(err);
      if (errType === "dead") deadModels.add(GROQ_LAST_RESORT);
      console.error(`[LLM] ${GROQ_LAST_RESORT} falhou [${errType}]: ${msg.slice(0, 150)}`);
    }
  }

  throw new Error(
    `Todos os modelos LLM falharam. Modelos mortos nesta instância: [${Array.from(deadModels).join(", ")}]. Tente novamente em alguns minutos.`
  );
}
