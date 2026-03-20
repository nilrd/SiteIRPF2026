import { NextRequest, NextResponse } from "next/server";
import { groqLlama } from "@/lib/llm-providers";
import { cleanTextForTTS } from "@/lib/tts-utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const raw: unknown = body?.text;

    if (typeof raw !== "string" || raw.trim().length === 0) {
      return NextResponse.json({ error: "Texto ausente." }, { status: 400 });
    }

    const input = cleanTextForTTS(raw);
    if (!input) {
      return NextResponse.json({ error: "Texto vazio após limpeza." }, { status: 400 });
    }

    const mp3 = await groqLlama.audio.speech.create({
      model: "playai-tts",
      voice: "Fritz-PlayAI",
      input,
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
