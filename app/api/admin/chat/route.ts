import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { gpt4o, MODELS } from "@/lib/llm-providers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await request.json();

    const systemPrompt = `Voce e o assistente IA privado do administrador da Consultoria IRPF NSB.
Contexto do negocio:
- Servico: Declaracao IRPF (novas, atrasadas, retificacoes, malha fina)
- Atendimento: 100% online, todo o Brasil
- WhatsApp: +55 11 94082-5120
- Site: irpf.qaplay.com.br
- Stack: Next.js 14 + Supabase + GPT-4o (chatbot) + Groq (blog)

Ajude com: analise de metricas, sugestoes de marketing, copy para campanhas, estrategia de conteudo, analise de leads, e qualquer questao tecnica ou de negocio.
Seja direto, pratico e orientado a acao.`;

    const stream = await gpt4o.chat.completions.create({
      model: MODELS.adminIA,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      stream: true,
      max_tokens: 2000,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Admin chat error:", error);
    return NextResponse.json(
      { error: "Failed to process" },
      { status: 500 }
    );
  }
}
