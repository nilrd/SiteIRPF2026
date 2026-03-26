import Link from "next/link";

const WA_LINK = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "5511940825120"}?text=${encodeURIComponent("Olá Nilson! Preciso declarar meu IRPF 2026 antes do prazo. Pode me ajudar?")}`;

export default function Footer() {
  return (
    <footer className="bg-preto text-white">
      {/* Urgency CTA strip */}
      <div className="border-t border-white/10 border-b border-[#C6FF00]/20 bg-[#C6FF00]/5">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#C6FF00] mb-1">
              ⏳ Tempo Está Acabando
            </p>
            <p className="font-black text-xl uppercase">
              Prazo IRPF 2026 — 29 de Maio de 2026
            </p>
            <p className="text-sm text-white/50 mt-1">
              Multa mínima R$ 165,74 por atraso. CPF irregular após 30 dias sem declarar.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C6FF00] text-black px-6 py-3 font-black uppercase text-xs tracking-widest hover:bg-white transition"
            >
              Declarar Agora →
            </a>
            <Link
              href="/declarar-agora"
              className="border border-white/20 text-white px-6 py-3 font-bold uppercase text-xs tracking-widest hover:border-white transition"
            >
              Saiba Mais
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Col 1 - Brand */}
          <div>
            <div className="font-serif text-lg font-bold tracking-tighter uppercase mb-4">
              Consultoria IRPF
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-ouro ml-1 mb-0.5" />
              NSB
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Mais de 10 anos de experiência em declaração de Imposto de Renda
              Pessoa Física. Todo Brasil, 100% online.
            </p>
          </div>

          {/* Col 2 - Servicos */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
              Serviços
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/servicos"
                  className="text-sm text-white/70 hover:text-white transition"
                >
                  Declaração Nova
                </Link>
              </li>
              <li>
                <Link
                  href="/servicos"
                  className="text-sm text-white/70 hover:text-white transition"
                >
                  IRPF Atrasado
                </Link>
              </li>
              <li>
                <Link
                  href="/servicos"
                  className="text-sm text-white/70 hover:text-white transition"
                >
                  Retificação
                </Link>
              </li>
              <li>
                <Link
                  href="/servicos"
                  className="text-sm text-white/70 hover:text-white transition"
                >
                  Dependentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 - Ferramentas */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
              Ferramentas
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/ferramentas/calculadora-ir"
                  className="text-sm text-white/70 hover:text-white transition"
                >
                  Calculadora IR
                </Link>
              </li>
              <li>
                <Link
                  href="/ferramentas/simulador-multa"
                  className="text-sm text-white/70 hover:text-white transition"
                >
                  Simulador de Multa
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-white/70 hover:text-white transition"
                >
                  Blog / Insights
                </Link>
              </li>
              <li>
                <a
                  href="https://www.restituicao.receita.fazenda.gov.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-white transition"
                >
                  Consultar Restituição ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 - Contato */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
              Contato
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-white transition"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-sm text-white/70 hover:text-white transition"
                >
                  Formulário de Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="text-sm text-white/70 hover:text-white transition"
                >
                  Sobre
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest text-white/30">
            Consultoria IRPF NSB -- {new Date().getFullYear()} -- Todos os direitos reservados
          </p>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-blink" />
            Atendimento ativo
          </div>
        </div>
      </div>
    </footer>
  );
}
