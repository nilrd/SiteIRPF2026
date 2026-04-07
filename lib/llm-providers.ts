import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Clientes Groq — key1 principal + key2 fallback (rate limit independente por chave)
const groqClients: Array<{ client: OpenAI; label: string }> = [
  ...(process.env.GROQ_API_KEY
    ? [{ client: new OpenAI({ baseURL: "https://api.groq.com/openai/v1", apiKey: process.env.GROQ_API_KEY }), label: "key1" }]
    : []),
  ...(process.env.GROQ_API_KEY_2
    ? [{ client: new OpenAI({ baseURL: "https://api.groq.com/openai/v1", apiKey: process.env.GROQ_API_KEY_2 }), label: "key2" }]
    : []),
];

// Compatibilidade com código legado que usa groqLlama diretamente (chatbot, verifier)
export const groqLlama = groqClients[0]?.client ?? new OpenAI({
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

// ─── TIER 2: MISTRAL (freemium — 128k contexto, 1B tokens/mês grátis) ────────
// Usa API OpenAI-compatível. Melhor modelo: mistral-large-latest (128k contexto).
const mistralClient = process.env.MISTRAL_API_KEY
  ? new OpenAI({
      baseURL: "https://api.mistral.ai/v1",
      apiKey: process.env.MISTRAL_API_KEY,
    })
  : null;

// ─── TIER 3: GITHUB MODELS (grátis via Azure inference — conta adm.lestebarbearia) ──
// Nota: limites de tokens por request — usa compact prompt.
// Endpoint OpenAI-compatível: https://models.inference.ai.azure.com
const githubModelsClient = process.env.GITHUB_MODELS_TOKEN
  ? new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: process.env.GITHUB_MODELS_TOKEN,
    })
  : null;

// ─── TIER 5: OPENAI (pago — último recurso antes de lançar erro) ─────────────
const openaiDirectClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export const MODELS = {
  chatbot: "llama-3.3-70b-versatile",
  adminIA: "llama-3.3-70b-versatile",
  blogGeneration: "gemini-2.5-flash",
  blogVerifier: "llama-3.3-70b-versatile",
} as const;

// ─── DEAD MODEL CACHE ─────────────────────────────────────────────────────────
// Persiste pelo lifetime da instância serverless (~5 min na Vercel).
// Evita retentar modelos confirmados descontinuados/inexistentes na mesma instância.
const deadModels = new Set<string>();

// ─── TIER 1: GEMINI CASCADE ───────────────────────────────────────────────────
// Modelos GA estáveis, contexto 1M tokens, sem cap de output tokens.
const GEMINI_MODELS = [
  "gemini-2.5-flash",      // GA jun/2025 — principal
  "gemini-2.5-flash-lite", // GA jul/2025 — backup leve
  "gemini-2.0-flash",      // GA — último backup Gemini
] as const;

// ─── TIER 2: MISTRAL CASCADE ──────────────────────────────────────────────────
// 128k contexto, prompt completo (sem truncamento necessário).
const MISTRAL_MODELS = [
  "mistral-large-latest",  // 128k ctx — melhor qualidade Mistral
] as const;

// ─── TIER 3: GITHUB MODELS CASCADE ───────────────────────────────────────────
// Modelos 70B+ com 128k contexto. Limites por request → usa compact prompt.
const GITHUB_MODELS_LIST = [
  "Meta-Llama-3.1-405B-Instruct", // 128k ctx — modelo mais poderoso grátis
  "Llama-3.3-70B-Instruct",       // 128k ctx — rápido e capaz
] as const;

// ─── TIER 4: GROQ CASCADE ─────────────────────────────────────────────────────
// Todos os modelos com 128k+ contexto. Compact prompt obrigatório (limite TPM).
// REMOVIDOS: llama3-70b-8192 (8k ctx) e llama-3.1-8b-instant (modelo pequeno).
const GROQ_FALLBACK_MODELS = [
  "llama-3.3-70b-versatile",                       // 128k ctx — 12k tokens/min
  "moonshotai/kimi-k2-instruct",                   // 1M ctx — Kimi K2, 10k tokens/min
  "meta-llama/llama-4-maverick-17b-128e-instruct", // 128k ctx — Llama 4 MoE
  "qwen/qwen3-32b",                                // 128k ctx — Qwen3 32B
] as const;

// Limites de chars para prompts Groq/GitHub/OpenAI (evita 413 TPM) — RN6
const GROQ_SYSTEM_MAX_CHARS = 12_000; // ≈ 3 000 tokens
const GROQ_USER_MAX_CHARS = 6_000;    // ≈ 1 500 tokens

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
 * 2. Mistral (mistral-large-latest — 128k ctx, freemium, prompt completo)
 * 3. GitHub Models (Llama 405B, Llama 3.3 70B — 128k ctx, compact prompt)
 * 4. Groq (llama-3.3-70b, kimi-k2, llama-4-maverick, qwen3-32b — 128k+ ctx, compact prompt)
 * 5. OpenAI gpt-4o-mini (pago — backup final, compact prompt)
 *
 * Todos os modelos têm 128k+ contexto. Modelos pequenos/baixo contexto removidos.
 *
 * @param compactSystemPrompt — versão reduzida do system prompt para tiers 3/4/5
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

  // Prompt compacto reutilizado pelos tiers 3/4/5 (GitHub Models, Groq, OpenAI)
  const compactSystem = safeTrim(
    extraOptions?.compactSystemPrompt ?? systemPrompt,
    GROQ_SYSTEM_MAX_CHARS
  );
  const compactUser = safeTrim(userPrompt, GROQ_USER_MAX_CHARS);

  // ── 2. MISTRAL CASCADE (128k ctx, prompt completo, freemium) ─────────────
  if (mistralClient) {
    for (const model of MISTRAL_MODELS) {
      if (deadModels.has(model)) {
        console.log(`[LLM] Pulando Mistral ${model} (marcado morto)`);
        continue;
      }
      try {
        console.log(`[LLM] Tentando Mistral: ${model}`);
        const response = await mistralClient.chat.completions.create({
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
        const raw = response.choices[0]?.message?.content;
        const validated = raw ? cleanAndValidateJson(raw, requireJson) : null;
        if (validated) {
          console.log(`[LLM] Sucesso: ${model} (Mistral)`);
          return { text: validated, model };
        } else if (raw) {
          console.warn(`[LLM] Mistral ${model} retornou JSON inválido — continuando cascade`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const errType = classifyError(err);
        if (errType === "dead") {
          deadModels.add(model);
          console.warn(`[LLM] Mistral ${model} MORTO: ${msg.slice(0, 100)}`);
        } else {
          console.warn(`[LLM] Mistral ${model} falhou [${errType}]: ${msg.slice(0, 120)}`);
        }
      }
    }
  }

  // ── 3. GITHUB MODELS CASCADE (128k ctx, compact prompt, grátis) ──────────
  if (githubModelsClient) {
    for (const model of GITHUB_MODELS_LIST) {
      if (deadModels.has(model)) {
        console.log(`[LLM] Pulando GitHub ${model} (marcado morto)`);
        continue;
      }
      try {
        console.log(`[LLM] Tentando GitHub Models: ${model}`);
        const response = await githubModelsClient.chat.completions.create({
          model,
          messages: [
            { role: "system", content: compactSystem },
            { role: "user", content: compactUser },
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
          console.log(`[LLM] Sucesso: ${model} (GitHub Models)`);
          return { text: validated, model };
        } else if (raw) {
          console.warn(`[LLM] GitHub ${model} retornou JSON inválido — continuando cascade`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const errType = classifyError(err);
        if (errType === "dead") {
          deadModels.add(model);
          console.warn(`[LLM] GitHub ${model} MORTO: ${msg.slice(0, 100)}`);
        } else {
          console.warn(`[LLM] GitHub ${model} falhou [${errType}]: ${msg.slice(0, 120)}`);
        }
      }
    }
  }

  // ── 4. GROQ CASCADE (modelo × chave1 → chave2, 128k+ ctx, compact prompt) ──
  // Rate limit por chave é independente — key2 assume quando key1 atinge 429/TPM.
  const groqMaxTokens = Math.min(maxTokens, 4000);

  if (groqClients.length > 0) {
    for (const model of GROQ_FALLBACK_MODELS) {
      const modelKey = `groq:${model}`;
      if (deadModels.has(modelKey)) {
        console.log(`[LLM] Pulando Groq ${model} (marcado morto em todas as chaves)`);
        continue;
      }
      let allKeysFailed = true;
      for (const { client, label } of groqClients) {
        const clientKey = `groq:${model}:${label}`;
        if (deadModels.has(clientKey)) continue;
        try {
          console.log(`[LLM] Tentando Groq: ${model} [${label}]`);
          const response = await client.chat.completions.create({
            model,
            messages: [
              { role: "system", content: compactSystem },
              { role: "user", content: compactUser },
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
            console.log(`[LLM] Sucesso: ${model} [${label}] (Groq)`);
            return { text: validated, model };
          } else if (raw) {
            console.warn(`[LLM] Groq ${model} [${label}] retornou JSON inválido — tentando próxima chave`);
          }
          allKeysFailed = false; // respondeu, mesmo que inválido
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          const errType = classifyError(err);
          if (errType === "dead") {
            // Modelo morto nesta chave — se ambas derem dead, marca o modelo inteiro
            deadModels.add(clientKey);
            console.warn(`[LLM] Groq ${model} [${label}] MORTO: ${msg.slice(0, 100)}`);
          } else if (errType === "size_limit") {
            // Rate limit nesta chave — tenta a próxima
            console.warn(`[LLM] Groq ${model} [${label}] rate limit [${label}]: ${msg.slice(0, 100)}`);
          } else {
            console.warn(`[LLM] Groq ${model} [${label}] falhou [${errType}]: ${msg.slice(0, 120)}`);
          }
        }
      }
      // Se todas as chaves deram dead para este modelo, marca o modelo como morto
      const allDead = groqClients.every(({ label }) => deadModels.has(`groq:${model}:${label}`));
      if (allDead) deadModels.add(modelKey);
      void allKeysFailed; // suprime lint
    }
  }

  // ── 5. OPENAI (pago — backup final antes de lançar erro) ──────────────────
  if (openaiDirectClient) {
    const oaiModels = ["gpt-4o-mini"] as const;
    for (const model of oaiModels) {
      try {
        console.log(`[LLM] Tentando OpenAI: ${model}`);
        const response = await openaiDirectClient.chat.completions.create({
          model,
          messages: [
            { role: "system", content: compactSystem },
            { role: "user", content: compactUser },
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
          console.warn(`[LLM] OpenAI ${model} retornou JSON inválido — sem mais fallbacks`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const errType = classifyError(err);
        console.warn(`[LLM] OpenAI ${model} falhou [${errType}]: ${msg.slice(0, 120)}`);
      }
    }
  }

  throw new Error(
    `Todos os modelos LLM falharam. Modelos mortos nesta instância: [${Array.from(deadModels).join(", ")}]. Tente novamente em alguns minutos.`
  );
}
