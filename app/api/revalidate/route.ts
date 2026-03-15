import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/**
 * POST /api/revalidate?secret=<REVALIDATE_SECRET>
 * Body (opcional): { paths: ["/blog", "/blog/algum-slug"] }
 *
 * Permite limpar o cache Next.js de rotas específicas sem redeploy.
 * Útil após edições diretas no banco de produção.
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let paths: string[] = [];

    try {
      const body = await request.json();
      if (Array.isArray(body?.paths)) {
        paths = body.paths.filter((p: unknown) => typeof p === "string");
      }
    } catch {
      // body vazio ou inválido → revalidar tudo do blog
    }

    if (paths.length === 0) {
      // Sem paths específicos → limpar index + todas as páginas do blog
      revalidatePath("/blog");
      revalidatePath("/blog", "layout");
      return NextResponse.json({
        revalidated: true,
        message: "Blog index revalidado",
      });
    }

    for (const path of paths) {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      paths,
    });
  } catch (err) {
    console.error("[revalidate]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
