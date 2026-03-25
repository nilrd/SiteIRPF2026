import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OBJETIVOS: Record<string, string> = {
  declaracao_simples: "Captar clientes que precisam fazer a declaração anual do IRPF (prazo abril/maio). Perfil: assalariados, aposentados, profissionais liberais.",
  cpf_bloqueado: "Captar clientes com CPF bloqueado/irregular na Receita Federal por falta de declaração. Problema urgente — bloqueio bancário, problemas em cartórios, passaporte.",
  declaracao_atrasada: "Captar clientes com declarações atrasadas de anos anteriores. Problema: multa crescente + CPF irregular. Urgente regularizar.",
  retificacao: "Captar clientes com erro na declaração já entregue (malha fina ou declaração incorreta). Precisam retificar antes de sofrer penalidades.",
  malha_fina: "Captar clientes que caíram na malha fina da Receita Federal e precisam resolver pendências.",
};

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { objetivo, plataforma } = (await req.json()) as {
      objetivo: string;
      plataforma: string;
    };

    if (!objetivo || !plataforma) {
      return NextResponse.json({ error: "objetivo e plataforma são obrigatórios" }, { status: 400 });
    }

    const descricaoObjetivo = OBJETIVOS[objetivo] ?? objetivo;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Você é um especialista sênior em tráfego pago para serviços financeiros no Brasil.
Crie campanhas de alta conversão para declaração de IRPF.

NEGÓCIO:
- Serviço: Declaração IRPF (novas, atrasadas, retificações, malha fina)
- Atendimento: 100% online, todo Brasil
- Profissional: Nilson Brites, analista financeiro com 10+ anos de experiência
- WhatsApp: +55 11 94082-5120
- Site: irpf.qaplay.com.br
- Diferencial: Sem burocracia, sem ir a um escritório, resultado rápido

REGRAS DE COPY:
- Linguagem: direta, sem juridiquês, próxima do cliente
- Tom: urgência real, não alarmismo falso
- CTA sempre: WhatsApp ou site
- Proibido: prometer resultado garantido de restituição
- Números reais quando possível (prazo: até 30/04/2026, multa mínima: R$ 165,74)

Retorne SOMENTE JSON válido com a estrutura completa.`,
        },
        {
          role: "user",
          content: `Crie uma campanha completa para ${plataforma}.

OBJETIVO: ${descricaoObjetivo}

Retorne JSON com esta estrutura exata:
{
  "campanha": {
    "nome": "string",
    "objetivo": "string",
    "plataforma": "${plataforma}",
    "publicoAlvo": {
      "descricao": "string",
      "faixaEtaria": "string",
      "interesses": ["string"],
      "comportamentos": ["string"],
      "localizacao": "string",
      "renda": "string"
    },
    "orcamentoSugerido": {
      "diario": "string",
      "mensal": "string",
      "cpcEstimado": "string",
      "cplEstimado": "string"
    }
  },
  "criativos": [
    {
      "id": "A",
      "tipo": "principal",
      "headline": "string — max 30 chars se Google, max 40 se Meta/LinkedIn",
      "headline2": "string — variação do headline",
      "headline3": "string — outra variação",
      "descricao1": "string — max 90 chars se Google, max 125 se Meta",
      "descricao2": "string — variação da descrição",
      "textoLongo": "string — copy completa para body do anúncio (Meta/LinkedIn), 3-5 linhas",
      "cta": "string — ex: Falar no WhatsApp, Declarar Agora, Regularizar CPF",
      "urlDestino": "https://irpf.qaplay.com.br",
      "emojis": "string — emojis relevantes para usar no início do copy Meta/LinkedIn"
    },
    {
      "id": "B",
      "tipo": "variacao_a",
      "headline": "string",
      "headline2": "string",
      "headline3": "string",
      "descricao1": "string",
      "descricao2": "string",
      "textoLongo": "string",
      "cta": "string",
      "urlDestino": "https://api.whatsapp.com/send?phone=5511940825120&text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20preciso%20de%20ajuda%20com%20minha%20declara%C3%A7%C3%A3o%20de%20IRPF",
      "emojis": "string"
    },
    {
      "id": "C",
      "tipo": "variacao_b",
      "headline": "string",
      "headline2": "string",
      "headline3": "string",
      "descricao1": "string",
      "descricao2": "string",
      "textoLongo": "string",
      "cta": "string",
      "urlDestino": "https://irpf.qaplay.com.br",
      "emojis": "string"
    }
  ],
  "extensoes": {
    "sitelinks": [
      { "texto": "string — max 25 chars", "descricao": "string — max 35 chars", "url": "string" }
    ],
    "callouts": ["string — max 25 chars cada"],
    "snippets": { "header": "string", "valores": ["string"] }
  },
  "segmentacaoAvancada": {
    "palavrasChaveExatas": ["string"],
    "palavrasChaveFrase": ["string"],
    "palavrasNegativas": ["string"],
    "publicosCustomizados": ["string"],
    "retargeting": "string"
  },
  "promptImagemDalle": "string — prompt em inglês para gerar imagem editorial fotorrealista para este ad no DALL-E 3, especificando câmera, lente, iluminação, objetos específicos de IRPF/declaração, SEM pessoas olhando para câmera"
}`,
        },
      ],
      temperature: 0.4,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const campanha = JSON.parse(raw);

    return NextResponse.json({ success: true, campanha });
  } catch (err) {
    console.error("[campanhas]", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
