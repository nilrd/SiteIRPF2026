# AGENTE: API ROUTES + EMAIL + AUTOMAÇÕES

## Objetivo
Criar todas as rotas de API, integração com Resend para emails, e sistema de cron para auto-blog.

---

## ARQUIVO: `lib/resend.ts`

```typescript
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
export const FROM = process.env.FROM_EMAIL || "onboarding@resend.dev";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
```

---

## ARQUIVO: `lib/openai.ts`

```typescript
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

---

## ARQUIVO: `app/api/contato/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { resend, FROM, ADMIN_EMAIL } from "@/lib/resend";

const schema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  assunto: z.string().min(3).max(200),
  mensagem: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Salvar no banco
    await prisma.contato.create({ data });

    // Email para admin
    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `[IRPF Site] Novo contato: ${data.assunto}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h2 style="color:#0A0A0A;margin-bottom:24px;">Novo contato recebido</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#666;width:120px;">Nome</td><td style="padding:8px 0;font-weight:600;">${data.nome}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;">${data.email}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">WhatsApp</td><td style="padding:8px 0;">${data.whatsapp || "Não informado"}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Assunto</td><td style="padding:8px 0;">${data.assunto}</td></tr>
          </table>
          <div style="background:#f5f5f2;padding:16px;margin-top:16px;border-radius:4px;">
            <p style="color:#333;line-height:1.6;">${data.mensagem}</p>
          </div>
          ${data.whatsapp ? `<a href="https://wa.me/55${data.whatsapp.replace(/\D/g, '')}" style="display:inline-block;margin-top:20px;background:#25D366;color:white;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:600;">Responder no WhatsApp</a>` : ""}
        </div>
      `,
    });

    // Email confirmação para o usuário
    await resend.emails.send({
      from: FROM,
      to: data.email,
      subject: "Recebemos seu contato — Nilson Brites IRPF",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h2 style="color:#0A0A0A;">Olá, ${data.nome}!</h2>
          <p style="color:#555;line-height:1.7;margin:16px 0;">Recebi sua mensagem e entrarei em contato em breve.</p>
          <p style="color:#555;line-height:1.7;">Para agilizar, pode me chamar diretamente no WhatsApp:</p>
          <a href="https://wa.me/5511940825120" style="display:inline-block;margin-top:16px;background:#0A0A0A;color:#C6FF00;padding:12px 24px;border-radius:2px;text-decoration:none;font-weight:700;">Falar no WhatsApp →</a>
          <p style="color:#999;font-size:12px;margin-top:32px;">Nilson Brites · irpf.qaplay.com.br</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Contato API error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
```

---

## ARQUIVO: `app/api/leads/route.ts`

```typescript
// Mesmo padrão do contato, mas salva em Lead e tem campo tipoDecl + origem
// Email para admin: "Novo lead: [nome] — [tipoDecl]"
// Não enviar email de confirmação para o lead (ele vai receber pelo WhatsApp)
```

---

## ARQUIVO: `app/api/ebook/route.ts`

```typescript
// 1. Salva em EbookDownload
// 2. Envia email com PDF anexo ou link
// 3. Agenda sequência de 3 emails (implementar com campo emailSeq)

// Email 1 (imediato): "Seu Guia IRPF 2025 chegou"
// Email 2 (criar endpoint separado para reenviar após 2 dias)
// Email 3 (após 4 dias): oferta de serviço
```

---

## ARQUIVO: `app/api/blog/generate/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

const SYSTEM_PROMPT = `Você é Nilson Brites, Analista Financeiro com 10 anos de experiência em IRPF.
Escreva posts de blog em português brasileiro, educativos e precisos.

REGRAS ABSOLUTAS:
- Use APENAS legislação brasileira vigente e valores reais de 2025
- Tabela IRPF 2025: até R$24.511,92 isento; até R$33.919,80: 7,5%; até R$45.012,60: 15%; até R$55.976,16: 22,5%; acima: 27,5%
- Dedução por dependente: R$2.275,08/ano
- Prazo declaração 2025: 31 de maio de 2025
- Mínimo 1.500 palavras
- Use H2 e H3 para estrutura hierárquica
- Inclua tabelas quando relevante
- CTA no meio: "Precisa de ajuda? <a href='https://wa.me/5511940825120'>Fale com Nilson no WhatsApp</a>"
- CTA no final: mesma chamada
- Terminar com: ## Perguntas Frequentes (5 perguntas e respostas para Schema FAQ)
- Tom: especialista acessível, direto, sem juridiquês
- Formato de saída: JSON puro com campos: titulo, slug, resumo, conteudo (HTML), tags (array), metaTitle, metaDesc, keywords (array), readTime`;

export async function POST(req: NextRequest) {
  try {
    // Verificar se é chamada interna (cron) ou do admin
    const { keyword, isAdmin } = await req.json();

    if (!isAdmin) {
      const authHeader = req.headers.get("authorization");
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Escreva um post completo sobre: "${keyword}"` },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content!;
    const postData = JSON.parse(raw);

    // Verificar se slug já existe
    const existingSlug = await prisma.blogPost.findUnique({
      where: { slug: postData.slug },
    });

    const slug = existingSlug
      ? `${postData.slug}-${Date.now()}`
      : postData.slug;

    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        slug,
        autorIA: true,
        publicado: false, // Admin revisa antes de publicar
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Blog generate error:", error);
    return NextResponse.json({ error: "Erro ao gerar post" }, { status: 500 });
  }
}
```

---

## ARQUIVO: `app/api/cron/blog-auto/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

// Keywords em fila rotativa para geração automática
const KEYWORDS_QUEUE = [
  "declaração ir aposentado 2025",
  "documentos necessários declaração ir",
  "como declarar aluguel imposto de renda",
  "irpf autônomo MEI 2025",
  "restituição imposto de renda quando cai",
  "declaração ir dependente filho",
  "prazo declaração ir 2025",
  "malha fina imposto de renda como sair",
  "retificar declaração ir passo a passo",
  "declaração ir primeira vez guia completo",
  "irpf atrasado multa calculo 2025",
  "deduções imposto de renda o que pode deduzir",
];

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Pegar semana atual para escolher keyword
    const weekOfYear = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % KEYWORDS_QUEUE.length;
    const keyword = KEYWORDS_QUEUE[weekOfYear];
    const keywordSecundaria = KEYWORDS_QUEUE[(weekOfYear + 1) % KEYWORDS_QUEUE.length];

    // Gerar 2 posts
    const results = await Promise.allSettled([
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
        body: JSON.stringify({ keyword }),
      }),
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
        body: JSON.stringify({ keyword: keywordSecundaria }),
      }),
    ]);

    return NextResponse.json({
      success: true,
      postsGerados: results.filter((r) => r.status === "fulfilled").length,
    });
  } catch (error) {
    return NextResponse.json({ error: "Cron error" }, { status: 500 });
  }
}
```

---

## ARQUIVO: `app/api/admin/ai/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { openai } from "@/lib/openai";

const ADMIN_CONTEXT = `Você é assistente de marketing e negócios do Nilson Brites.
SOBRE O NEGÓCIO:
- Serviço: Declaração IRPF (nova, atrasada, retificação, dependentes)
- Diferencial: preço abaixo do mercado, suporte 1 ano, entrega 24h
- Atendimento: 100% WhatsApp, todo Brasil remotamente
- Capacidade: 400+ clientes/mês
- Experiência: 10 anos como Analista Financeiro
- Site: irpf.qaplay.com.br | WhatsApp: +5511940825120
- Época de pico: fevereiro a maio (prazo da Receita Federal)

Você ajuda com: análise de leads, campanhas publicitárias, email marketing, estratégias de crescimento e conteúdo para redes sociais.
Responda sempre em português brasileiro.`;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messages } = await req.json();

  // Streaming response
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: ADMIN_CONTEXT },
      ...messages,
    ],
    stream: true,
    temperature: 0.8,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

---

## ARQUIVO: `app/api/admin/campanhas/route.ts`

```typescript
// Recebe: { plataforma, objetivo, budget, prazo, briefing }
// Retorna: campanha completa gerada pelo GPT-4o

// Prompts por plataforma:
const PLATAFORMA_PROMPTS = {
  facebook: "Crie uma campanha completa para Facebook/Instagram Ads incluindo: público-alvo detalhado por idade/interesse/comportamento, 3 variações de criativo com copy (headline 40 chars, texto principal 125 chars, CTA), sugestão de formato (carrossel/stories/feed), budget distribution e período.",
  google: "Crie uma campanha RSA para Google Ads incluindo: 5 headlines (30 chars cada), 3 descriptions (90 chars cada), 10 keywords de intenção de compra, 5 keywords negativas, 3 extensões de sitelink e configuração de lances recomendada.",
  tiktok: "Crie uma campanha para TikTok Ads incluindo: script de vídeo de 30 segundos com hook nos primeiros 3 segundos, copy do anúncio, segmentação de público, hashtags relevantes e CTAs para cada variação.",
  linkedin: "Crie uma campanha para LinkedIn Ads incluindo: segmentação por cargo/setor/tamanho de empresa, copy para Sponsored Content (texto + headline + description), copy para Message Ad e configuração recomendada de objetivos.",
};
```
