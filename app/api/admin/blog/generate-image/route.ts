import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import OpenAI from "openai";
import { geminiClient } from "@/lib/llm-providers";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";
import { generateImageAlt } from "@/lib/image-alt";

export const runtime = "nodejs";
export const maxDuration = 60;

const BUCKET = "blog-images";

// GPT-4o: apenas para gerar o prompt visual — não gera imagens
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

⚠️ PROIBIÇÕES CRÍTICAS — NUNCA VIOLE (CAUSAM BUGS VISUAIS GRAVES):
• NUNCA mencione marca de câmera (Canon, Nikon, Leica, Sony, etc) — DALL-E literaliza a câmera como objeto físico na cena
• NUNCA peça texto legível em documentos, formulários, telas ou envelopes — DALL-E distorce qualquer texto
• NUNCA inclua cédulas de dinheiro (R$, $, €) — causam distorção visual grave
• NUNCA inclua pessoas, rostos, mãos ou silhuetas na cena
• MÁXIMO 3 elementos simultâneos — cenas simples rendem muito melhor
• Use "35mm film aesthetic" para estética fotográfica, SEM citar marcas

═══════════════════════════════════════
PROCESSO OBRIGATÓRIO — 3 ETAPAS INTERNAS
═══════════════════════════════════════

ETAPA 1 — LEITURA PROFUNDA (raciocine internamente, não escreva):
• Qual é a emoção central deste post? (alívio? urgência? medo? satisfação? confusão?)
• Que objeto físico, documento ou cena um brasileiro que viveu essa situação associaria instantaneamente?
• Existe algum elemento tipicamente brasileiro que personifica este tema?
• O post é técnico/instrucional ou narrativo/emocional?

ETAPA 2 — DECISÃO VISUAL (raciocine internamente, não escreva):
• Presença humana: ZERO — apenas objetos e superfícies, sem pessoas, rostos, mãos ou silhuetas em qualquer tipo de post
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
• Formulário DIRPF impresso em papel branco, campos em branco (SEM texto legível)
• Documento impresso sem texto legível sobre mesa

Finanças (sem cédulas, sem texto legível):
• Moeda metálica dourada ou prateada única sobre superfície (NUNCA cédulas — causam distorção)
• Calculadora física com teclas numéricas sobre mesa escura
• Pasta AZ fechada de cor neutra (bege, cinza, preto)
• Envelope lacrado sem texto visível

Ambientes brasileiros autênticos:
• Mesa de trabalho em apartamento paulistano com janela dando para prédios cinzas
• Cartório de bairro com balcão de fórmica empoeirado e carimbo ao lado
• Escritório contábil com armário de aço cinza e pilhas de pastas AZ ao fundo
• Home office improvisado com notebook antigo sobre mesa de jantar de madeira
• Sala de espera de agência bancária com cadeiras de plástico laranja e fila

═══════════════════════════════════════
SPECS TÉCNICAS OBRIGATÓRIAS
═══════════════════════════════════════

• Estética fotográfica: use "35mm film aesthetic, documentary style" — NUNCA mencione marcas de câmera (Canon, Nikon, Leica, etc) pois DALL-E coloca a câmera literalmente na cena
• Profundidade de campo rasa: "shallow depth of field, soft bokeh background"
• Grão sutil: "subtle film grain" — sem nomear marca de filme
• PROIBIDO: câmeras, lentes, tripés ou qualquer equipamento fotográfico como objeto na cena
• Luz ESPECÍFICA — nunca escreva "natural light" — especifique: direção + qualidade + horário + local
    ex: "side light 7:40am through aluminum venetian blinds, east-facing São Paulo apartment"
    ex: "single incandescent desk lamp 2700K casting warm cone, rest of room in complete darkness"
    ex: "overcast midday diffused light from north-facing window, flat and slightly clinical"
• Imperfeições físicas (mínimo 2): leve aberração cromática nas bordas, vinheta mínima, reflexo indesejado em superfície brilhante, micro-vibração imperceptível no fundo, marca de copo sobre papel, pó visível em superfície fosca
• Ambientação hiper-específica: não "desk" mas "worn melamine desk with dried coffee ring and peeling edge strip"

═══════════════════════════════════════
REGRAS ABSOLUTAS
═══════════════════════════════════════

• PROIBIDO qualquer texto, letra ou número legível em qualquer superfície — documentos em branco, telas apagadas, sem preenchimento de qualquer tipo
• A foto deve parecer tirada por fotojornalista documental brasileiro — nunca por banco de imagens americano
• Composição sempre assimétrica pela regra dos terços, nunca perfeitamente centralizada
• Cada prompt deve ser absolutamente único para este post — nunca repita cenas genéricas
• Sem gráficos flutuantes, interfaces holográficas, efeitos digitais ou elementos CGI
• ZERO presença humana — sem rostos, silhuetas, costas, ombros ou mãos
• MÁXIMO 3 elementos simultâneos na cena — minimalismo produz resultados superiores

FORMATO DE SAÍDA: Retorne APENAS o texto do prompt em inglês fotográfico, sem aspas, sem prefácio, sem explicação. Máximo 120 palavras.`,
        },
        {
          role: "user",
          content: `Crie o prompt visual para este post:\n\nTÍTULO: ${post.title}\nRESUMO: ${post.summary ?? ""}\nTEMA: ${(post.tags ?? []).slice(0, 3).join(", ") || "IRPF, imposto de renda"}\n\nLembre: MÁXIMO 3 elementos. ZERO texto legível. ZERO marcas de câmera. ZERO cédulas. ZERO pessoas.`,
        },
      ],
      temperature: 0.6,
      max_tokens: 150,
    });

    const imagePrompt =
      (promptCompletion.choices?.[0]?.message?.content ?? "").trim() ||
      `Editorial documentary photography, single golden coin resting on dark wooden desk, silver pen beside blank white document, warm window light from left, shallow depth of field, 35mm film aesthetic, muted earth tones, no text visible anywhere, minimalist composition, photorealistic`;

    // 3. Gemini 2.5 Flash Image — gerador de imagens (gratuito, sem custo por imagem)
    console.log("[Image] Gerando com Gemini 2.5 Flash Image...");
    if (!geminiClient) {
      return NextResponse.json({ error: "GEMINI_API_KEY não configurada" }, { status: 500 });
    }
    const imageModel = geminiClient.getGenerativeModel({
      model: "gemini-2.5-flash-preview-04-17",
    });
    const geminiResult = await imageModel.generateContent({
      contents: [{ role: "user", parts: [{ text: imagePrompt }] }],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generationConfig: { responseModalities: ["IMAGE"] } as any,
    });
    const candidate = geminiResult.response.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => p.inlineData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;
    if (!imagePart?.inlineData) {
      return NextResponse.json({ error: "Gemini não retornou imagem" }, { status: 500 });
    }
    const { data: base64Data, mimeType: imgMimeType } = imagePart.inlineData as {
      data: string;
      mimeType: string;
    };
    const buffer = Buffer.from(base64Data, "base64");
    const imgExt = imgMimeType === "image/jpeg" ? "jpg" : "png";
    console.log(`[Image] Gemini Image gerado com sucesso (${imgMimeType}).`);

    // 4. Upload para Supabase Storage
    const fileName = `${post.slug}.${imgExt}`;

    await ensureBucket();

    // Deletar arquivo anterior explicitamente para forçar invalidação do CDN Supabase.
    // O upsert sozinho não invalida o cache da CDN — apenas sobrescreve o objeto.
    // Tenta remover ambas as extensões possíveis (jpg e png) para limpar cache.
    await Promise.allSettled([
      supabaseAdmin.storage.from(BUCKET).remove([`${post.slug}.png`]),
      supabaseAdmin.storage.from(BUCKET).remove([`${post.slug}.jpg`]),
    ]);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType: imgMimeType, upsert: false });

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
        imageAttribution: null, // Gemini images não requerem atribuição
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ imageUrl: publicUrl, prompt: imagePrompt, imageAlt, imageSource: "gemini" });
  } catch (err) {
    console.error("[generate-image]", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
