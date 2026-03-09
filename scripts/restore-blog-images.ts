/**
 * Script: restore-blog-images.ts
 * Restaura as 4 imagens Unsplash que estavam funcionando e foram trocadas por engano.
 * Os 2 posts com imagens realmente quebradas mantêm o picsum.photos.
 *
 * Executar: npx tsx scripts/restore-blog-images.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Apenas os posts que tinham Unsplash FUNCIONANDO e foram alterados por engano.
// Os posts abaixo NÃO são tocados (imagens quebradas → mantém picsum):
//   - desvendando-o-irpf-2026    (photo-1590283603385 — quebrada)
//   - irpf-2026-o-que-mudou      (photo-1579621970563 — quebrada)
const RESTORE_MAP: Record<string, string> = {
  "irpf-2026-tabela-e-calculo":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=75",
  "irpf-2026-tabela-e-legislacao":
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=75",
  "irpf-2026-guia-completo":
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=75",
  "irpf-2026-o-que-voce-precisa-saber":
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=75",
};

async function main() {
  console.log("🔄 Restaurando imagens originais dos posts...\n");

  for (const [slug, url] of Object.entries(RESTORE_MAP)) {
    const post = await prisma.blogPost.findFirst({
      where: { slug },
      select: { id: true, title: true, coverImage: true },
    });

    if (!post) {
      console.log(`⚠️  Post não encontrado: ${slug}`);
      continue;
    }

    await prisma.blogPost.update({
      where: { id: post.id },
      data: { coverImage: url },
    });

    console.log(`✅ Restaurado: "${post.title}"`);
    console.log(`   → ${url}\n`);
  }

  console.log("✅ Restauração concluída.");
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
