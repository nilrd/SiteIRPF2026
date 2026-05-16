import { callWithFallback } from "@/lib/llm-providers";
import { IRPF_DATA_CONTEXT } from "@/lib/irpf-context";

export type FactCheckInput = {
  title: string;
  summary?: string;
  content: string;
  keyword?: string;
};

export type FactCheckResult = {
  factScore: number | null;
  riskScore: number | null;
  issues: string[];
  needsReview: boolean;
  autoPublish: boolean;
  verifierModel: string;
  fallbackReason?: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function isSensitiveFiscalTopic(input: FactCheckInput): boolean {
  const text =
    `${input.title} ${input.summary ?? ""} ${input.keyword ?? ""} ${input.content}`.toLowerCase();
  return /irpf|imposto de renda|receita federal|malha fina|multa|atrasad|prazo|cpf bloquead|cpf pendente|restituicao|retificacao|obrigad/.test(
    text,
  );
}

export function fallbackFactCheckOnFailure(
  input: FactCheckInput,
  reason: string,
): FactCheckResult {
  const sensitive = isSensitiveFiscalTopic(input);
  const riskScore = sensitive ? 85 : 55;

  return {
    factScore: null,
    riskScore,
    issues: [
      "Falha no verifyIRPFPost: excecao, timeout ou indisponibilidade do verificador.",
      "Conteudo direcionado para revisao manual antes de publicar.",
      `Detalhe tecnico: ${reason.slice(0, 220)}`,
    ],
    needsReview: true,
    autoPublish: !sensitive && riskScore < 60,
    verifierModel: "fallback-on-error",
    fallbackReason: reason,
  };
}

export async function verifyIRPFPost(
  input: FactCheckInput,
): Promise<FactCheckResult> {
  const content = input.content.slice(0, 16_000);

  const systemPrompt = [
    "Voce e um verificador fiscal estrito para conteudo IRPF no Brasil.",
    "Responda apenas JSON valido com os campos: factScore, riskScore, issues, needsReview, autoPublish.",
    "Nunca invente dados.",
    "Regras de seguranca:",
    "- factScore 0-100; riskScore 0-100.",
    "- needsReview=true se houver qualquer incerteza factual.",
    "- autoPublish=true somente quando factScore>=70 e riskScore<=40.",
    "- Marque risco alto quando houver promessa absoluta (garantido, certeza, 100%).",
    "- Marque risco alto se confundir CPF bloqueado com IRPF atrasado.",
    "- Marque risco alto se houver datas ou multas inventadas.",
    "Contexto oficial para conferencias:",
    IRPF_DATA_CONTEXT,
  ].join("\n");

  const userPrompt = [
    `TITULO: ${input.title}`,
    `RESUMO: ${input.summary ?? ""}`,
    `KEYWORD: ${input.keyword ?? ""}`,
    "CONTEUDO:",
    content,
  ].join("\n\n");

  try {
    const result = await callWithFallback(systemPrompt, userPrompt, 900, {
      temperature: 0.1,
      response_format: { type: "json_object" },
      compactSystemPrompt:
        "Verifique fatos IRPF 2026 com foco em prazos, multas, obrigatoriedade e promessas indevidas. Retorne JSON.",
    });

    const parsed = JSON.parse(result.text) as {
      factScore?: number;
      riskScore?: number;
      issues?: string[];
      needsReview?: boolean;
      autoPublish?: boolean;
    };

    const factScore = clamp(parsed.factScore ?? 0, 0, 100);
    const riskScore = clamp(parsed.riskScore ?? 100, 0, 100);
    const issues = Array.isArray(parsed.issues)
      ? parsed.issues.map((item) => String(item))
      : [];
    const needsReview =
      Boolean(parsed.needsReview) || factScore < 70 || riskScore > 40;
    const autoPublish =
      Boolean(parsed.autoPublish) &&
      factScore >= 70 &&
      riskScore <= 40 &&
      !needsReview;

    return {
      factScore,
      riskScore,
      issues,
      needsReview,
      autoPublish,
      verifierModel: result.model,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return fallbackFactCheckOnFailure(input, reason);
  }
}
