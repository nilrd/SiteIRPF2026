# AGENTE: COMPONENTES E PÁGINAS DO SITE

## Objetivo
Criar todos os componentes visuais e páginas públicas do site.
Design obrigatório: igual ao `PREVIEW_DESIGN_v2.html` — editorial brutalista, preto/branco/verde néon.

---

## SKILL: Como criar cada componente

Antes de criar qualquer componente:
1. Fundo `#F5F5F2` (branco off), texto `#0A0A0A`, acento `#C6FF00`
2. Fonte: `font-black` para títulos grandes, `font-sans` para corpo
3. Bordas: `border-b border-black/10` para separadores
4. Sem cards arredondados — usar `rounded-sm` no máximo
5. Animações: Framer Motion `fadeUp` com `staggerChildren`
6. Sempre exportar como `export default function NomeComponente()`

---

## ARQUIVO: `app/(site)/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Archivo, Archivo_Black } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import { JsonLd } from "@/components/seo/JsonLd";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-archivo",
  display: "swap",
});

const archivoBold = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://irpf.qaplay.com.br"),
  title: {
    template: "%s | Nilson Brites IRPF",
    default: "Declaração de Imposto de Renda 2025 | Nilson Brites IRPF",
  },
  description:
    "Declaração de IR em 24h para todo Brasil. Analista Financeiro com 10 anos de experiência. Preço justo, suporte por 1 ano. IRPF novo, atrasado e retificação.",
  openGraph: {
    siteName: "Nilson Brites IRPF",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://irpf.qaplay.com.br" },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${archivoBold.variable}`}>
      <body>
        <JsonLd />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
```

---

## ARQUIVO: `components/site/Navbar.tsx`

Criar navbar com:
- Fundo `#F5F5F2` sticky, border-bottom 1px solid rgba(0,0,0,0.1)
- Logo: ponto verde piscando + "Nilson Brites" em Archivo Black
- Links: Serviços | Como Funciona | Ferramentas | Blog
- CTA: botão preto "Falar no WhatsApp" — ao clicar, abre WA com mensagem pré-preenchida
- Mobile: hamburger com menu drawer que abre de cima
- Altura: 60px desktop, 56px mobile
- Framer Motion: fade-in no mount

```typescript
// Link WhatsApp:
const WA_LINK = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}?text=${encodeURIComponent(process.env.NEXT_PUBLIC_WA_MESSAGE || '')}`;
```

---

## ARQUIVO: `app/(site)/page.tsx` — HOME COMPLETA

Montar nesta ordem exata:
1. `<HeroSection />`
2. `<MarqueeStrip />`
3. `<ServicosSection />`
4. `<SobreSection />`
5. `<ComoFuncionaSection />`
6. `<DiferenciaisSection />`
7. `<UrgenciaSection />`
8. `<FerramentasPreview />`
9. `<BlogPreview />`
10. `<FAQSection />`
11. `<CTAFinal />`

Metadata da home:
```typescript
export const metadata: Metadata = {
  title: "Declaração de Imposto de Renda 2025 | Nilson Brites IRPF",
  description: "Declare seu IR em 24h para todo Brasil. Analista Financeiro com 10 anos de experiência. Preço abaixo do mercado. IRPF novo, atrasado, retificação e dependentes.",
  keywords: ["declaração imposto de renda 2025", "IRPF online", "declaração ir atrasada", "retificação IR"],
  openGraph: {
    title: "Declare seu IR em 24h — Nilson Brites | Todo Brasil",
    url: "https://irpf.qaplay.com.br",
  },
};
```

---

## ARQUIVO: `components/site/HeroSection.tsx`

Layout exato do preview:
- Grid: info superior (nome/email) dividido em 2 colunas
- Headline principal: `clamp(52px, 6.5vw, 96px)` Archivo Black, letra-spacing -0.04em
- "em 24 horas." em italic font-weight 300 cor cinza
- Badge com dot verde piscando: "Analista Financeiro — 10 anos de experiência"
- Subtítulo font-weight 300, italic, cor #555
- CTAs: btn verde "Consultar no WhatsApp →" + link "Simular restituição"
- Foto à direita: `<Image>` com fallback placeholder preto
- Background number "IR" gigante transparente com -webkit-text-stroke
- Stats bar bottom: 4 colunas com bordas verticais

Props necessárias:
```typescript
// Foto vem de: /public/foto-nilson-hero.jpg (Nilson coloca depois)
// Placeholder: div com bg-[#1a1a1a] enquanto não tem foto
```

---

## ARQUIVO: `components/site/MarqueeStrip.tsx`

Faixa preta com texto correndo:
- Texto: "Declaração IRPF ✦ IRPF Atrasado ✦ Retificação ✦ Dependentes ✦ Todo Brasil ✦ Preço Justo ✦ 100% Online ✦ Suporte 1 Ano"
- Duplicar para loop infinito
- CSS animation `marquee 22s linear infinite`
- Texto branco opacity 30%, símbolo ✦ em verde

---

## ARQUIVO: `components/site/ServicosSection.tsx`

Lista de serviços estilo editorial:
```
Linha 1: [01] Declaração Nova ——————— Assalariados, autônomos, MEI, aposentados [Mais Pedido] ↗
Linha 2: [02] IRPF Atrasado ————————— Regularize antes que as multas cresçam [Urgente] ↗
Linha 3: [03] Retificação ——————————— Corrija declarações já enviadas [Disponível] ↗
Linha 4: [04] Declaração com Dependentes — Filhos, cônjuges, maximize deduções [Disponível] ↗
```
- Hover: padding-left aumenta 16px (transition suave)
- Arrow ↗ rotaciona 45deg no hover
- Tag "Mais Pedido" e "Urgente" em bg verde néon
- Tags "Disponível" com border, sem fill

---

## ARQUIVO: `components/site/SobreSection.tsx`

Split em 2 colunas:
- Esquerda: foto escura (bg-[#111]) com overlay gradiente + badge "10+" em verde néon no canto inferior
- Direita: texto com section-label + h2 + 2 parágrafos + linha separadora + contatos (WA + email)
- Foto: `/public/foto-nilson-sobre.jpg` com fallback placeholder

---

## ARQUIVO: `components/site/ComoFuncionaSection.tsx`

3 colunas com passos:
- Numerais gigantes 80px em verde opacity 30%
- Título de cada passo em Archivo Black
- Texto descritivo font-weight 300
- Fundo: `#0A0A0A` (seção escura)
- Colunas com bordas entre elas

---

## ARQUIVO: `components/site/UrgenciaSection.tsx`

Seção escura com urgência:
- Fundo `#0A0A0A`
- Grid: texto à esq + número de multa à dir
- "!" gigante decorativo em opacity 0.02
- Multa: `R$6.275` em Archivo Black cor verde néon
- h2: "IR em atraso custa caro." — "caro" em verde
- Botão: btn verde "Regularizar Agora →"

---

## ARQUIVO: `components/site/FAQSection.tsx`

Accordion com 10 perguntas mais buscadas no Google:
1. Quem é obrigado a declarar IR em 2025?
2. Qual o prazo para declarar o imposto de renda 2025?
3. Quanto custa fazer uma declaração de IR?
4. Como declarar imposto de renda pela primeira vez?
5. O que acontece se não declarar o IR?
6. Como funciona o IR atrasado?
7. Quais documentos preciso para declarar o IR?
8. Como incluir dependente na declaração?
9. O que é retificação de declaração?
10. Quando cai a restituição do IR 2025?

Schema FAQ para rich snippets (JSON-LD no head).
Usar `@radix-ui/react-accordion` customizado no estilo brutalista.

---

## ARQUIVO: `components/ferramentas/CalculadoraIR.tsx`

Calculadora funcional com tabela IRPF 2025 OFICIAL:

```typescript
// lib/ir-calculations.ts
export const TABELA_IRPF_2025_ANUAL = [
  { ate: 24511.92, aliquota: 0,    parcela: 0 },
  { ate: 33919.80, aliquota: 0.075, parcela: 1838.39 },
  { ate: 45012.60, aliquota: 0.15,  parcela: 4382.38 },
  { ate: 55976.16, aliquota: 0.225, parcela: 7758.57 },
  { ate: Infinity, aliquota: 0.275, parcela: 10557.65 },
];

export const DEDUCAO_DEPENDENTE_ANUAL = 2275.08;
export const DEDUCAO_EDUCACAO_MAX = 3561.50; // por pessoa

export function calcularIR(params: {
  rendaBrutaAnual: number;
  numeroDependentes: number;
  inssPago: number;
  gastosSaude: number;
  gastosEducacao: number;
  irRetidoFonte: number;
}): {
  baseCalculo: number;
  irDevido: number;
  diferenca: number; // positivo = a pagar, negativo = restituição
  tipo: "pagar" | "restituir" | "zerado";
} {
  // Implementar cálculo correto
}
```

Inputs com React Hook Form + Zod. Output em tempo real (onChange).
CTA após cálculo: abre WhatsApp com resultado pré-preenchido na mensagem.

---

## ARQUIVO: `components/ferramentas/SimuladorMulta.tsx`

Calcula multa de atraso:
- Input: ano da declaração não feita (2020-2024)
- Input: valor estimado do IR a pagar (ou R$0 se restituição)
- Cálculo: multa mínima R$165,74 OU 1% ao mês do IR devido, o que for maior
- Máximo: 20% do IR ou R$6.275,00
- Mais: juros Selic acumulada por ano (buscar via API do BCB ou hardcoded por ano)
- Output: total da multa + opção "Quero regularizar agora" → WA

---

## ARQUIVO: `app/(site)/blog/[slug]/page.tsx`

```typescript
// generateStaticParams para SSG dos posts publicados
export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { publicado: true },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

// generateMetadata dinâmico
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.metaDesc,
    keywords: post.keywords,
    openGraph: { title: post.titulo, description: post.resumo },
  };
}
```

Layout do post:
- Breadcrumbs no topo
- Título grande Archivo Black
- Meta: data + tempo de leitura + categoria
- Conteúdo HTML sanitizado (dangerouslySetInnerHTML)
- Box CTA no meio do texto: "Prefere que eu faça por você? Fale agora →"
- Sidebar: form de captura de lead + 3 posts relacionados
- FAQ do post com Schema JSON-LD
- Compartilhar: WhatsApp + X + LinkedIn
- Schema Article completo

---

## ARQUIVO: `app/(site)/ebook/page.tsx`

Landing page do e-book:
- Headline: "Guia Completo IRPF 2025 — Grátis"
- Preview das seções do e-book
- Form: Nome + Email + WhatsApp → ao submeter, chama `/api/ebook`
- Após envio: mensagem de sucesso + "Verifique seu email"
- O e-book PDF fica em `/public/ebook/guia-irpf-2025.pdf`
