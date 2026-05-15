"use client";

import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2.5 bg-[#0A0A0A] border border-white/20 flex flex-col gap-[5px] hover:border-white/40 transition-colors"
        aria-label="Abrir menu"
      >
        <span className="block w-5 h-px bg-white" />
        <span className="block w-5 h-px bg-white" />
        <span className="block w-5 h-px bg-white" />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50 md:z-auto
          h-full w-64 md:w-56
          border-r border-white/10 p-6 shrink-0 flex flex-col
          bg-[#0A0A0A]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/painel-nb-2025/dashboard"
            className="font-serif text-lg block"
            onClick={() => setIsOpen(false)}
          >
            NSB Admin
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-white/40 hover:text-white transition text-xl leading-none"
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-1 flex-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-3 py-2.5 text-sm transition ${
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-white/10 text-white font-semibold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
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
    </>
  );
}
