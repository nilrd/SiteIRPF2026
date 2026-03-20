/**
 * Corrige referência residual a "16 de março" no content do post RRA
 * Substitui por "23 de março" em todos os contextos relevantes
 */
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local', override: true });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

const SLUG = 'rendimentos-recebidos-acumuladamente-rra-imposto-de-renda';

async function main() {
  const post = await prisma.blogPost.findUnique({
    where: { slug: SLUG },
    select: { id: true, content: true, updatedAt: true },
  });

  if (!post) {
    console.error('Post não encontrado:', SLUG);
    return;
  }

  const before = post.content;
  const has1603 = before.includes('16 de março');

  console.log('Slug:', SLUG);
  console.log('Contém "16 de março":', has1603);

  if (!has1603) {
    console.log('Nada a corrigir.');
    return;
  }

  // Exibe os trechos com 16 de março para auditoria antes
  const idx = before.indexOf('16 de março');
  console.log('\nTrecho encontrado:');
  console.log(before.substring(Math.max(0, idx - 80), idx + 100));
  console.log('---');

  // Substitui todas as ocorrências de "16 de março" por "23 de março"
  const after = before.replaceAll('16 de março', '23 de março');

  await prisma.blogPost.update({
    where: { slug: SLUG },
    data: { content: after, updatedAt: new Date() },
  });

  // Verificação final
  const updated = await prisma.blogPost.findUnique({
    where: { slug: SLUG },
    select: { content: true, updatedAt: true },
  });

  console.log('\n=== Verificação Final ===');
  console.log('updatedAt:', updated.updatedAt);
  console.log('ainda contém "16 de março":', updated.content.includes('16 de março'));
  console.log('contém "23 de março":', updated.content.includes('23 de março'));
  console.log('mecânica RRA presente:', updated.content.includes('Cálculo pela Tabela Progressiva'));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
