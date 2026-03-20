import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Cliente Groq via OpenAI SDK (blog, chatbot, admin IA)
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
  blogGeneration: "llama-3.3-70b-versatile",
  blogVerifier: "llama-3.1-8b-instant", // verificador factual — rápido e gratuito (~800k tokens/dia separados)
} as const;

// Cascata de modelos Groq em ordem de preferência
const GROQ_FALLBACK_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "mixtral-8x7b-32768",
  "llama-3.1-8b-instant",
] as const;

function isRateLimitOrQuotaError(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const e = err as { status?: number; message?: string };
  return (
    e.status === 429 ||
    e.message?.includes("rate_limit") === true ||
    e.message?.includes("tokens per day") === true ||
    e.message?.includes("exceeded") === true ||
    e.message?.includes("quota") === true ||
    e.message?.includes("decommissioned") === true
  );
}

/**
 * Chama LLM com fallback automático:
 * 1. Tenta cada modelo Groq em cascata (llama-3.3-70b → llama-3.1-70b → mixtral → llama-3.1-8b)
 * 2. Se todos Groq atingirem limite → Gemini 2.0 Flash (1M tokens/dia grátis)
 * 3. Se tudo falhar → lança erro claro
 */
export async function callWithFallback(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 4000,
  extraOptions?: { temperature?: number; response_format?: { type: "json_object" } }
): Promise<string> {
  // --- Cascata Groq ---
  for (const model of GROQ_FALLBACK_MODELS) {
    try {
      console.log(`[LLM] Tentando: ${model}`);
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
        return text;
      }
    } catch (err) {
      if (isRateLimitOrQuotaError(err)) {
        console.warn(`[LLM] Limite atingido em ${model}, tentando próximo...`);
        continue;
      }
      throw err; // erro real (auth, rede, etc.) — propaga imediatamente
    }
  }

  // --- Fallback final: Gemini 2.0 Flash ---
  if (geminiClient) {
    try {
      console.log("[LLM] Todos os modelos Groq esgotados. Tentando Gemini 2.0 Flash...");
      const gemini = geminiClient.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: systemPrompt,
      });
      const result = await gemini.generateContent(userPrompt);
      const text = result.response.text();
      if (text) {
        console.log("[LLM] Sucesso: Gemini 2.0 Flash");
        return text;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[LLM] Gemini 2.0 Flash falhou:", msg);
    }
  } else {
    console.warn("[LLM] GEMINI_API_KEY não configurada — fallback Gemini indisponível.");
  }

  throw new Error(
    "Todos os modelos atingiram o limite de tokens. Tente novamente em alguns minutos ou configure GEMINI_API_KEY como fallback."
  );
}
