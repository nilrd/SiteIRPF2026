# AGENTE: ESTRATÉGIA DE LLM — CUSTO ZERO NO BLOG

## Decisão de Arquitetura

| Função | Modelo | Custo | Razão |
|--------|--------|-------|-------|
| Chatbot Vendedor | GPT-4o | Pago (~R$0,05/conversa) | Crítico — precisa ser o melhor |
| Admin IA (campanhas) | GPT-4o | Pago (uso ocasional) | Precisa de qualidade |
| Blog Auto-Geração | Groq Llama 3.3 70B | **GRÁTIS** | Artigos SEO, suficiente |

**Por que Groq para o blog?**
- Llama 3.3 70B via Groq = qualidade próxima ao GPT-4 para textos estruturados
- 500.000 tokens/dia GRÁTIS no free tier
- API 100% compatível com OpenAI (só troca a baseURL)
- Velocidade 10x maior (gera artigo em segundos, não minutos)
- Um artigo de 1.500 palavras ≈ 2.000 tokens → 250 artigos/dia grátis

---

## ARQUIVO: `lib/llm-providers.ts`

```typescript
import OpenAI from "openai";

// GPT-4o — para chatbot vendedor e admin IA (precisa de melhor qualidade)
export const gpt4o = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Groq Llama 3.3 70B — para blog auto-geração (grátis, suficiente para artigos SEO)
export const groqLlama = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

// Modelo a usar para cada função
export const MODELS = {
  chatbot: "gpt-4o",
  adminIA: "gpt-4o",
  blogGeneration: "llama-3.3-70b-versatile", // Groq free
} as const;
```

---

## ATUALIZAR: `.env.local`

Adicionar:
```env
# Groq (GRATUITO para geração de posts do blog)
# Criar conta em: console.groq.com
GROQ_API_KEY="gsk_PREENCHER"
```

---

## ATUALIZAR: `app/api/blog/generate/route.ts`

Trocar de `openai` para `groqLlama`:

```typescript
import { groqLlama, MODELS } from "@/lib/llm-providers";

// ... (resto do código igual, só muda o cliente e o model)

const completion = await groqLlama.chat.completions.create({
  model: MODELS.blogGeneration, // "llama-3.3-70b-versatile"
  messages: [
    { role: "system", content: BLOG_SYSTEM_PROMPT },
    { role: "user", content: `Escreva um post completo sobre: "${keyword}"` },
  ],
  temperature: 0.7,
  max_tokens: 4096,
  response_format: { type: "json_object" },
});
```

---

## CUSTO ESTIMADO MENSAL (com esta arquitetura)

| Item | Volume | Custo |
|------|--------|-------|
| Chatbot (GPT-4o) | 500 conversas × 300 tokens | ~R$3-8/mês |
| Admin IA (GPT-4o) | 50 usos × 1000 tokens | ~R$2-4/mês |
| Blog (Groq grátis) | 8 posts/mês | R$0 |
| **TOTAL** | | **~R$5-12/mês** |

Comparado com tudo em GPT-4o: ~R$40-80/mês.

---

## Criar conta Groq (3 minutos)

1. Acesse `console.groq.com`
2. Sign up com Google ou email
3. Vá em API Keys → Create API Key
4. Copie a chave → coloque no `.env.local` como `GROQ_API_KEY`
5. Sem cartão de crédito necessário
