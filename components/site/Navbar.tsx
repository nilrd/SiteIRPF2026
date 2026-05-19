"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/servicos", label: "Serviços" },
  { href: "/mei", label: "MEI" },
  { href: "/desenrola-brasil", label: "Desenrola" },
  { href: "/ferramentas/calculadora-ir", label: "Calculadora" },
  { href: "/blog", label: "Dicas e Guias" },
  { href: "/contato", label: "Contato" },
];

const WA_LINK = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "5511940825120"}?text=${encodeURIComponent(
  process.env.NEXT_PUBLIC_WA_MESSAGE || "Olá! Vim pelo site e quero saber sobre declaração de IR."
)}`;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-40 bg-base/80 backdrop-blur-md editorial-border overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group min-w-0 shrink">
          <span className="font-serif text-sm sm:text-xl font-bold tracking-tighter uppercase truncate">
            Consultoria IRPF
          </span>
          <span className="w-2 h-2 rounded-full bg-ouro inline-block animate-blink flex-shrink-0" />
          <span className="font-serif text-sm sm:text-xl font-bold tracking-tighter uppercase">
            NSB
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-semibold uppercase tracking-widest hover:opacity-50 transition"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-preto text-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-verde transition"
          >
            Declarar Agora
          </a>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-xs font-bold uppercase tracking-widest flex-shrink-0 whitespace-nowrap ml-3"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? "Fechar" : "Menu"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-base border-t border-linha overflow-hidden">
          <nav className="flex flex-col px-6 py-6 gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold uppercase tracking-widest py-2 editorial-border"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-preto text-white text-center py-3 text-sm font-semibold uppercase tracking-widest mt-2"
            >
              Declarar Agora
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
