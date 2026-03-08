import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel Admin | IRPF NSB",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {children}
    </div>
  );
}
