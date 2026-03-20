import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const BUCKET = "imagens";
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

async function ensureBucket() {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET);
    if (!exists) {
      await supabaseAdmin.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: MAX_SIZE,
        allowedMimeTypes: ALLOWED_TYPES,
      });
    }
  } catch {
    // bucket provavelmente já existe
  }
}

// POST — upload de imagem
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo inválido. Use JPG, PNG, WebP ou GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 10 MB." },
        { status: 400 }
      );
    }

    await ensureBucket();

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const baseName = file.name
      .replace(/\.[^.]+$/, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .toLowerCase()
      .slice(0, 60);

    const fileName = `${Date.now()}-${baseName}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName);

    return NextResponse.json({
      url: urlData.publicUrl,
      fileName,
      size: file.size,
      type: file.type,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Erro interno no upload" }, { status: 500 });
  }
}

// GET — listar imagens do bucket
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await ensureBucket();

    const { data: files, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const images = (files || [])
      .filter((f) => f.name !== ".emptyFolderPlaceholder")
      .map((f) => ({
        name: f.name,
        size: f.metadata?.size || 0,
        type: f.metadata?.mimetype || "",
        createdAt: f.created_at,
        url: supabaseAdmin.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      }));

    return NextResponse.json({ images });
  } catch (err) {
    console.error("List error:", err);
    return NextResponse.json({ error: "Erro ao listar imagens" }, { status: 500 });
  }
}

// DELETE — remover imagem pelo nome do arquivo
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const fileName = req.nextUrl.searchParams.get("file");
    if (!fileName || fileName.includes("..") || fileName.includes("/")) {
      return NextResponse.json({ error: "Nome de arquivo inválido" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([fileName]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Erro ao deletar imagem" }, { status: 500 });
  }
}
