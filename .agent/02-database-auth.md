# AGENTE: BANCO DE DADOS + AUTH

## Objetivo
Criar schema Prisma, lib de conexão Supabase, configuração NextAuth.

---

## ARQUIVO: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Lead {
  id        String   @id @default(cuid())
  nome      String
  email     String
  whatsapp  String?
  tipoDecl  String   // simples | completa | atrasada | retificacao | dependentes
  origem    String   @default("organico") // google | facebook | tiktok | ebook | organico
  status    String   @default("novo") // novo | contato | cliente | perdido
  mensagem  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@index([status])
  @@index([createdAt])
  @@map("leads")
}

model BlogPost {
  id        String   @id @default(cuid())
  titulo    String
  slug      String   @unique
  resumo    String
  conteudo  String
  tags      String[]
  autorIA   Boolean  @default(false)
  publicado Boolean  @default(false)
  metaTitle String
  metaDesc  String
  keywords  String[]
  views     Int      @default(0)
  readTime  Int      @default(5)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([slug])
  @@index([publicado, createdAt])
  @@map("blog_posts")
}

model Contato {
  id        String   @id @default(cuid())
  nome      String
  email     String
  whatsapp  String?
  assunto   String
  mensagem  String
  lido      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@map("contatos")
}

model EbookDownload {
  id        String   @id @default(cuid())
  nome      String
  email     String
  whatsapp  String?
  emailSeq  Int      @default(0)
  createdAt DateTime @default(now())

  @@map("ebook_downloads")
}
```

---

## ARQUIVO: `lib/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## ARQUIVO: `lib/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client com service role para operações admin (server-side only)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
```

---

## ARQUIVO: `lib/auth.ts`

```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const isValidUser =
          credentials.username === process.env.ADMIN_USERNAME;

        if (!isValidUser) return null;

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          process.env.ADMIN_PASSWORD_HASH!
        );

        if (!isValidPassword) return null;

        return {
          id: "admin",
          name: "Nilson Brites",
          email: process.env.ADMIN_EMAIL,
        };
      },
    }),
  ],
  pages: {
    signIn: "/painel-nb-2025/login",
  },
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

---

## ARQUIVO: `app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## ARQUIVO: `middleware.ts`

```typescript
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/painel-nb-2025/:path*"],
};
```
