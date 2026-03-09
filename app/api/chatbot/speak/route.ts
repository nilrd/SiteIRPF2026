import { NextRequest, NextResponse } from "next/server";
import { groqLlama } from "@/lib/llm-providers";

export const dynamic = "force-dynamic";

const MAX_TEXT_LENGTH = 1000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: unknown = body?.text;

    if (typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Texto ausente." }, { status: 400 });
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: "Texto muito longo para sintetizar." },
        { status: 400 }
      );
    }

    const mp3 = await groqLlama.audio.speech.create({
      model: "playai-tts",
      voice: "Fritz-PlayAI",
      input: text.trim(),
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(buffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[speak] erro:", err);
    return NextResponse.json(
      { error: "Erro ao gerar audio. Tente novamente." },
      { status: 500 }
    );
  }
}
