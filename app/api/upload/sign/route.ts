import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "imagens";

async function ensureBucket() {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET);
    if (!exists) {
      await supabaseAdmin.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: 20 * 1024 * 1024,
        allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
      });
    }
  } catch {
    // bucket já existe
  }
}

// POST — gera URL assinada para upload direto do browser ao Supabase
// O arquivo NUNCA passa pelo servidor Next.js (sem limite de 4.5 MB)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { filename, type } = await req.json() as { filename: string; type: string };

    const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!ALLOWED.includes(type)) {
      return NextResponse.json({ error: "Tipo de arquivo inválido" }, { status: 400 });
    }

    const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
    const baseName = filename
      .replace(/\.[^.]+$/, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .toLowerCase()
      .slice(0, 60);

    const path = `${Date.now()}-${baseName}.${ext}`;

    await ensureBucket();

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUploadUrl(path);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const publicUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

    return NextResponse.json({
      path,
      token: data.token,
      signedUrl: data.signedUrl,
      publicUrl,
    });
  } catch (err) {
    console.error("Sign error:", err);
    return NextResponse.json({ error: "Erro ao gerar URL de upload" }, { status: 500 });
  }
}
