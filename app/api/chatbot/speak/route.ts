import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { cleanTextForTTS } from "@/lib/tts-utils";

// NOTA: playai-tts do Groq foi desativado em março/2026 (model_decommissioned).
// Groq não oferece mais TTS — usando OpenAI tts-1 (rápido e de baixo custo).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",  // voz feminina natural, excelente em português
      input,
      speed: 1.05,
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
