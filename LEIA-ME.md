# 📋 GUIA DE USO v2 — NILSON BRITES IRPF

## Novidades desta versão
- Chatbot IA vendedor treinado nos documentos IRPF
- Groq grátis para geração automática de posts
- GPT-4o no chatbot vendedor (melhor qualidade)
- Documentos IRPF integrados no conhecimento da IA

## Estrutura de pastas necessária

```
SITE IRPF 2/
├── documentos IRPF/          ← seus arquivos MD (já existem)
├── documentos tec/           ← planejamento e preview (já existem)
├── .agent/                   ← extrair do ZIP aqui (arquivos 01 a 08)
├── .github/copilot-instructions.md
├── .vscode/settings.json + extensions.json
├── PROMPT_COPILOT.md
└── LEIA-ME.md
```

## Como usar (3 passos)

1. Extrair o ZIP na raiz do projeto SITE IRPF 2
2. Abrir Copilot Chat → modo **Agent** (dropdown no chat)
3. Copiar `PROMPT_COPILOT.md` → colar no chat → Enter

O Copilot começa pela FASE 0 lendo seus documentos IRPF, depois constrói tudo.

## O que fazer manualmente (apenas isso)

| Serviço | Onde criar | Tempo |
|---------|-----------|-------|
| Supabase (banco) | supabase.com | 5 min |
| OpenAI (chatbot) | platform.openai.com | 3 min |
| Groq (blog grátis) | console.groq.com | 3 min |
| Resend (email) | resend.com | 3 min |

Depois: preencher `.env.local` + `npx prisma db push` + adicionar fotos em `public/`

## Senhas do admin

```bash
# NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Hash da senha do painel admin
node -e "require('bcryptjs').hash('SUA_SENHA', 10).then(console.log)"
```

## Custo mensal estimado

- Chatbot GPT-4o: ~R$5-8/mês
- Blog Groq: R$0 (grátis)
- Supabase + Vercel + Resend: R$0
- **Total: ~R$7-12/mês**

## Problema? 

Copilot travou → cole o prompt novamente e diga "continue da fase onde parou"
Erro TypeScript → "corrija todos os erros do npm run build"
