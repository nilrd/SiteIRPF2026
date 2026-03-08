# AGENTE: SETUP INICIAL DO PROJETO

## Objetivo
Criar toda a estrutura base do projeto Next.js com todas as dependências, configurações e arquivos base.

## Quando usar
Primeira execução. Projeto ainda não existe.

## Passos — Execute em ordem, sem pular

### PASSO 1 — Criar projeto Next.js
```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias="@/*" \
  --yes
```

### PASSO 2 — Instalar dependências
```bash
npm install \
  @prisma/client prisma \
  @supabase/supabase-js \
  next-auth @auth/prisma-adapter \
  openai \
  resend \
  react-hook-form @hookform/resolvers zod \
  framer-motion \
  next-sitemap \
  clsx tailwind-merge \
  bcryptjs \
  date-fns \
  @radix-ui/react-dialog \
  @radix-ui/react-tabs \
  @radix-ui/react-select \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-toast \
  @radix-ui/react-accordion \
  lucide-react

npm install -D \
  @types/bcryptjs \
  @types/node
```

### PASSO 3 — Instalar e configurar Shadcn/ui
```bash
npx shadcn-ui@latest init --yes
npx shadcn-ui@latest add button input textarea card badge dialog tabs select toast separator accordion
```

### PASSO 4 — Configurar Prisma com Supabase
```bash
npx prisma init
```
Depois criar o schema conforme arquivo `prisma/schema.prisma`.

### PASSO 5 — Criar arquivo .env.local
Criar o arquivo com todas as variáveis necessárias (valores placeholder).

### PASSO 6 — Configurar tailwind.config.ts
Adicionar a fonte Archivo + cores customizadas.

### PASSO 7 — Criar globals.css
Design system completo com CSS variables.

### PASSO 8 — Configurar next.config.js
Adicionar configurações de imagem, domínios externos, headers de segurança.

### PASSO 9 — Criar vercel.json
Adicionar configuração de Cron Jobs para auto-post do blog.

### PASSO 10 — Gerar estrutura de pastas
Criar todos os diretórios e arquivos vazios conforme o planejamento.

## Arquivos a criar nesta fase

### `.env.local`
```env
# Supabase — preencher após criar projeto em supabase.com
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASS]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="PREENCHER"
SUPABASE_SERVICE_ROLE_KEY="PREENCHER"

# OpenAI — preencher com chave de api.openai.com
OPENAI_API_KEY="sk-PREENCHER"

# Resend — preencher com chave de resend.com
RESEND_API_KEY="re_PREENCHER"
FROM_EMAIL="Nilson Brites IRPF <onboarding@resend.dev>"
ADMIN_EMAIL="nilson.brites@gmail.com"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="GERAR_COM: openssl rand -base64 32"
ADMIN_USERNAME="nilson"
ADMIN_PASSWORD_HASH="GERAR_COM_BCRYPT"

# Site
NEXT_PUBLIC_SITE_URL="https://irpf.qaplay.com.br"
NEXT_PUBLIC_WA_NUMBER="5511940825120"
NEXT_PUBLIC_WA_MESSAGE="Olá Nilson! Vim pelo site e quero saber sobre declaração de IR."

# Analytics (preencher depois)
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_FB_PIXEL_ID=""

# Cron
CRON_SECRET="GERAR_ALEATÓRIO"
```

### `tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        preto: "#0A0A0A",
        branco: "#F5F5F2",
        verde: "#C6FF00",
        cinza: "#888888",
        "cinza-claro": "#DEDBD4",
        "linha": "rgba(0,0,0,0.1)",
      },
      fontFamily: {
        black: ["var(--font-archivo-black)", "sans-serif"],
        sans: ["var(--font-archivo)", "sans-serif"],
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.03em",
      },
      animation: {
        "marquee": "marquee 22s linear infinite",
        "blink": "blink 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### `app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --preto: #0A0A0A;
    --branco: #F5F5F2;
    --verde: #C6FF00;
    --cinza: #888888;
    --linha: rgba(0, 0, 0, 0.1);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    background: #F5F5F2;
    color: #0A0A0A;
    font-family: var(--font-archivo), sans-serif;
    font-weight: 400;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* Grain overlay */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9998;
    opacity: 0.022;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 128px;
  }

  ::selection {
    background: #C6FF00;
    color: #0A0A0A;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #F5F5F2; }
  ::-webkit-scrollbar-thumb { background: #0A0A0A; border-radius: 0; }
}

@layer utilities {
  .font-black-display { font-family: var(--font-archivo-black), sans-serif; }
  
  .text-display-xl {
    font-family: var(--font-archivo-black), sans-serif;
    font-size: clamp(52px, 6.5vw, 96px);
    line-height: 0.95;
    letter-spacing: -0.04em;
  }

  .text-display-lg {
    font-family: var(--font-archivo-black), sans-serif;
    font-size: clamp(36px, 4vw, 60px);
    line-height: 1;
    letter-spacing: -0.03em;
  }

  .text-display-md {
    font-family: var(--font-archivo-black), sans-serif;
    font-size: clamp(24px, 2.5vw, 36px);
    line-height: 1.05;
    letter-spacing: -0.02em;
  }

  .section-border { border-bottom: 1px solid rgba(0,0,0,0.1); }

  .btn-verde {
    @apply bg-[#C6FF00] text-[#0A0A0A] px-8 py-4 font-bold text-sm tracking-wide
           rounded-sm transition-all duration-200 inline-flex items-center gap-2
           hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(198,255,0,0.35)];
  }

  .btn-preto {
    @apply bg-[#0A0A0A] text-[#F5F5F2] px-8 py-4 font-bold text-sm tracking-wide
           rounded-sm transition-all duration-200 inline-flex items-center gap-2
           hover:-translate-y-0.5;
  }

  .container-site {
    @apply max-w-[1400px] mx-auto px-5 md:px-10;
  }
}
```

### `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/cron/blog-auto",
      "schedule": "0 8 * * 0"
    }
  ]
}
```

### `next-sitemap.config.js`
```js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://irpf.qaplay.com.br',
  generateRobotsTxt: true,
  exclude: ['/painel-nb-2025', '/painel-nb-2025/*', '/api/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://irpf.qaplay.com.br/server-sitemap.xml',
    ],
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/painel-nb-2025', '/api/'] },
    ],
  },
};
```
