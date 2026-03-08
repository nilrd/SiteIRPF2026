import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";

async function getMetrics() {
  try {
    const [leads, contatos, posts, postsPublished] = await Promise.all([
      prisma.lead.count(),
      prisma.contato.count(),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { published: true } }),
    ]);
    return { leads, contatos, posts, postsPublished };
  } catch {
    return { leads: 0, contatos: 0, posts: 0, postsPublished: 0 };
  }
}

export default async function DashboardPage() {
  const metrics = await getMetrics();

  const cards = [
    { label: "Leads", value: metrics.leads, href: "/painel-nb-2025/leads" },
    { label: "Contatos", value: metrics.contatos, href: "/painel-nb-2025/leads" },
    { label: "Posts (total)", value: metrics.posts, href: "/painel-nb-2025/blog" },
    { label: "Posts publicados", value: metrics.postsPublished, href: "/painel-nb-2025/blog" },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      {/* Main */}
      <main className="flex-1 p-8">
        <h1 className="font-serif text-3xl mb-8">Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="border border-white/10 p-6 hover:border-white/30 transition"
            >
              <span className="font-serif text-3xl">{card.value}</span>
              <span className="block text-[10px] uppercase tracking-widest opacity-40 mt-2">
                {card.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="border border-white/10 p-6">
          <h2 className="font-serif text-xl mb-4">Acoes rapidas</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/painel-nb-2025/blog?action=generate"
              className="bg-white text-black px-6 py-3 uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition"
            >
              Gerar Post com IA
            </Link>
            <Link
              href="/painel-nb-2025/leads"
              className="border border-white/20 px-6 py-3 uppercase text-xs tracking-widest font-bold hover:bg-white/10 transition"
            >
              Ver Leads
            </Link>
            <Link
              href="/painel-nb-2025/campanhas"
              className="border border-white/20 px-6 py-3 uppercase text-xs tracking-widest font-bold hover:bg-white/10 transition"
            >
              Criar Campanha
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
