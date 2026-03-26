import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 90;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OBJETIVOS: Record<
  string,
  { label: string; descricao: string; urgencia: string }
> = {
  declaracao_simples: {
    label: "Declaração Anual IRPF 2026",
    descricao:
      "Captar clientes que precisam fazer a declaração IRPF 2026 (prazo: 29/05/2026). Perfil: assalariados, autônomos, MEIs, aposentados com renda tributável. Emoção dominante: procrastinação + medo de multa + confusão com os documentos.",
    urgencia:
      "Prazo é 29/05/2026. Faltam poucos dias. Multa mínima: R$ 165,74. Quem não declarar tem CPF em situação irregular.",
  },
  cpf_bloqueado: {
    label: "CPF Bloqueado / Irregular na Receita",
    descricao:
      "Captar pessoas com CPF bloqueado por falta de declaração. Consequências: não consegue abrir conta bancária, tirar passaporte, fazer financiamento, acessar benefícios governamentais. Dor máxima — problema que trava a vida.",
    urgencia:
      "CPF bloqueado impede acesso a serviços fundamentais. Cada dia sem resolver é mais prejuízo e mais constrangimento.",
  },
  declaracao_atrasada: {
    label: "IRPF Atrasado (Anos Anteriores)",
    descricao:
      "Captar pessoas que não declararam em 2022, 2023 ou 2024. Problema crescente: multa de 1% ao mês sobre imposto devido (mínimo R$ 165,74/ano, máximo 20%). Quem deve há 3 anos paga 36% a mais — urgência REAL e crescente.",
    urgencia:
      "Multa crescendo 1% ao mês sobre cada ano em atraso. Quanto mais tempo passa, mais caro fica. Agir agora = pagar menos.",
  },
  retificacao: {
    label: "Retificação / Declaração com Erro",
    descricao:
      "Captar clientes que entregaram a declaração com erro: valor errado, rendimento omitido, dedução incorreta. Risco real de malha fina, intimação e penalidades. Podem retificar espontaneamente em até 5 anos sem multa adicional.",
    urgencia:
      "Retificação espontânea não tem multa adicional. Esperar a Receita chamar = multa + processo administrativo.",
  },
  malha_fina: {
    label: "Malha Fina — Sair da Pendência",
    descricao:
      "Captar clientes que caíram na malha fina da Receita Federal. A Receita identificou divergência e reteve o processamento. Risco: intimação formal (auto de infração) com multa pesada. Situação urgente e delicada.",
    urgencia:
      "Malha fina pode virar auto de infração a qualquer momento. Cada dia sem resolver aumenta o risco e a multa potencial.",
  },
};

const diasRestantes = Math.ceil(
  (new Date("2026-05-29").getTime() - Date.now()) / 86400000
);

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
      return NextResponse.json(
        { error: "objetivo e plataforma são obrigatórios" },
        { status: 400 }
      );
    }

    const obj = OBJETIVOS[objetivo] ?? {
      label: objetivo,
      descricao: objetivo,
      urgencia: "",
    };

    const prompt = `Crie campanha COMPLETA e PROFISSIONAL para ${plataforma}.

OBJETIVO DE NEGÓCIO: ${obj.label}
PÚBLICO-ALVO: ${obj.descricao}
URGÊNCIA: ${obj.urgencia}
DATA ATUAL: ${new Date().toLocaleDateString("pt-BR")}
DIAS ATÉ O PRAZO IRPF: ${diasRestantes}

Retorne JSON com EXATAMENTE esta estrutura (todos os campos obrigatórios, sem pular nenhum):

{
  "campanha": {
    "nome": "string — nome da campanha",
    "objetivo": "string — objetivo de negócio em 1 frase clara",
    "plataforma": "${plataforma}",
    "publicoAlvo": {
      "descricao": "string — perfil detalhado do público ideal para esta campanha",
      "faixaEtaria": "string — ex: 28-55 anos",
      "interesses": ["string — interesses específicos para segmentar na ${plataforma}"],
      "comportamentos": ["string — comportamentos e características deste público"],
      "localizacao": "Brasil — todas as regiões (serviço 100% online)",
      "renda": "string — faixa de renda e perfil econômico do público"
    },
    "orcamentoSugerido": {
      "faseTeste": "string — ex: R$ 30/dia por 7-14 dias (R$ 210-420 total)",
      "faseEscala": "string — quando e como escalar após validação do CPL",
      "diario": "string — valor diário na fase de teste",
      "mensal": "string — projeção mensal na fase de escala",
      "cpcEstimado": "string — custo por clique estimado para ${plataforma}",
      "cplEstimado": "string — custo por lead estimado"
    }
  },
  "criativos": [
    {
      "id": "A",
      "angulo": "string — ex: Urgência/Prazo, Dor/Medo, Benefício/Praticidade",
      "porqueEsteAngulo": "string — por que este ângulo converte para este público específico",
      "headline": "string — headline principal (máx 30 chars Google, 40 Meta/LinkedIn)",
      "headline2": "string — variação persuasiva",
      "headline3": "string — variação com abordagem diferente",
      "descricao1": "string — (máx 90 chars Google, 125 Meta)",
      "descricao2": "string — variação mais emocional",
      "textoLongo": "string — copy completa 3-5 parágrafos persuasivos: hook + problema + solução + prova + CTA",
      "cta": "string — ex: Falar no WhatsApp Agora",
      "urlDestino": "https://irpf.qaplay.com.br",
      "emojis": "string — 2-3 emojis relevantes para Meta"
    },
    {
      "id": "B",
      "angulo": "string — ângulo diferente de A (ex: Benefício/Economia)",
      "porqueEsteAngulo": "string",
      "headline": "string",
      "headline2": "string",
      "headline3": "string",
      "descricao1": "string",
      "descricao2": "string",
      "textoLongo": "string",
      "cta": "string",
      "urlDestino": "https://api.whatsapp.com/send?phone=5511940825120&text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20com%20minha%20declara%C3%A7%C3%A3o%20de%20IRPF",
      "emojis": "string"
    },
    {
      "id": "C",
      "angulo": "string — ângulo diferente (ex: Prova Social/Autoridade)",
      "porqueEsteAngulo": "string",
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
      { "texto": "string — máx 25 chars", "descricao": "string — máx 35 chars", "url": "string" }
    ],
    "callouts": ["string — frase curta destacando diferencial, máx 25 chars"],
    "snippets": { "header": "Serviços", "valores": ["string — serviço oferecido"] }
  },
  "segmentacaoAvancada": {
    "palavrasChaveExatas": ["string"],
    "palavrasChaveFrase": ["string"],
    "palavrasNegativas": ["string"],
    "publicosCustomizados": ["string — nome do público personalizado a criar na plataforma"],
    "retargeting": "string — estratégia completa de retargeting para este objetivo"
  },
  "guiaCriacao": {
    "resumo": "string — o que será criado e por que esta estratégia funciona para captar clientes",
    "tempoPrevisto": "string — ex: 2-3 horas para configurar, 72h para ter primeiros dados",
    "passos": [
      {
        "numero": 1,
        "titulo": "string — ação concisa",
        "onde": "string — URL exata ou caminho na plataforma (ex: ads.google.com > Nova campanha)",
        "instrucao": "string — instrução completa e clara do que fazer neste passo, incluindo configurações",
        "dica": "string — dica profissional que faz diferença neste passo",
        "alerta": "string — erro comum a evitar (deixe vazio se não houver)"
      }
    ],
    "errosComuns": ["string — erro específico que desperdiça dinheiro nesta plataforma"],
    "orcamentoEstrategia": {
      "fase1Titulo": "Fase 1 — Teste e Validação",
      "fase1Descricao": "string — o que fazer e o que medir na fase de teste",
      "fase1Duracao": "string — ex: 7-14 dias",
      "fase1Valor": "string — investimento total nesta fase",
      "fase2Titulo": "Fase 2 — Escala",
      "fase2Descricao": "string — como e quando aumentar o investimento",
      "fase2Gatilho": "string — métricas que indicam hora de escalar",
      "fase2Valor": "string — investimento mensal projetado na escala"
    },
    "kpis": [
      {
        "metrica": "string — nome da métrica",
        "meta": "string — meta ideal ex: CTR > 3%",
        "frequencia": "string — quando verificar ex: diariamente após 72h",
        "oQueSignifica": "string — explicação simples do que esta métrica mede",
        "comoMelhorar": "string — o que fazer se a métrica estiver abaixo da meta"
      }
    ]
  },
  "mensagemWhatsApp": {
    "textoTemplate": "string — mensagem COMPLETA para responder leads que entram pelo WhatsApp. Use [NOME] como placeholder. Deve ser acolhedora, profissional e levar à conversão",
    "comoUsar": "string — quando e como enviar esta mensagem",
    "variacoes": ["string — variação 1 mais curta", "string — variação 2 com urgência"]
  },
  "landingPageCopy": {
    "headline": "string — título principal da landing page (máx 10 palavras, direto na dor)",
    "subheadline": "string — complemento do headline explicando o diferencial",
    "bullets": ["string — benefício/diferencial específico do serviço"],
    "prova": "string — prova social ou garantia a destacar",
    "urgencia": "string — elemento de urgência (prazo, vagas limitadas, etc.)",
    "cta": "string — texto do botão principal",
    "ctaSecundario": "string — CTA alternativo ex: Falar no WhatsApp"
  },
  "checklist1aSemana": [
    {
      "dia": "Dia 1",
      "tarefas": ["string — tarefa específica com instrução clara do que fazer"]
    },
    {
      "dia": "Dias 2-3",
      "tarefas": ["string"]
    },
    {
      "dia": "Dias 4-7",
      "tarefas": ["string"]
    }
  ],
  "promptImagemDalle": "string — prompt detalhado em inglês para DALL-E 3 HD gerar imagem editorial fotorrealista para este anúncio. Especifique câmera (Canon 5D Mark IV), lente (50mm f/1.8), iluminação (natural window light), composição, elementos visuais relacionados a declaração fiscal/IRPF/documentos/finanças brasileiras. Estilo editorial de revista financeira premium. SEM pessoas olhando para câmera. SEM texto na imagem. SEM computador ou celular na cena."
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Você é um gestor de tráfego pago sênior especializado em serviços financeiros no Brasil, com 15 anos de experiência gerando leads qualificados para consultores fiscais e contadores.

MISSÃO: Criar uma campanha COMPLETA que o Nilson Brites possa implementar do zero, mesmo sem conhecimento técnico em marketing digital. Cada passo deve ser tão claro que qualquer pessoa consiga seguir.

NEGÓCIO:
- Nilson Brites — Analista Financeiro, 10+ anos, especialista IRPF
- Serviço: Declaração IRPF (novas, atrasadas, retificações, malha fina)
- 100% online, todo Brasil
- WhatsApp: +55 11 94082-5120 | Site: irpf.qaplay.com.br

REGRAS DE COPY:
1. Baseada em dor REAL e urgência REAL — nunca alarmismo fabricado
2. Proibido prometer restituição garantida ou resultado fiscal específico
3. Linguagem próxima, direta, sem juridiquês
4. CTA sempre para WhatsApp ou site
5. Orçamentos REALISTAS para autônomo iniciando

Retorne APENAS JSON válido. Cuidado extra com aspas dentro de strings.`,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.35,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const campanha = JSON.parse(raw);

    // Salvar no banco
    try {
      await prisma.campanhaGerada.create({
        data: {
          nome: String(campanha.campanha?.nome ?? `${obj.label} — ${plataforma}`).slice(0, 500),
          objetivo,
          plataforma,
          dados: raw,
        },
      });
    } catch (dbErr) {
      console.error("[campanhas] DB save error:", dbErr);
    }

    return NextResponse.json({ success: true, campanha });
  } catch (err) {
    console.error("[campanhas]", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


