# Guia de Deploy — Consultoria IRPF NSB

Siga os passos abaixo em ordem. Cada passo tem um **comando copiável** ou link direto.

---

## PASSO 1 — Supabase (Banco de Dados)

1. Acesse [supabase.com](https://supabase.com) → **New Project**
2. Nome: `irpf-nsb` | Região: `South America (São Paulo)`
3. Após criar, vá em **Settings → Database → Connection String**
4. Copie a URI em modo **Transaction (porta 6543)** → cole como `DATABASE_URL` no `.env.local`
5. Copie a URI em modo **Direct (porta 5432)** → cole como `DIRECT_URL` no `.env.local`
6. Vá em **Settings → API** → copie `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
7. Copie `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
8. Copie `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

**Depois de preencher .env.local, rode a migration:**

```cmd
set "TEMP=E:\npmtemp" && set "TMP=E:\npmtemp"
cd "E:\Meus Documentos Imp\IRPF-SITE"
npx prisma migrate dev --name init
```

---

## PASSO 2 — API Keys de Serviços

### OpenAI (chatbot — você já tem)
- Cole em `.env.local` → `OPENAI_API_KEY=sk-...`

### Groq (blog automático — GRÁTIS, sem cartão)
1. Acesse [console.groq.com](https://console.groq.com)
2. API Keys → Create API Key
3. Cole em `.env.local` → `GROQ_API_KEY=gsk_...`

### Resend (e-mails — GRÁTIS até 3.000/mês)
1. Acesse [resend.com](https://resend.com) → Create Account
2. API Keys → Create API Key
3. Cole em `.env.local` → `RESEND_API_KEY=re_...`
4. `FROM_EMAIL="Consultoria IRPF NSB <onboarding@resend.dev>"` (usar até verificar domínio)

---

## PASSO 3 — NEXTAUTH_SECRET (obrigatório em produção)

Gere um secret forte:
```cmd
node -e "require('crypto').randomBytes(32).then ? process.stdout.write(require('crypto').randomBytes(32).toString('base64')) : ''"
```
Ou simplesmente use qualquer string longa aleatória de 32+ caracteres.

Cole em `.env.local` → `NEXTAUTH_SECRET=valor_gerado`

---

## PASSO 4 — ADMIN_PASSWORD_HASH

O painel admin usa bcrypt. Gere o hash da sua senha escolhida:

```cmd
node -e "const b=require('bcryptjs');b.hash('SUA_SENHA_AQUI',10).then(h=>console.log(h))"
```

Cole o resultado em `.env.local` → `ADMIN_PASSWORD_HASH=$2b$10$...`

---

## PASSO 5 — og-image.jpg (SEO visual)

Crie uma imagem 1200×630px usando Canva:
- Fundo: `#1A1A1A`
- Logo/texto: "Consultoria IRPF NSB" em branco
- Subtítulo: "Declaração de Imposto de Renda — 100% Online"
- Salve como `public/og-image.jpg` (substituindo o SVG atual)

---

## PASSO 6 — Git e GitHub

```cmd
cd "E:\Meus Documentos Imp\IRPF-SITE"
git init
git add .
git commit -m "feat: site completo IRPF NSB"
```

Acesse [github.com](https://github.com) → **New Repository** → nome: `irpf-nsb-site`

```cmd
git remote add origin https://github.com/SEU_USUARIO/irpf-nsb-site.git
git branch -M main
git push -u origin main
```

> ⚠️ O `.env.local` está no `.gitignore` — suas chaves NÃO vão para o GitHub.

---

## PASSO 7 — Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) → **Add New → Project**
2. Importe o repositório `irpf-nsb-site`
3. Framework: **Next.js** (detectado automaticamente)
4. Em **Environment Variables**, adicione TODAS as variáveis do `.env.local`:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | postgres://... (porta 6543, pgbouncer) |
| `DIRECT_URL` | postgres://... (porta 5432, direct) |
| `OPENAI_API_KEY` | sk-... |
| `GROQ_API_KEY` | gsk_... |
| `RESEND_API_KEY` | re_... |
| `FROM_EMAIL` | Consultoria IRPF NSB \<onboarding@resend.dev\> |
| `ADMIN_EMAIL` | nilson.brites@gmail.com |
| `NEXTAUTH_URL` | https://irpf.qaplay.com.br |
| `NEXTAUTH_SECRET` | valor gerado |
| `ADMIN_USERNAME` | nilson |
| `ADMIN_PASSWORD_HASH` | hash gerado |
| `NEXT_PUBLIC_SITE_URL` | https://irpf.qaplay.com.br |
| `NEXT_PUBLIC_WA_NUMBER` | 5511940825120 |
| `NEXT_PUBLIC_WA_MESSAGE` | Ola! Vim pelo site e quero saber sobre declaracao. |
| `CRON_SECRET` | edcWf63bpF6iCDrWd4N2g-0F9aPDwVyq4ZU3ZhtPys4 |
| `NEXT_PUBLIC_SUPABASE_URL` | https://[ref].supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJ... |

5. Clique em **Deploy**

---

## PASSO 8 — DNS do Domínio

No painel DNS do seu registrador (onde `qaplay.com.br` está registrado):

**Opção A — CNAME** (recomendado se for subdomínio):
```
irpf  CNAME  cname.vercel-dns.com  (TTL: 3600)
```

**Opção B — A Record** (se precisar de IP fixo):
- Vá na Vercel → Domains → copie o IP fornecido

Após adicionar o domínio na Vercel (**Settings → Domains → irpf.qaplay.com.br**), a Vercel provisiona SSL automaticamente via Let's Encrypt.

---

## PASSO 9 — Verificação Final

Após o deploy, teste:

- [ ] `https://irpf.qaplay.com.br` carrega normalmente
- [ ] `https://irpf.qaplay.com.br/painel-nb-2025` mostra tela de login
- [ ] Login com usuário `nilson` + sua senha funciona
- [ ] Calculadora de IR calcula corretamente
- [ ] Chatbot responde no canto inferior direito
- [ ] Formulário de contato envia e-mail
- [ ] `https://irpf.qaplay.com.br/sitemap.xml` retorna XML

---

## PASSO 10 — Blog Automático (Cron Job)

Para ativar a geração automática de posts, configure o cron na Vercel:

1. Vercel Dashboard → Settings → Cron Jobs
2. URL: `/api/cron/blog`
3. Schedule: `0 8 * * 1,3,5` (segunda, quarta, sexta às 8h)
4. Certifique-se que `CRON_SECRET=edcWf63bpF6iCDrWd4N2g-0F9aPDwVyq4ZU3ZhtPys4` está nas env vars

---

## CREDENCIAIS E ACESSOS IMPORTANTES

| Item | Valor |
|---|---|
| Painel admin | `/painel-nb-2025` |
| Username | `nilson` |
| Password | *a que você definiu no ADMIN_PASSWORD_HASH* |
| WhatsApp do site | +55 11 94082-5120 |
| CRON_SECRET | `edcWf63bpF6iCDrWd4N2g-0F9aPDwVyq4ZU3ZhtPys4` |

---

*Guia gerado automaticamente — Consultoria IRPF NSB*
