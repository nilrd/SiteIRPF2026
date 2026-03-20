import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { text } = (await req.json()) as { text?: string };
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text obrigatório" }, { status: 400 });
    }

    const clean = text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/#{1,6}\s/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/`[^`]+`/g, "")
      .slice(0, 4000);

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: clean,
      speed: 1.05,
      response_format: "mp3",
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("[speak-openai]", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
