import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import OpenAI from "openai";
import { groqLlama, MODELS } from "@/lib/llm-providers";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { generateImageAlt } from "@/lib/image-alt";

export const runtime = "nodejs";
export const maxDuration = 60;

const BUCKET = "blog-images";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function ensureBucket() {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.some((b) => b.name === BUCKET)) {
      await supabaseAdmin.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: 20 * 1024 * 1024,
        allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
      });
    }
  } catch {
    // bucket ja existe
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { postId } = (await req.json()) as { postId: string };
    if (!postId) {
      return NextResponse.json({ error: "postId obrigatório" }, { status: 400 });
    }

    // 1. Buscar título e resumo no banco
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { id: true, title: true, summary: true, slug: true, content: true, tags: true, keywords: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    // 2. GPT-4o lê o post completo, decide a cena visual e gera o prompt técnico para o DALL-E 3
    const promptCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Você é o diretor de fotografia editorial do maior portal de finanças pessoais do Brasil.
Sua única função é criar prompts DALL-E 3 que gerem fotografias fotorrealistas, únicas e contextualmente perfeitas para cada post.

═══════════════════════════════════════
PROCESSO OBRIGATÓRIO — 3 ETAPAS INTERNAS
═══════════════════════════════════════

ETAPA 1 — LEITURA PROFUNDA (raciocine internamente, não escreva):
• Qual é a emoção central deste post? (alívio? urgência? medo? satisfação? confusão?)
• Que objeto físico, documento ou cena um brasileiro que viveu essa situação associaria instantaneamente?
• Existe algum elemento tipicamente brasileiro que personifica este tema?
• O post é técnico/instrucional ou narrativo/emocional?

ETAPA 2 — DECISÃO VISUAL (raciocine internamente, não escreva):
• Presença humana — decida com base no tom do post:
    → Post técnico/instrucional → APENAS objetos, documentos ou no máximo mãos parcialmente visíveis
    → Post sobre experiência/ansiedade/prazo/medo → silhueta desfocada ao fundo, ou costas de pessoa
    → Post sobre conquista/resultado/restituição → ombro ou costas de alguém olhando para algo com alívio
    → Post sobre dados/tabelas/leis/mudanças → zero presença humana — apenas documentos e objetos
• Qual é o OBJETO HERÓI desta imagem? (escolha apenas um elemento central)
• Qual o ambiente específico? (mesa de apartamento em SP? agência bancária? cartório? home office improvisado?)
• Qual horário e tipo de luz? (manhã com sol lateral duro? tarde nublada difusa? noite com abajur quente?)

ETAPA 3 — COMPOSIÇÃO:
Escreva o prompt DALL-E 3 em inglês técnico-fotográfico, incluindo todos os elementos das specs abaixo.

═══════════════════════════════════════
REFERÊNCIAS VISUAIS BRASILEIRAS
═══════════════════════════════════════

Documentos fiscais autênticos:
• Formulário DIRPF impresso em papel A4 com cabeçalho "Receita Federal do Brasil"
• Envelope pardo com brasão do governo federal e código de barras impresso
• CPF plastificado amarelado com bordas desgastadas e cantos arredondados
• Comprovante de rendimentos em papel timbrado com carimbo de empresa
• Declaração de Ajuste Anual com campos preenchidos à caneta esferográfica azul
• Informe de rendimentos do banco com logotipo desbotado após fotocópia

Dinheiro e finanças:
• Cédulas de R$ 50 e R$ 100 parcialmente visíveis dentro de carteira de couro marrom surrada
• Comprovante de Pix em papel térmico levemente amarrotado sobre mesa
• Extrato bancário da Caixa Econômica ou Bradesco em papel A4 dobrado ao meio
• Carnê de pagamento com talões rasgados e cola aparente nas bordas
• Nota fiscal eletrônica impressa com código QR no canto inferior

Ambientes brasileiros autênticos:
• Mesa de trabalho em apartamento paulistano com janela dando para prédios cinzas
• Cartório de bairro com balcão de fórmica empoeirado e carimbo ao lado
• Escritório contábil com armário de aço cinza e pilhas de pastas AZ ao fundo
• Home office improvisado com notebook antigo sobre mesa de jantar de madeira
• Sala de espera de agência bancária com cadeiras de plástico laranja e fila

═══════════════════════════════════════
SPECS TÉCNICAS OBRIGATÓRIAS
═══════════════════════════════════════

• Câmera + lente: escolha UMA combinação realista
    ex: "shot on Canon EOS 5D Mark IV, 50mm f/1.4 Sigma Art"
    ex: "Nikon D750, 35mm f/1.8G ED, slightly off-level hand-held"
    ex: "Leica M11, 35mm Summicron f/2, worn paint on body"
• Abertura rasa (f/1.4–f/2.8) com bokeh suave recobrindo o fundo
• Grão de filme: Kodak Portra 400, Fujifilm Pro 400H, ou Ilford HP5 Plus
• Luz ESPECÍFICA — nunca escreva "natural light" — especifique: direção + qualidade + horário + local
    ex: "side light 7:40am through aluminum venetian blinds, east-facing São Paulo apartment"
    ex: "single incandescent desk lamp 2700K casting warm cone, rest of room in complete darkness"
    ex: "overcast midday diffused light from north-facing window, flat and slightly clinical"
• Imperfeições físicas (mínimo 2): leve aberração cromática nas bordas, vinheta mínima, reflexo indesejado em superfície brilhante, micro-vibração imperceptível no fundo, marca de copo sobre papel, pó visível em superfície fosca
• Ambientação hiper-específica: não "desk" mas "worn melamine desk with dried coffee ring and peeling edge strip"

═══════════════════════════════════════
REGRAS ABSOLUTAS
═══════════════════════════════════════

• Qualquer texto visível na imagem — em formulário, envelope, tela, placa — DEVE estar em português brasileiro correto, sem erros ortográficos ou gramaticais
• A foto deve parecer tirada por fotojornalista documental brasileiro — nunca por banco de imagens americano
• Composição sempre assimétrica pela regra dos terços, nunca perfeitamente centralizada
• Cada prompt deve ser absolutamente único para este post — nunca repita cenas genéricas
• Sem gráficos flutuantes, interfaces holográficas, efeitos digitais ou elementos CGI
• Sem rostos visíveis — silhuetas desfocadas, costas, ombros e mãos são permitidos quando o tema humano pede

FORMATO DE SAÍDA: Retorne APENAS o texto do prompt em inglês fotográfico, sem aspas, sem prefácio, sem explicação. Máximo 120 palavras.`,
        },
        {
          role: "user",
          content: `Crie o prompt DALL-E 3 para o seguinte post do blog de IRPF brasileiro:\n\nTÍTULO: ${post.title}\nTAGS: ${(post.tags ?? []).join(", ") || "IRPF, imposto de renda"}\nPALAVRAS-CHAVE: ${(post.keywords ?? []).join(", ") || ""}\nRESUMO: ${post.summary ?? ""}\nINÍCIO DO CONTEÚDO:\n${post.content?.slice(0, 600) ?? ""}\n\nSiga as 3 etapas internas obrigatórias ANTES de escrever qualquer coisa. A imagem deve ser 100% única para ESTE post específico — nunca genérica. Qualquer texto visível na imagem deve estar em português brasileiro correto.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 250,
    });

    const dallePrompt =
      (promptCompletion.choices?.[0]?.message?.content ?? "").trim() ||
      `Hands of a Brazilian accountant in a beige linen shirt sleeve pressing keys on a worn desktop calculator, beside a printed DIRPF form with blue ballpoint pen annotations reading "Declaração de Ajuste Anual — Receita Federal do Brasil", Fujifilm Pro 400H grain, shot on Nikon D750 35mm f/1.8G at f/2, side light 8:20am through half-open aluminum venetian blinds casting striped shadows across paper, worn melamine desk with dried coffee ring and peeling edge strip, slight chromatic aberration at corners, minimal lens vignette`;

    // 3. DALL-E 3 — único gerador de imagens (qualidade HD superior ao Gemini)
    console.log("[Image] Gerando com DALL-E 3 HD...");
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: dallePrompt,
      size: "1792x1024",
      quality: "hd",
      style: "natural",
      n: 1,
      response_format: "url",
    });

    const imageUrl = imageResponse.data?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: "DALL-E não retornou imagem" }, { status: 500 });
    }

    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      return NextResponse.json({ error: "Falha ao baixar imagem do DALL-E" }, { status: 500 });
    }
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    console.log("[Image] DALL-E 3 HD gerado com sucesso.");

    // 4. Upload para Supabase Storage
    const fileName = `${post.slug}.png`;

    await ensureBucket();

    // Deletar arquivo anterior explicitamente para forçar invalidação do CDN Supabase.
    // O upsert sozinho não invalida o cache da CDN — apenas sobrescreve o objeto.
    await supabaseAdmin.storage.from(BUCKET).remove([fileName]);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType: "image/png", upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Cache-busting na URL: força Next.js Image optimizer a tratar como recurso novo
    // (Next.js cacheia imagens otimizadas por minimumCacheTTL — a URL com ?v= diferente
    // bypassa esse cache e busca a imagem recém-enviada ao storage)
    const baseUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;
    const publicUrl = `${baseUrl}?v=${Date.now()}`;

    // PONTO 3b: gerar imageAlt via Groq
    const imageAlt = await generateImageAlt(post.title);

    // 5. Atualizar campo coverImage no banco
    await prisma.blogPost.update({
      where: { id: postId },
      data: {
        coverImage: publicUrl,
        imageAlt,
        imageAttribution: null, // DALL-E images don't require Unsplash attribution
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ imageUrl: publicUrl, prompt: dallePrompt, imageAlt, imageSource: "dall-e" });
  } catch (err) {
    console.error("[generate-image]", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
