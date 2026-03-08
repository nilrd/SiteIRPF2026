import { NextRequest, NextResponse } from "next/server";
import { gpt4o } from "@/lib/llm-providers";

export const dynamic = "force-dynamic";

const MAX_AUDIO_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File | null;

    if (!audio) {
      return NextResponse.json({ error: "Audio ausente." }, { status: 400 });
    }

    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: "Audio muito grande. Limite: 10 MB." },
        { status: 400 }
      );
    }

    const ALLOWED_TYPES = [
      "audio/webm",
      "audio/ogg",
      "audio/mp4",
      "audio/mpeg",
      "audio/wav",
      "audio/x-m4a",
    ];
    if (!ALLOWED_TYPES.includes(audio.type)) {
      return NextResponse.json(
        { error: "Tipo de audio invalido." },
        { status: 400 }
      );
    }

    const transcription = await gpt4o.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      language: "pt",
    });

    return NextResponse.json({ text: transcription.text });
  } catch (err) {
    console.error("[transcribe] erro:", err);
    return NextResponse.json(
      { error: "Erro ao transcrever audio. Tente novamente." },
      { status: 500 }
    );
  }
}
