import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ImageUploader from "@/components/admin/ImageUploader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Imagens | Painel NSB",
  robots: "noindex, nofollow",
};

export default async function ImagensPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/painel-nb-2025?callbackUrl=%2Fpainel-nb-2025%2Fimagens");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="font-serif text-3xl mb-1">Imagens</h1>
          <p className="text-white/40 text-sm">
            Upload de imagens com link público — use nos posts e campanhas
          </p>
        </div>
        <ImageUploader />
      </main>
    </div>
  );
}
