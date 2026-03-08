# AGENTE: PAINEL ADMINISTRATIVO

## Objetivo
Criar painel admin completo em `/painel-nb-2025` — protegido, não indexado, dark mode.

---

## REGRAS DO ADMIN

1. **URL secreta:** `/painel-nb-2025` — NUNCA linkar no site público
2. **Design:** Dark mode, fundo `#0D0D0D`, sidebar `#111111`, cards `#1A1A1A`
3. **Auth:** NextAuth session obrigatória em todas as rotas
4. **noindex:** metadata `robots: noindex, nofollow` no layout admin
5. **Cor de acento:** `#C6FF00` (mesmo verde do site)

---

## ARQUIVO: `app/(admin)/painel-nb-2025/layout.tsx`

```typescript
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";

export const metadata: Metadata = {
  title: "Admin — NB IRPF",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/painel-nb-2025/login");

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-white overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
```

---

## ARQUIVO: `app/(admin)/painel-nb-2025/login/page.tsx`

Página de login simples:
- Fundo preto total
- Formulário centralizado com campos usuário/senha
- Botão "Entrar" em verde néon
- Sem link público para esta página
- Usar `signIn` do NextAuth

---

## ARQUIVO: `components/admin/Sidebar.tsx`

```
Sidebar escura (bg-[#111111]) largura 240px:
- Logo "NB" + "Admin" no topo
- Menu:
  📊 Dashboard     → /painel-nb-2025
  👥 Leads         → /painel-nb-2025/leads
  📩 Contatos      → /painel-nb-2025/contatos
  📝 Blog          → /painel-nb-2025/blog
  🤖 IA            → submenu:
     🎯 Campanhas  → /painel-nb-2025/ia/campanhas
     📧 Email Mkt  → /painel-nb-2025/ia/email-mkt
     💬 Chat IA    → /painel-nb-2025/ia/chat
  ⚙️ Config        → /painel-nb-2025/configuracoes

- Badge de notificação nos Leads (contagem de novos)
- Link do site público no rodapé
- Botão logout no rodapé
```

---

## ARQUIVO: `app/(admin)/painel-nb-2025/page.tsx` — DASHBOARD

```typescript
// Buscar métricas do banco
async function getDashboardData() {
  const [
    totalLeads,
    leadsHoje,
    contatosNaoLidos,
    totalPosts,
    postsPublicados,
    ebookDownloads,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({
      where: { createdAt: { gte: startOfDay(new Date()) } },
    }),
    prisma.contato.count({ where: { lido: false } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { publicado: true } }),
    prisma.ebookDownload.count(),
  ]);
  // retornar todos
}
```

Layout do dashboard:
- 6 cards de métricas em grid 3x2
- Tabela "Últimos 10 leads" com status colorido
- Gráfico simples: leads por dia nos últimos 7 dias (usando div widths, não recharts)

---

## ARQUIVO: `app/(admin)/painel-nb-2025/leads/page.tsx`

Tabela completa de leads:
- Colunas: Nome | Email | WhatsApp | Tipo | Origem | Status | Data | Ações
- Filtros: status (dropdown) + tipo + origem + busca por nome/email
- Status com cores: novo=verde néon | contato=amarelo | cliente=verde | perdido=vermelho
- Ações por linha:
  - Mudar status (dropdown inline)
  - Abrir WhatsApp (ícone → link wa.me)
  - Marcar como cliente
- Paginação: 20 por página
- Botão "Exportar CSV" que baixa todos os leads filtrados

---

## ARQUIVO: `app/(admin)/painel-nb-2025/blog/page.tsx`

Gerenciador de posts:
- Lista todos os posts com: título, status (publicado/rascunho), data, autorIA badge, views
- Botão "Novo Post" → `/painel-nb-2025/blog/novo`
- Botão "Gerar com IA" → modal com input de keyword
- Toggle publicado/rascunho por linha
- Editar post: `/painel-nb-2025/blog/[id]`
- Deletar com confirmação

---

## ARQUIVO: `app/(admin)/painel-nb-2025/blog/novo/page.tsx`

Editor de post:
- Input: Título
- Input: Slug (auto-gerado do título, editável)
- Textarea: Resumo
- Textarea grande: Conteúdo (HTML)
- Input: Meta Title + Meta Description
- Tags: input com enter para adicionar
- Botões: "Salvar Rascunho" | "Publicar"

**Geração por IA:**
- Botão "Gerar com IA" no topo
- Modal: input de keyword
- Ao confirmar, faz POST /api/blog/generate
- Mostra streaming do conteúdo sendo gerado
- Preenche todos os campos automaticamente

---

## ARQUIVO: `components/admin/CampanhasGenerator.tsx`

```
Interface:
1. Select: Plataforma (Facebook | Google | TikTok | LinkedIn)
2. Select: Objetivo (Leads | Conversão | Awareness)
3. Input: Orçamento diário (R$)
4. Input: Prazo da campanha
5. Textarea: Briefing adicional (opcional)
6. Botão: "Gerar Campanha" → loading state

Output em streaming:
- Box com fundo escuro, fonte mono
- Botão copiar por seção
- Botão "Copiar Tudo"
- Botão "Nova Campanha" para limpar e recomeçar
```

---

## ARQUIVO: `components/admin/AIChat.tsx`

Chat livre com GPT-4o contextualizado no negócio:
- Interface de chat completa: mensagens do user à direita, IA à esquerda
- Input com Enter para enviar
- Histórico da conversa no estado local (não persiste)
- Streaming das respostas da IA
- Botão "Nova Conversa" para limpar
- Sugestões de prompts prontos:
  - "Analise os leads desta semana e sugira abordagens"
  - "Crie uma sequência de emails para leads frios"
  - "Como devo posicionar o serviço no TikTok?"
  - "Qual a melhor estratégia para o período do IR (fev-maio)?"

---

## ARQUIVO: `components/admin/EmailMktBuilder.tsx`

Gerador de templates de email:
- Select: Tipo de email (boas-vindas | urgência prazo | reativação | campanha IR atrasado)
- Input: Nome do destinatário (ou "{{nome}}" para template)
- Botão: "Gerar Template"
- Output: HTML do email pronto para copiar
- Preview do email renderizado
