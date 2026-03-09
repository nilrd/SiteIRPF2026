/**
 * Script: fix-blog-images.ts
 * Atualiza coverImage de todos os posts que ainda usam URLs Unsplash quebradas.
 * Mapeia cada URL Unsplash para o equivalente picsum.photos pelo seed do post.
 *
 * Executar: npx tsx scripts/fix-blog-images.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mapeamento direto de URLs Unsplash conhecidas para picsum.photos
const UNSPLASH_MAP: Record<string, string> = {
  "photo-1554224155-6726b3ff858f": "https://picsum.photos/seed/irpf-tax1/1200/675",
  "photo-1460925895917-afdab827c52f": "https://picsum.photos/seed/irpf-finance2/1200/675",
  "photo-1563013544-824ae1b704d3": "https://picsum.photos/seed/irpf-business3/1200/675",
  "photo-1551288049-bebda4e38f71": "https://picsum.photos/seed/irpf-data4/1200/675",
  "photo-1521791136064-7986c2920216": "https://picsum.photos/seed/irpf-finance5/1200/675",
  "photo-1590283603385-17ffb3aa346b": "https://picsum.photos/seed/irpf-finance5/1200/675",
  "photo-1611974789855-9c2a0a7236a3": "https://picsum.photos/seed/irpf-stock6/1200/675",
  "photo-1434626881859-194d67b2b86f": "https://picsum.photos/seed/irpf-docs7/1200/675",
  "photo-1579621970563-ebec7cc1e1c5": "https://picsum.photos/seed/irpf-rendas8/1200/675",
  "photo-1554224154-22dec7ec8818": "https://picsum.photos/seed/irpf-money9/1200/675",
  "photo-1507003211169-0a1dd7228f2d": "https://picsum.photos/seed/irpf-person10/1200/675",
  "photo-1450101499163-c8848c66ca85": "https://picsum.photos/seed/irpf-work11/1200/675",
};

function resolveImage(url: string, slug: string): string {
  // Tenta encontrar no mapa pelo photo-ID
  for (const [photoId, replacement] of Object.entries(UNSPLASH_MAP)) {
    if (url.includes(photoId)) return replacement;
  }
  // Qualquer outra URL Unsplash -> usa seed baseado no slug do post
  return `https://picsum.photos/seed/irpf-${slug.slice(0, 16)}/1200/675`;
}

async function main() {
  console.log("🔍 Buscando posts com imagens Unsplash...");

  const posts = await prisma.blogPost.findMany({
    where: {
      coverImage: { contains: "images.unsplash.com" },
    },
    select: { id: true, slug: true, title: true, coverImage: true },
  });

  if (posts.length === 0) {
    console.log("✅ Nenhum post com URL Unsplash encontrado. Nada a fazer.");
    return;
  }

  console.log(`📝 ${posts.length} post(s) com Unsplash encontrados:\n`);

  for (const post of posts) {
    const oldUrl = post.coverImage!;
    const newUrl = resolveImage(oldUrl, post.slug);

    console.log(`  → "${post.title.slice(0, 50)}"`);
    console.log(`     De: ${oldUrl.slice(0, 80)}`);
    console.log(`     Para: ${newUrl}`);

    await prisma.blogPost.update({
      where: { id: post.id },
      data: { coverImage: newUrl },
    });
  }

  console.log(`\n✅ ${posts.length} post(s) atualizados com sucesso.`);
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
