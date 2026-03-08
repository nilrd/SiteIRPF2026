"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/servicos", label: "Servicos" },
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/ferramentas/calculadora-ir", label: "Calculadora" },
  { href: "/blog", label: "Insights" },
  { href: "/contato", label: "Contato" },
];

const WA_LINK = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "5511940825120"}?text=${encodeURIComponent(
  process.env.NEXT_PUBLIC_WA_MESSAGE || "Ola! Vim pelo site e quero saber sobre declaracao de IR."
)}`;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-40 bg-base/80 backdrop-blur-md editorial-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif text-xl font-bold tracking-tighter uppercase">
            Consultoria IRPF
          </span>
          <span className="w-2 h-2 rounded-full bg-ouro inline-block animate-blink" />
          <span className="font-serif text-xl font-bold tracking-tighter uppercase">
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
          className="md:hidden text-xs font-bold uppercase tracking-widest"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? "Fechar" : "Menu"}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-base border-t border-linha overflow-hidden"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
