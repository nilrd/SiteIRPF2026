import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Cliente Groq via OpenAI SDK (chatbot, admin IA, blog fallback)
export const groqLlama = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

// Cliente Gemini — disponível apenas se GEMINI_API_KEY estiver configurada
export const geminiClient = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export const MODELS = {
  chatbot: "llama-3.3-70b-versatile",
  adminIA: "llama-3.3-70b-versatile",
  blogGeneration: "gemini-2.0-flash",
  blogVerifier: "llama-3.1-8b-instant",
} as const;

// Modelo Gemini principal para blog (1M tokens/dia grátis, contexto 1M)
const GEMINI_PRIMARY = "gemini-2.0-flash";

// Cascata Groq de backup (modelos grandes, SEM 8b)
const GROQ_FALLBACK_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "mixtral-8x7b-32768",
] as const;

// Último recurso Groq (contexto pequeno, prompt compacto obrigatório)
const GROQ_LAST_RESORT = "llama-3.1-8b-instant";

function isRateLimitOrQuotaError(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const e = err as { status?: number; message?: string; code?: string };
  return (
    e.status === 429 ||
    e.status === 413 ||
    e.code === "rate_limit_exceeded" ||
    e.message?.includes("rate_limit") === true ||
    e.message?.includes("tokens per day") === true ||
    e.message?.includes("exceeded") === true ||
    e.message?.includes("quota") === true ||
    e.message?.includes("decommissioned") === true ||
    e.message?.includes("Request too large") === true ||
    e.message?.includes("too large") === true
  );
}

export type FallbackResult = {
  text: string;
  model: string;
};

/**
 * Chama LLM com fallback automático:
 * 1. Gemini 2.0 Flash (PRINCIPAL — 1M tokens/dia grátis, contexto 1M)
 * 2. Groq 70b models + mixtral (backup)
 * 3. Groq 8b-instant (último recurso, prompt compacto)
 *
 * @param compactSystemPrompt - versão reduzida do prompt para o modelo 8b (opcional)
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
  // --- 1. PRINCIPAL: Gemini 2.0 Flash (1M tokens/dia, contexto gigante) ---
  if (geminiClient) {
    try {
      console.log(`[LLM] Tentando modelo principal: ${GEMINI_PRIMARY}`);
      const gemini = geminiClient.getGenerativeModel({
        model: GEMINI_PRIMARY,
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: extraOptions?.temperature ?? 0.35,
          maxOutputTokens: maxTokens,
          ...(extraOptions?.response_format?.type === "json_object"
            ? { responseMimeType: "application/json" }
            : {}),
        },
      });
      const result = await gemini.generateContent(userPrompt);
      const text = result.response.text();
      if (text) {
        console.log(`[LLM] Sucesso: ${GEMINI_PRIMARY}`);
        return { text, model: GEMINI_PRIMARY };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[LLM] ${GEMINI_PRIMARY} falhou: ${msg.slice(0, 150)}`);
    }
  } else {
    console.warn("[LLM] GEMINI_API_KEY não configurada — pulando Gemini, tentando Groq...");
  }

  // --- 2. BACKUP: Cascata Groq (modelos grandes) ---
  for (const model of GROQ_FALLBACK_MODELS) {
    try {
      console.log(`[LLM] Tentando backup Groq: ${model}`);
      const response = await groqLlama.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: maxTokens,
        temperature: extraOptions?.temperature ?? 0.35,
        ...(extraOptions?.response_format
          ? { response_format: extraOptions.response_format }
          : {}),
      });
      const text = response.choices[0]?.message?.content;
      if (text) {
        console.log(`[LLM] Sucesso: ${model}`);
        return { text, model };
      }
    } catch (err) {
      if (isRateLimitOrQuotaError(err)) {
        console.warn(`[LLM] Limite atingido em ${model}, tentando próximo...`);
        continue;
      }
      throw err;
    }
  }

  // --- 3. ÚLTIMO RECURSO: Groq 8b (prompt compacto obrigatório) ---
  const compactPrompt = extraOptions?.compactSystemPrompt || systemPrompt;
  try {
    console.log(`[LLM] Último recurso: ${GROQ_LAST_RESORT} (prompt compacto)`);
    const response = await groqLlama.chat.completions.create({
      model: GROQ_LAST_RESORT,
      messages: [
        { role: "system", content: compactPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: Math.min(maxTokens, 4000),
      temperature: extraOptions?.temperature ?? 0.35,
      ...(extraOptions?.response_format
        ? { response_format: extraOptions.response_format }
        : {}),
    });
    const text = response.choices[0]?.message?.content;
    if (text) {
      console.log(`[LLM] Sucesso: ${GROQ_LAST_RESORT} (compacto)`);
      return { text, model: GROQ_LAST_RESORT };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[LLM] ${GROQ_LAST_RESORT} falhou:`, msg);
  }

  throw new Error(
    "Todos os modelos atingiram o limite de tokens. Tente novamente em alguns minutos."
  );
}
