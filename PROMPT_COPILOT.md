# PROMPT FINAL v3 — CONSULTORIA IRPF NSB — COPIAR NO COPILOT AGENT

Você é engenheiro full-stack sênior. Construa o site completo da Consultoria IRPF NSB. Execute tudo sem pedir confirmação.

## Referências obrigatórias — ler antes de qualquer código
- `documentos tec/PREVIEW_DESIGN_v4_FINAL.html` → design EXATO a replicar em Next.js
- `documentos tec/PLANEJAMENTO_IRPF_v2_FINAL.md` → planejamento técnico
- Pasta `documentos IRPF/` → todo o conhecimento do chatbot (ler TODOS os arquivos)
- Pasta `.agent/` → instruções detalhadas 01 a 09

## Stack
Next.js 14 App Router + TypeScript + Tailwind CSS + Framer Motion + Supabase/Prisma + NextAuth + Resend
GPT-4o → chatbot vendedor + admin IA
Groq Llama 3.3 70B (GRÁTIS) → blog auto-geração

## Design — seguir EXATAMENTE o arquivo PREVIEW_DESIGN_v4_FINAL.html
- Paleta: #F9F7F2 (bg) + #1A1A1A (preto) + #2D4033 (verde) + #C9A84C (ouro)
- Fontes: Playfair Display (serif/títulos) + Inter (body)
- Nome da marca: "Consultoria IRPF NSB" — jamais usar "Nilson Brites" no site público
- Zero emoji em qualquer parte do site
- Chatbot: botão com label de texto visível no canto inferior ESQUERDO
- WhatsApp float: canto inferior DIREITO
- Apenas IRPF Pessoa Física — nunca mencionar PJ, empresa, CNPJ

---

## FASE 0 — LER DOCUMENTOS (obrigatório antes de qualquer código)

1. Ler todos os arquivos em `documentos IRPF/`
2. Extrair: tabela IRPF 2025 E 2026, limites de obrigatoriedade, prazos, multas, deduções
3. Ler `PENSAMENTO IRPF.MD` — regras do chatbot vendedor
4. Usar na: lib/chatbot-prompt.ts + lib/ir-calculations.ts + lib/blog-engine.ts

---

## FASE 1 — Setup (ler .agent/01-setup.md)

- Next.js + deps + Shadcn + .env.local + tailwind + globals.css + vercel.json + next-sitemap.config.js

Fontes no tailwind.config.ts:
```typescript
fontFamily: {
  serif: ["var(--font-playfair)", "Georgia", "serif"],
  sans:  ["var(--font-inter)", "sans-serif"],
}
```

Layout app/(site)/layout.tsx — importar Playfair Display + Inter via next/font/google

---

## FASE 2 — LLM + Banco + Auth (ler .agent/02-database-auth.md + .agent/08-llm-strategy.md)

Criar lib/llm-providers.ts:
- gpt4o: OpenAI API (chatbot + admin)
- groqLlama: baseURL api.groq.com/openai/v1 (blog — GRÁTIS)

Schema Prisma: adicionar campo faqsJson String @default("[]") no BlogPost

---

## FASE 3 — CHATBOT (ler .agent/07-chatbot-ia-vendedor.md) — PRIORIDADE MÁXIMA

O chatbot é a feature mais importante. Fazer primeiro.

lib/chatbot-prompt.ts:
- Injetar TODA a inteligência dos documentos IRPF
- Seguir regras do PENSAMENTO IRPF.MD:
  * Nunca ensinar como declarar sozinho
  * Responder APENAS sobre IRPF
  * Direcionar para WhatsApp naturalmente
  * Se perguntar outro assunto: "Isso não é comigo — sobre IRPF posso ajudar."
  * Nunca forçar — convencer com informação e benefícios
  * Alertar sobre consequências (CPF bloqueado, multas crescendo)

app/api/chatbot/route.ts:
- Modelo: GPT-4o (NUNCA Groq aqui)
- Streaming real-time
- Rate limiting: 20 msgs/min por IP
- Max 500 tokens por resposta

components/site/ChatbotWidget.tsx:
- Posição: canto inferior ESQUERDO (fixo)
- Botão trigger: fundo preto, ícone NB dourado + texto "Tire dúvidas sobre IR" + status "Online"
- Pulse dot verde no botão
- Janela: 384px x 530px, fundo branco
- Header: fundo #1A1A1A, avatar NB dourado, "Assistente NSB" + "Online agora"
- Perguntas rápidas (chips) visíveis na abertura
- Streaming em tempo real com typing indicator (3 dots animados)
- Input + botão enviar preto/verde

---

## FASE 4 — Componentes e Páginas (ler .agent/03-components-pages.md)

Seguir o PREVIEW_DESIGN_v4_FINAL.html como referência pixel-a-pixel.

Ordem de criação:
1. lib/ir-calculations.ts (tabela dos documentos IRPF)
2. lib/utils.ts
3. components/seo/JsonLd.tsx
4. app/(site)/layout.tsx → incluir ChatbotWidget + WhatsAppFloat
5. Navbar → logo "Consultoria IRPF NSB" com dot dourado + nav links + "Declarar Agora"
6. Footer → 4 colunas + footer-bottom com status dot animado
7. WhatsAppFloat → posição DIREITA
8. MarqueeStrip → fundo verde escuro, texto misto (bold/normal), separador ·
9. HeroSection → meta bar + grid 7/5 + título Playfair + data bar 4 colunas
10. ServicosSection → 4 linhas com numerais itálicos, nome grande, descrição, tag, seta ↗
11. SplitSection (Sobre) → foto esquerda com badge "10+" + conteúdo branco direita
12. DadosOficiaisSection → fundo verde, tabela IRPF + card multas + CTA dourado
13. CalculadoraSection → fundo branco, campos Playfair Display 26px + resultado sticky
14. BlogPreviewSection → 3 artigos, foto 4/5, category tag dourada, título hover italic
15. ProcessoSection → fundo preto, 3 steps com números gigantes translúcidos
16. ContatoSection → fundo verde, formulário 2 colunas, btn branco
17. FAQSection → accordion Radix UI com Schema FAQ

Páginas:
- / (home com todos os componentes)
- /servicos
- /como-funciona  
- /ferramentas/calculadora-ir
- /ferramentas/simulador-multa
- /ferramentas/consulta-situacao
- /blog (listagem com paginação)
- /blog/[slug] (post com sidebar, FAQ, schema completo)
- /ebook
- /sobre
- /contato

---

## FASE 5 — BLOG ENGINE EXTRAORDINÁRIO (ler .agent/09-blog-engine-extraordinario.md)

Este é o diferencial competitivo. Implementar completo.

lib/blog-engine.ts:
- getSelicAtual(): API pública BCB (api.bcb.gov.br)
- KEYWORD_CLUSTERS: 12 clusters com primary/secondary/volume/intent
- generateBlogPost(clusterIndex): Groq + dados frescos → post 1.800+ palavras
- Sistema prompt que exige: tabela, cálculo numérico, 6 FAQs, CTA para WA

app/api/cron/blog-auto/route.ts:
- Roda toda semana (vercel.json)
- Gera 2 posts em paralelo
- Envia email ao admin notificando posts para revisar
- Rotação de clusters para nunca repetir tema na mesma semana

app/api/blog/generate/route.ts (admin manual):
- Recebe keyword custom do painel
- Usa mesma lib/blog-engine.ts
- Streaming opcional para ver geração em tempo real

app/(site)/blog/[slug]/page.tsx:
- Schema JSON-LD: Article + FAQPage + BreadcrumbList
- Tipografia .prose-irpf customizada (Playfair H2/H3, Inter body)
- CTA box no meio do conteúdo
- FAQ accordion ao final
- Sidebar: calculadora mini + form lead
- Posts relacionados (mesma tag)
- generateStaticParams para SSG

---

## FASE 6 — APIs e Email (ler .agent/04-api-email-cron.md)

- /api/contato → salva Contato + email admin + email confirmação
- /api/leads → salva Lead + notifica admin por WA (link direto)
- /api/ebook → salva EbookDownload + envia PDF por email
- /api/calculadora → cálculo server-side com tabela oficial

---

## FASE 7 — Admin (ler .agent/05-admin-panel.md)

URL: /painel-nb-2025 (NUNCA linkar publicamente)
- Login + auth NextAuth
- Dashboard: métricas (leads, contatos, posts)
- Leads table: filtros, mudar status, abrir WA, exportar CSV
- Blog manager: listar + toggle publicado + gerador com IA (Groq)
- Editor de post: título + slug + resumo + conteudo HTML + tags + keywords
- Chat IA admin: GPT-4o streaming, contexto do negócio
- Campanhas IA: Facebook/Google/TikTok/LinkedIn (GPT-4o)
- Email marketing builder: 5 templates
- Admin nunca aparece em robots.txt, sitemap ou link público

---

## FASE 8 — SEO Final (ler .agent/06-seo.md)

- app/sitemap.ts dinâmico (estático + posts publicados)
- public/robots.txt (bloquear /painel-nb-2025)
- Schema JSON-LD FinancialService + Person na home
- Schema Article + FAQ + BreadcrumbList nos posts
- Metadata completo em cada page.tsx
- next.config.js com headers de segurança + cache de fontes
- app/not-found.tsx no design do site

---

## REGRAS INVIOLÁVEIS

1. Design fiel ao PREVIEW_DESIGN_v4_FINAL.html — sem reinterpretação
2. Nome público: "Consultoria IRPF NSB" — nunca "Nilson Brites" no front
3. Zero emoji em qualquer parte do site
4. Chatbot: GPT-4o (nunca Groq)
5. Blog: Groq (nunca GPT-4o)
6. Apenas IRPF Pessoa Física — nunca PJ, CNPJ, empresa
7. Admin: /painel-nb-2025 nunca referenciado publicamente
8. Fontes: Playfair Display + Inter — nenhuma outra
9. Sem depoimentos ou reviews (não existem ainda)
10. Nunca ensinar a declarar sozinho (nem no chatbot, nem no blog)

---

## Começar pela FASE 0. Ler os documentos IRPF antes de escrever uma linha de código.
