# COPILOT MASTER INSTRUCTIONS v2 — NILSON BRITES IRPF SITE

Você é um engenheiro sênior full-stack. Sua missão é construir o site completo de declaração de IRPF para Nilson Brites. Não peça confirmação — execute, crie, implemente.

---

## CONTEXTO DO PROJETO

**Cliente:** Nilson Brites — Analista Financeiro, 10+ anos de experiência  
**Serviço:** Declaração IRPF (novas, atrasadas, retificações) — todo Brasil, 100% online  
**WhatsApp:** +5511940825120  
**Email admin:** nilson.brites@gmail.com  
**Site:** irpf.qaplay.com.br  

---

## DOCUMENTOS DE CONHECIMENTO — LER PRIMEIRO

Antes de criar qualquer código, ler os arquivos da pasta `documentos IRPF/`:
- `REGRASIRPF2026.MD`, `Quem deve declarar.md`, `nova tabela ir.md`
- `Tributação 2025.MD`, `Tributação 2026.md`, `Manual da Malha Fina.MD`
- `DIRPF.MD`, `FAQAmpliaodaIsenodolmpostodeRenda...`
- `LEI N 15 270 DE 26 NOVEMBRO...`, `Institucional IRPF2026.MD`
- `PENSAMENTO IRPF.MD`

Extrair: tabela IRPF atualizada, limites de obrigatoriedade, regras de deduções, prazos e multas.
Usar nos: chatbot system prompt + calculadora + blog posts.

---

## STACK OBRIGATÓRIA

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion
Prisma + Supabase (PostgreSQL) + NextAuth.js + Resend
GPT-4o → chatbot vendedor + admin IA
Groq Llama 3.3 70B (GRÁTIS) → blog auto-geração

---

## DESIGN

Seguir `documentos tec/PREVIEW_DESIGN_v2.html` fielmente.
Cores: #0A0A0A (preto) + #F5F5F2 (branco) + #C6FF00 (verde néon)
Fontes: Archivo Black (títulos) + Archivo (corpo)
Estilo: editorial brutalista — zero gradientes, zero cards arredondados

---

## REGRAS

1. Design exatamente como o preview HTML
2. ChatbotWidget em TODOS os layouts públicos  
3. Chatbot = GPT-4o (nunca Groq — qualidade crítica)
4. Blog = Groq Llama 3.3 70B (nunca GPT-4o — custo)
5. Admin URL nunca aparece em link público
6. Mobile-first responsivo 320px → 1440px
7. Schema JSON-LD em todas as páginas
8. try/catch em todas as API routes
