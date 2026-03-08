# AGENTE: SISTEMA DE BLOG EXTRAORDINÁRIO

## Objetivo
Criar o sistema de blog mais inteligente possível para IRPF.
Não é um simples gerador de texto — é uma engine de conteúdo de autoridade.

---

## ARQUITETURA DO BLOG ENGINE

```
1. Busca dados frescos da Receita Federal (gov.br RSS/scraping)
2. Consulta tabela Selic atual do BCB (API pública)
3. Gera post com FATOS REAIS e DADOS DO DIA
4. Cria schema Article + FAQ + HowTo em JSON-LD
5. Auto-linka posts relacionados
6. Gera meta tags otimizadas para o cluster de keywords
7. Salva no banco + posta como rascunho para revisão
```

---

## ARQUIVO: `lib/blog-engine.ts`

```typescript
import { groqLlama, MODELS } from "./llm-providers";
import { prisma } from "./prisma";

// ─── DADOS FRESCOS ────────────────────────────────────────

// Taxa Selic atual — API pública Banco Central do Brasil
export async function getSelicAtual(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/1?formato=json",
      { next: { revalidate: 86400 } } // cache 24h
    );
    const data = await res.json();
    return parseFloat(data[0]?.valor || "10.5");
  } catch {
    return 10.5; // fallback
  }
}

// ─── SISTEMA DE KEYWORDS ──────────────────────────────────

export const KEYWORD_CLUSTERS = [
  {
    primary: "quem deve declarar imposto de renda 2025",
    secondary: ["obrigatoriedade irpf 2025", "limites declaração ir 2025", "renda mínima declarar ir"],
    intent: "informacional",
    difficulty: "alta",
    volume: 74000,
  },
  {
    primary: "irpf em atraso o que fazer 2025",
    secondary: ["declaração atrasada multa", "regularizar cpf bloqueado", "ir anos anteriores"],
    intent: "transacional",
    difficulty: "média",
    volume: 40500,
  },
  {
    primary: "calculadora restituição imposto de renda 2025",
    secondary: ["como calcular restituição ir", "simulador irpf 2025", "tabela progressiva 2025"],
    intent: "ferramental",
    difficulty: "alta",
    volume: 35000,
  },
  {
    primary: "documentos declaração imposto de renda 2025",
    secondary: ["lista documentos irpf", "informe de rendimentos como obter", "o que precisa declarar ir"],
    intent: "informacional",
    difficulty: "baixa",
    volume: 29000,
  },
  {
    primary: "deduções imposto de renda 2025 o que pode deduzir",
    secondary: ["gastos medicos ir", "educação dedução ir", "dependente ir", "pgbl dedução"],
    intent: "informacional",
    difficulty: "média",
    volume: 26000,
  },
  {
    primary: "irpf aposentado 2025 declaração",
    secondary: ["aposentado obrigado declarar ir", "isenção ir aposentado", "inss aposentadoria ir"],
    intent: "informacional",
    difficulty: "baixa",
    volume: 22000,
  },
  {
    primary: "malha fina imposto de renda como sair 2025",
    secondary: ["retido malha fina", "retificação declaração", "inconsistência receita federal"],
    intent: "transacional",
    difficulty: "média",
    volume: 18000,
  },
  {
    primary: "prazo declaração imposto de renda 2025",
    secondary: ["data limite irpf 2025", "multa atraso declaração", "quando começa declaração ir"],
    intent: "informacional",
    difficulty: "alta",
    volume: 33000,
  },
  {
    primary: "declaração ir autônomo mei 2025",
    secondary: ["autônomo declarar ir", "mei imposto de renda", "carnê leão autônomo"],
    intent: "informacional",
    difficulty: "média",
    volume: 19000,
  },
  {
    primary: "retificação declaração imposto de renda passo a passo",
    secondary: ["como retificar ir", "corrigir declaração enviada", "declaração errada ir"],
    intent: "transacional",
    difficulty: "baixa",
    volume: 14000,
  },
  {
    primary: "dependente imposto de renda 2025 regras",
    secondary: ["filho dependente ir", "conjuge dependente ir", "limite renda dependente"],
    intent: "informacional",
    difficulty: "baixa",
    volume: 21000,
  },
  {
    primary: "quanto custa declaração imposto de renda 2025",
    secondary: ["preço declaração ir", "valor declarar ir contador", "declaração ir online preço"],
    intent: "transacional",
    difficulty: "alta",
    volume: 35000,
  },
];

// ─── GERADOR DE POST ──────────────────────────────────────

const BLOG_SYSTEM_PROMPT = `
Você é um especialista sênior em Imposto de Renda Pessoa Física (IRPF) e redator de conteúdo editorial premium.
Escreva para o blog da Consultoria IRPF NSB — site irpf.qaplay.com.br.

MISSÃO: Criar o artigo mais completo e útil do Google sobre o tema. Superar qualquer concorrente.

DADOS OFICIAIS QUE VOCÊ DEVE USAR (IRPF 2025):
- Tabela progressiva anual: Isento até R$24.511,92 | 7,5% até R$33.919,80 | 15% até R$45.012,60 | 22,5% até R$55.976,16 | 27,5% acima
- Dedução por dependente: R$2.275,08/ano
- Dedução educação: até R$3.561,50/pessoa (titular + dependentes)
- Dedução saúde: sem limite
- Prazo 2025: 31 de maio de 2025
- Multa mínima: R$165,74 | Multa máxima: R$6.275,00
- Cálculo multa: 1% ao mês sobre IR devido, mínimo R$165,74
- CPF bloqueado: desbloqueio em 48-72h após envio

OBRIGAÇÕES DE QUALIDADE:
- Mínimo 1.800 palavras (conteúdo real, não enchimento)
- Estrutura H2 e H3 hierárquica e lógica
- Incluir pelo menos 1 tabela comparativa ou de dados
- Incluir pelo menos 1 exemplo numérico real calculado
- Incluir 6 perguntas frequentes ao final (para Schema FAQ)
- CTA natural no meio do texto: link para WhatsApp wa.me/5511940825120
- CTA ao final: convite para consulta gratuita pelo WhatsApp
- Tom: especialista acessível — como um amigo que entende de IR
- Sem juridiquês | Sem termos técnicos sem explicação

SOBRE A MARCA:
- Consultoria IRPF NSB | irpf.qaplay.com.br
- Apenas IRPF pessoa física (jamais mencionar PJ)
- Atendimento pelo WhatsApp | Entrega 24h | Todo Brasil
- Preço abaixo do mercado | 10 anos de experiência

FORMATO DE SAÍDA: JSON puro (sem markdown, sem backticks)
{
  "titulo": "Título principal SEO-otimizado (H1) — máximo 65 caracteres",
  "slug": "titulo-em-kebab-case",
  "resumo": "Resumo descritivo para listagem — 140-160 caracteres",
  "metaTitle": "Meta title — máximo 60 caracteres",
  "metaDesc": "Meta description — máximo 155 caracteres",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tags": ["tag1", "tag2", "tag3"],
  "readTime": 8,
  "conteudo": "HTML completo do artigo — parágrafos, h2, h3, tables, ul, ol, blockquotes",
  "faqs": [
    {"pergunta": "Pergunta 1?", "resposta": "Resposta completa 1."},
    {"pergunta": "Pergunta 2?", "resposta": "Resposta completa 2."}
  ]
}
`;

// ─── FUNÇÃO PRINCIPAL ─────────────────────────────────────

export async function generateBlogPost(clusterIndex: number) {
  const cluster = KEYWORD_CLUSTERS[clusterIndex % KEYWORD_CLUSTERS.length];
  const selic = await getSelicAtual();

  const userPrompt = `
Escreva um artigo completo sobre: "${cluster.primary}"

Dados desta semana para usar:
- Taxa Selic atual: ${selic}% ao ano
- Keywords secundárias para cobrir naturalmente: ${cluster.secondary.join(", ")}
- Intenção de busca: ${cluster.intent}

Exemplos de perguntas que leitores têm sobre este tema:
${cluster.secondary.map(k => `- ${k}`).join("\n")}

Crie o artigo mais completo e útil possível. Supere a Wikipedia em profundidade e o contador da esquina em clareza.
`;

  const completion = await groqLlama.chat.completions.create({
    model: MODELS.blogGeneration,
    messages: [
      { role: "system", content: BLOG_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.65,
    max_tokens: 6000,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0].message.content!;
  // Limpar possíveis backticks que o modelo às vezes adiciona
  const clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const post = JSON.parse(clean);

  // Garantir slug único
  const existingSlug = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
  const slug = existingSlug ? `${post.slug}-${Date.now()}` : post.slug;

  // Calcular readTime real
  const wordCount = post.conteudo.replace(/<[^>]+>/g, "").split(" ").length;
  const readTime = Math.ceil(wordCount / 200);

  // Salvar no banco
  const saved = await prisma.blogPost.create({
    data: {
      titulo: post.titulo,
      slug,
      resumo: post.resumo,
      conteudo: post.conteudo,
      tags: post.tags || [],
      keywords: post.keywords || [],
      metaTitle: post.metaTitle,
      metaDesc: post.metaDesc,
      readTime,
      autorIA: true,
      publicado: false, // Admin revisa antes
      faqsJson: JSON.stringify(post.faqs || []), // campo adicional no schema
    },
  });

  return { post: saved, cluster, wordCount };
}
```

---

## ATUALIZAR: `prisma/schema.prisma`

Adicionar campo `faqsJson` no model BlogPost:
```prisma
model BlogPost {
  ...
  faqsJson  String   @default("[]") // JSON array de FAQs [{pergunta, resposta}]
  ...
}
```

---

## ARQUIVO: `app/api/cron/blog-auto/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { generateBlogPost } from "@/lib/blog-engine";
import { resend, FROM, ADMIN_EMAIL } from "@/lib/resend";

export async function GET(req: NextRequest) {
  // Verificar autenticação do cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Calcular qual cluster usar esta semana (rotação)
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const clusterA = weekNumber % 12;
    const clusterB = (weekNumber + 6) % 12; // 6 posições à frente para variar

    // Gerar 2 posts em paralelo
    const [resultA, resultB] = await Promise.allSettled([
      generateBlogPost(clusterA),
      generateBlogPost(clusterB),
    ]);

    const sucessos = [resultA, resultB].filter(r => r.status === "fulfilled").length;
    const posts = [resultA, resultB]
      .filter(r => r.status === "fulfilled")
      .map(r => (r as PromiseFulfilledResult<any>).value);

    // Notificar admin por email
    if (sucessos > 0) {
      await resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `[Blog NSB] ${sucessos} novo(s) post(s) gerado(s) — revisão pendente`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
            <h2 style="color:#2D4033">${sucessos} post(s) gerado(s) esta semana</h2>
            <p style="color:#666;">Acesse o painel para revisar e publicar.</p>
            ${posts.map(p => `
              <div style="margin:20px 0;padding:16px;background:#f5f5f0;border-left:3px solid #C9A84C;">
                <strong>${p.post.titulo}</strong><br>
                <small style="color:#888;">${p.wordCount} palavras · /blog/${p.post.slug}</small>
              </div>
            `).join("")}
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/painel-nb-2025/blog" 
               style="display:inline-block;margin-top:20px;background:#2D4033;color:white;padding:12px 24px;text-decoration:none;font-weight:700;">
              Revisar no Painel Admin
            </a>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      postsGerados: sucessos,
      posts: posts.map(p => ({ titulo: p.post.titulo, slug: p.post.slug })),
    });
  } catch (error) {
    console.error("Blog cron error:", error);
    return NextResponse.json({ error: "Cron failed", details: String(error) }, { status: 500 });
  }
}
```

---

## ARQUIVO: `app/(site)/blog/[slug]/page.tsx` — Layout excepcional

O post individual deve ter:

```typescript
// Schema JSON-LD completo — Article + FAQ + BreadcrumbList
function PostJsonLd({ post, faqs }: { post: any; faqs: any[] }) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.titulo,
      "description": post.resumo,
      "datePublished": post.createdAt,
      "dateModified": post.updatedAt,
      "author": {
        "@type": "Person",
        "name": "Consultoria IRPF NSB",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/sobre`,
      },
      "publisher": {
        "@type": "Organization",
        "name": "Consultoria IRPF NSB",
        "url": process.env.NEXT_PUBLIC_SITE_URL,
      },
      "url": url,
      "wordCount": post.conteudo.replace(/<[^>]+>/g, "").split(" ").length,
      "timeRequired": `PT${post.readTime}M`,
      "inLanguage": "pt-BR",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.pergunta,
        "acceptedAnswer": { "@type": "Answer", "text": f.resposta },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Início", "item": process.env.NEXT_PUBLIC_SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${process.env.NEXT_PUBLIC_SITE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": post.titulo, "item": url },
      ],
    },
  ];

  return (
    <>
      {schema.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
    </>
  );
}
```

Layout do post individual:
- Breadcrumb: Início > Blog > Título
- Header: categoria + título H1 grande (Playfair Display) + meta (data + readTime)
- Imagem de capa (placeholder creme com overlay de texto até ter foto real)
- Conteúdo HTML renderizado com `prose` customizado no Tailwind
- **CTA Box no meio:** "Precisa de ajuda? Nilson faz por você em 24h — fale no WhatsApp →"
- Seção FAQ ao final com Accordion (Radix UI) com Schema
- Sidebar sticky: calculadora resumida + form de captura de lead
- Compartilhar: WhatsApp (link) + Copiar link
- Posts relacionados ao final (3 posts mesma tag)

```css
/* Tipografia do conteúdo do blog */
.prose-irpf {
  font-size: 16px;
  line-height: 1.85;
  color: #3A3A3A;
  font-weight: 300;
}
.prose-irpf h2 {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 400;
  margin: 48px 0 18px;
  letter-spacing: -0.02em;
  color: #1A1A1A;
}
.prose-irpf h3 {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 500;
  margin: 32px 0 12px;
  color: #1A1A1A;
}
.prose-irpf strong { font-weight: 600; color: #1A1A1A; }
.prose-irpf table {
  width: 100%; border-collapse: collapse;
  margin: 32px 0; font-size: 14px;
}
.prose-irpf th {
  background: #2D4033; color: white; padding: 12px 16px;
  text-align: left; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
}
.prose-irpf td { padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.07); }
.prose-irpf tr:nth-child(even) td { background: rgba(0,0,0,0.02); }
.prose-irpf blockquote {
  border-left: 3px solid #C9A84C; padding: 8px 20px;
  color: #666; font-style: italic; margin: 32px 0;
  background: rgba(201,168,76,0.05);
}
```

---

## VERIFICAÇÃO DE QUALIDADE DO POST

Após geração, verificar:
- [ ] Contém pelo menos 1.800 palavras
- [ ] Contém tabela com dados reais da RF
- [ ] Contém pelo menos 1 cálculo numérico de exemplo
- [ ] Contém 6+ FAQs
- [ ] Não menciona PJ
- [ ] Contém CTA para WhatsApp (wa.me/5511940825120)
- [ ] Slug único no banco
- [ ] Tags preenchidas (mínimo 2)
- [ ] Keywords preenchidas (mínimo 4)
