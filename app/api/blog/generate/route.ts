import { NextRequest, NextResponse } from "next/server";
import { decode, getToken } from "next-auth/jwt";
import { generateBlogPost, saveBlogPost } from "@/lib/blog-engine";
import { revalidatePath } from "next/cache";
import { getBlogLlmProviderStatus } from "@/lib/llm-providers";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Vercel Pro: até 300s (geração Gemini + pesquisa + verificação)

type GenerateBlogBody = {
  keyword?: unknown;
  theme?: unknown;
};

type BlogCategoria = "IRPF" | "MEI" | "DESENROLA" | "GERAL";

const DEFAULT_BLOG_THEMES = [
  "Declaração de IRPF",
  "Declaração de IRPF atrasado",
  "Declaração Anual MEI",
  "CPF com pendência",
  "Regularização de MEI",
  "Emissão de nota fiscal para MEI",
  "Parcelamento de dívida MEI",
] as const;

// Timeout total da função: 240s (margem de 60s antes de maxDuration=300s).
// O Gemini usa 22s por tentativa → até 6 tentativas = 132s + margem para verifier/Groq.
const GENERATE_TIMEOUT_MS = 240_000;
const GENERATE_TIMEOUT_MESSAGE =
  "A geração do post demorou além do esperado. Tente novamente em alguns instantes.";

function pickDefaultTheme(): string {
  return (
    DEFAULT_BLOG_THEMES[
      Math.floor(Math.random() * DEFAULT_BLOG_THEMES.length)
    ] ?? DEFAULT_BLOG_THEMES[0]
  );
}

function normalizeThemeInput(body: GenerateBlogBody): string {
  const rawValue =
    typeof body.theme === "string"
      ? body.theme
      : typeof body.keyword === "string"
        ? body.keyword
        : "";

  return rawValue.trim();
}

async function resolveRequestToken(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;

  const primary = await getToken({ req: request, secret });
  if (primary) return primary;
  if (!secret) return null;

  const authHeader = request.headers.get("authorization") || "";
  const rawAuthToken = authHeader.replace(/^bearer\s+/i, "").trim();
  const rawHeaderToken = (request.headers.get("x-nextauth-token") || "").trim();
  const rawCookieSecure = (request.cookies.get("__Secure-next-auth.session-token")?.value || "").trim();
  const rawCookiePlain = (request.cookies.get("next-auth.session-token")?.value || "").trim();

  const candidates = [rawAuthToken, rawHeaderToken, rawCookieSecure, rawCookiePlain].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const decoded = await decode({ token: candidate, secret });
      if (decoded) return decoded;
    } catch {
      // Ignore candidate parse errors and continue to the next source.
    }
  }

  return null;
}

function resolveCategoriaFromTheme(theme: string): BlogCategoria {
  const normalized = theme
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (
    normalized.includes("mei") ||
    normalized.includes("dasn") ||
    normalized.includes("nota fiscal")
  ) {
    return "MEI";
  }

  if (
    normalized.includes("cpf") ||
    normalized.includes("parcelamento") ||
    normalized.includes("divida") ||
    normalized.includes("regularizacao")
  ) {
    return normalized.includes("mei") ? "MEI" : "DESENROLA";
  }

  return "IRPF";
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string,
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function formatProviderName(provider: string): string {
  switch (provider) {
    case "gemini":
      return "Gemini";
    case "mistral":
      return "Mistral";
    case "githubModels":
      return "GitHub Models";
    case "groq":
      return "Groq";
    case "openai":
      return "OpenAI";
    default:
      return provider;
  }
}

function detectProvider(
  details: string,
  providerStatus: ReturnType<typeof getBlogLlmProviderStatus>,
): string | undefined {
  const normalized = details.toLowerCase();

  if (normalized.includes("gemini")) return "Gemini";
  if (
    normalized.includes("groq") ||
    normalized.includes("llama") ||
    normalized.includes("qwen") ||
    normalized.includes("kimi")
  ) {
    return "Groq";
  }
  if (normalized.includes("mistral")) return "Mistral";
  if (normalized.includes("github")) return "GitHub Models";
  if (normalized.includes("openai") || normalized.includes("gpt-4o")) {
    return "OpenAI";
  }

  const configured = Object.entries(providerStatus)
    .filter(([, isConfigured]) => isConfigured)
    .map(([provider]) => formatProviderName(provider));

  if (configured.length === 1) return configured[0];
  if (configured.length > 1) return "cadeia de fallback de IA";
  return undefined;
}

function mapGenerationError(
  error: unknown,
  providerStatus: ReturnType<typeof getBlogLlmProviderStatus>,
) {
  const details = error instanceof Error ? error.message : String(error);
  const normalized = details.toLowerCase();
  const provider = detectProvider(details, providerStatus);

  if (
    normalized.includes("fora do escopo") ||
    normalized.includes("keyword bloqueada")
  ) {
    return {
      status: 400,
      code: "INVALID_THEME",
      provider,
      publicMessage: details,
      details,
    };
  }

  if (normalized.includes("conteudo_sem_link_amazon")) {
    return {
      status: 400,
      code: "MISSING_AMAZON_LINK",
      provider,
      publicMessage:
        "Geração bloqueada: o conteúdo precisa conter link Amazon afiliado para ser criado.",
      details,
    };
  }

  if (
    normalized.includes(GENERATE_TIMEOUT_MESSAGE.toLowerCase()) ||
    normalized.includes("timeout")
  ) {
    return {
      status: 504,
      code: "LLM_TIMEOUT",
      provider,
      publicMessage:
        "Não foi possível gerar o post agora. O provedor de IA demorou além do esperado. Tente novamente em alguns instantes.",
      details,
    };
  }

  if (
    normalized.includes("api key") ||
    normalized.includes("authentication") ||
    normalized.includes("forbidden") ||
    normalized.includes("permission") ||
    normalized.includes("401") ||
    normalized.includes("403")
  ) {
    return {
      status: 503,
      code: "LLM_AUTH_ERROR",
      provider,
      publicMessage: provider
        ? `Não foi possível gerar o post agora. Verifique a chave de API do ${provider}.`
        : "Não foi possível gerar o post agora. Verifique as chaves de API configuradas.",
      details,
    };
  }

  if (
    normalized.includes("429") ||
    normalized.includes("rate limit") ||
    normalized.includes("quota") ||
    normalized.includes("tokens per") ||
    normalized.includes("tpm") ||
    normalized.includes("rpm") ||
    normalized.includes("exceeded")
  ) {
    return {
      status: 429,
      code: "LLM_RATE_LIMIT",
      provider,
      publicMessage: provider
        ? `Não foi possível gerar o post agora. O ${provider} atingiu o limite de uso ou cota.`
        : "Não foi possível gerar o post agora. O provedor de IA atingiu o limite de uso ou cota.",
      details,
    };
  }

  if (
    normalized.includes("nenhum provedor llm configurado") ||
    normalized.includes("todos os modelos llm falharam")
  ) {
    return {
      status: 503,
      code: "LLM_UNAVAILABLE",
      provider,
      publicMessage:
        "Não foi possível gerar o post agora. Os provedores de IA falharam ou estão indisponíveis no momento.",
      details,
    };
  }

  return {
    status: 500,
    code: "BLOG_GENERATION_ERROR",
    provider,
    publicMessage:
      "Não foi possível gerar o post agora. Verifique sua chave de API ou tente novamente em alguns instantes.",
    details,
  };
}

export async function POST(request: NextRequest) {
  const providerStatus = getBlogLlmProviderStatus();

  try {
    const token = await resolveRequestToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as
      | GenerateBlogBody
      | null;
    const normalizedBody =
      body && typeof body === "object" ? body : ({} as GenerateBlogBody);
    const requestedTheme = normalizeThemeInput(normalizedBody);
    const resolvedTheme = requestedTheme || pickDefaultTheme();

    if (!Object.values(providerStatus).some(Boolean)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Não foi possível gerar o post agora. Nenhum provedor de IA está configurado no servidor.",
          code: "LLM_NOT_CONFIGURED",
          details:
            process.env.NODE_ENV === "development"
              ? "Configure GEMINI_API_KEY, GROQ_API_KEY, OPENAI_API_KEY, MISTRAL_API_KEY ou GITHUB_MODELS_TOKEN."
              : undefined,
        },
        { status: 503 },
      );
    }

    const post = await withTimeout(
      generateBlogPost(undefined, resolvedTheme),
      GENERATE_TIMEOUT_MS,
      GENERATE_TIMEOUT_MESSAGE,
    );
    const categoria = resolveCategoriaFromTheme(post.keyword || resolvedTheme);
    const saved = await saveBlogPost(post, categoria);

    revalidatePath("/blog");
    revalidatePath(`/blog/${saved.slug}`);

    return NextResponse.json({
      success: true,
      pending: !saved.published,
      reviewLevel: saved.published ? "baixo" : "alto",
      requestedTheme: requestedTheme || null,
      themeUsed: post.keyword || resolvedTheme,
      categoria,
      post: {
        id: saved.id,
        title: saved.title,
        slug: saved.slug,
        published: saved.published,
      },
    });
  } catch (error) {
    const mapped = mapGenerationError(error, providerStatus);
    console.error("[api/blog/generate] Blog generate error:", {
      code: mapped.code,
      provider: mapped.provider,
      details: mapped.details,
      providerStatus,
    });

    return NextResponse.json(
      {
        success: false,
        error: mapped.publicMessage,
        code: mapped.code,
        provider: mapped.provider,
        details:
          process.env.NODE_ENV === "development" ? mapped.details : undefined,
      },
      { status: mapped.status },
    );
  }
}
