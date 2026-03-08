import Link from "next/link";

const WA_LINK = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "5511940825120"}`;

export default function Footer() {
  return (
    <footer className="bg-preto text-white">
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
              Mais de 10 anos de experiencia em declaracao de Imposto de Renda
              Pessoa Fisica. Todo Brasil, 100% online.
            </p>
          </div>

          {/* Col 2 - Servicos */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">
              Servicos
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/servicos"
                  className="text-sm text-white/70 hover:text-white transition"
                >
                  Declaracao Nova
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
                  Retificacao
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
                  Formulario de Contato
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
