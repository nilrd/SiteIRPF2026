"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/painel-nb-2025/dashboard",  label: "Dashboard" },
  { href: "/painel-nb-2025/leads",      label: "Leads"     },
  { href: "/painel-nb-2025/blog",       label: "Blog"      },
  { href: "/painel-nb-2025/imagens",    label: "Imagens"   },
  { href: "/painel-nb-2025/chat-ia",    label: "Chat IA"   },
  { href: "/painel-nb-2025/campanhas",  label: "Campanhas" },
  { href: "/painel-nb-2025/analisador", label: "Analisador" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-white/10 p-6 shrink-0 flex flex-col">
      <Link href="/painel-nb-2025/dashboard" className="font-serif text-lg mb-8 block">
        NSB Admin
      </Link>
      <nav className="space-y-3 flex-1">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block text-sm transition ${
              pathname === item.href
                ? "text-white font-semibold"
                : "text-white/60 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: "/painel-nb-2025" })}
        className="text-xs text-white/30 hover:text-white/60 text-left mt-8 transition"
      >
        Sair
      </button>
    </aside>
  );
}
