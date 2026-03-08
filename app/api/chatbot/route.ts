import { NextRequest, NextResponse } from "next/server";
import { gpt4o, MODELS } from "@/lib/llm-providers";
import { CHATBOT_SYSTEM_PROMPT } from "@/lib/chatbot-prompt";

export const dynamic = "force-dynamic";

const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (entry.count >= 20) return false;

  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Muitas mensagens. Aguarde um momento." },
        { status: 429 }
      );
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Mensagens invalidas." },
        { status: 400 }
      );
    }

    // Sanitize: reject messages with non-string content or oversized payloads
    const sanitized = messages.filter(
      (m) =>
        m &&
        typeof m.role === "string" &&
        typeof m.content === "string" &&
        m.content.length <= 2000 &&
        ["user", "assistant"].includes(m.role)
    );

    if (sanitized.length === 0) {
      return NextResponse.json({ error: "Mensagens invalidas." }, { status: 400 });
    }

    // Off-topic guard: detect obvious jailbreak / social-engineering patterns
    const lastUserMsg = sanitized
      .filter((m) => m.role === "user")
      .at(-1)?.content?.toLowerCase() ?? "";

    const BLOCKED_PATTERNS = [
      // Hypothetical framing
      /vamos supor/,
      /imagine que/,
      /finja que/,
      /fingir que/,
      /simule que/,
      /como se fosse/,
      /suponha que/,
      /hipoteticamente/,
      /em um mundo onde/,
      // Role / persona hijack
      /você (é|sera|vai ser) um/,
      /seu novo (papel|personagem|modo)/,
      /ignore (suas|as) instruç/,
      /esqueça (suas|as) instruç/,
      /novo prompt/,
      /system prompt/,
      /prompt injection/,
      /ignore previous/,
      /override/,
      /jailbreak/,
      /dan mode/,
      // Clearly off-topic domains
      /erro 4\d{2}/,
      /status code/,
      /html.*css/,
      /javascript.*code/,
      /programaç/,
      /hackear/,
      /senha.*wifi/,
      /como invadir/,
    ];

    const isBlocked = BLOCKED_PATTERNS.some((p) => p.test(lastUserMsg));
    if (isBlocked) {
      return NextResponse.json(
        {
          error:
            "Isso esta fora da minha area. Posso te ajudar apenas com questoes sobre Imposto de Renda.",
        },
        { status: 200 }
      );
    }

    // Keep only last 10 messages for context
    const recentMessages = sanitized.slice(-10);

    const stream = await gpt4o.chat.completions.create({
      model: MODELS.chatbot,
      messages: [
        { role: "system", content: CHATBOT_SYSTEM_PROMPT },
        ...recentMessages,
      ],
      max_tokens: 400,
      temperature: 0.7,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}
