import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LeadsActions from "./LeadsActions";

async function getLeads() {
  try {
    return await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  } catch { return []; }
}

async function getContatos() {
  try {
    return await prisma.contato.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  } catch { return []; }
}

export default async function LeadsPage() {
  const [leads, contatos] = await Promise.all([getLeads(), getContatos()]);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl">Leads & Contatos</h1>
          <LeadsActions />
        </div>

        {/* Leads Table */}
        <h2 className="font-serif text-xl mb-4">Leads ({leads.length})</h2>
        <div className="overflow-x-auto mb-12">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Nome</th>
                <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Email</th>
                <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Telefone</th>
                <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Tipo</th>
                <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Origem</th>
                <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Status</th>
                <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Data</th>
                <th className="py-3 text-[10px] uppercase tracking-widest opacity-50">Acao</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 pr-4">
                    <span>{lead.nome}</span>
                    {lead.mensagem && (
                      <span
                        className="block text-[10px] opacity-40 max-w-[160px] truncate"
                        title={lead.mensagem}
                      >
                        {lead.mensagem}
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4 opacity-60">{lead.email}</td>
                  <td className="py-3 pr-4 opacity-60">{lead.telefone || "—"}</td>
                  <td className="py-3 pr-4 opacity-60">{lead.tipoDecl || "—"}</td>
                  <td className="py-3 pr-4 opacity-60">{lead.origem}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 ${
                      lead.status === "convertido"
                        ? "bg-green-500/20 text-green-300"
                        : lead.status === "em_contato"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-white/10"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 opacity-40">
                    {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-3">
                    {lead.telefone && (
                      <a
                        href={`https://wa.me/55${lead.telefone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 text-xs hover:underline"
                      >
                        WhatsApp
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center opacity-40">
                    Nenhum lead ainda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Contatos Table */}
        <h2 className="font-serif text-xl mb-4">Contatos ({contatos.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Nome</th>
                <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Email</th>
                <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Telefone</th>
                <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Assunto</th>
                <th className="py-3 pr-4 text-[10px] uppercase tracking-widest opacity-50">Mensagem</th>
                <th className="py-3 text-[10px] uppercase tracking-widest opacity-50">Data</th>
              </tr>
            </thead>
            <tbody>
              {contatos.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 pr-4">{c.nome}</td>
                  <td className="py-3 pr-4 opacity-60">{c.email}</td>
                  <td className="py-3 pr-4 opacity-60">{c.telefone || "—"}</td>
                  <td className="py-3 pr-4 opacity-60">{c.assunto || "—"}</td>
                  <td className="py-3 pr-4 opacity-60 max-w-xs">
                    <span className="line-clamp-2">{c.mensagem}</span>
                  </td>
                  <td className="py-3 opacity-40">
                    {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
              {contatos.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center opacity-40">
                    Nenhum contato ainda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
