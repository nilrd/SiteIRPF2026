/**
 * MeiGuiasRelacionados.tsx
 * Cards de links internos para guias da área MEI/recebimentos.
 * Usar no final de páginas MEI para evitar páginas órfãs e reforçar interlinking.
 */


type Guia = {
  href: string;
  title: string;
  desc: string;
  tag: string;
};

const TODOS_GUIAS: Guia[] = [
  {
    href: "/mei/receber-pagamentos",
    title: "Como MEI pode receber pagamentos",
    desc: "Guia completo sobre Pix, cartão, maquininha e link de pagamento para MEI.",
    tag: "Guia pilar",
  },
  {
    href: "/mei/melhor-maquininha-para-mei",
    title: "Melhor maquininha para MEI",
    desc: "O que analisar antes de escolher: taxa, conectividade e tipo de negócio.",
    tag: "Comparativo",
  },
  {
    href: "/mei/maquininha-mercado-pago-para-mei",
    title: "Maquininha Mercado Pago para MEI vale a pena?",
    desc: "Análise honesta das soluções do Mercado Pago para microempreendedores.",
    tag: "Avaliação",
  },
  {
    href: "/mei/point-mercado-pago-para-mei",
    title: "Point Mercado Pago para MEI",
    desc: "Como funciona a Point Pro 3 e Point Smart 2 e para quem faz sentido.",
    tag: "Point",
  },
  {
    href: "/mei/mei-pode-ter-maquininha-no-cpf",
    title: "MEI pode ter maquininha no CPF?",
    desc: "Esclareça a dúvida sobre CPF x CNPJ nas maquininhas.",
    tag: "Dúvida prática",
  },
  {
    href: "/mei/mei-vender-no-cartao",
    title: "MEI pode vender no cartão?",
    desc: "Como controlar os recebimentos por cartão sem bagunçar o faturamento.",
    tag: "Faturamento",
  },
  {
    href: "/mei/mei-recebe-maquininha-precisa-declarar",
    title: "MEI que recebe por maquininha precisa declarar?",
    desc: "Entenda a relação entre maquininha, DASN-SIMEI e IRPF.",
    tag: "Declaração",
  },
  {
    href: "/mei/pix-ou-maquininha-para-mei",
    title: "Pix ou maquininha para MEI?",
    desc: "Comparação educativa para ajudar na decisão mais adequada ao seu negócio.",
    tag: "Comparação",
  },
  {
    href: "/mei/organizar-faturamento-maquininha",
    title: "Organizar faturamento da maquininha",
    desc: "Como separar recebimentos por maquininha, Pix e dinheiro na declaração.",
    tag: "Organização",
  },
  {
    href: "/mei/ferramentas-para-mei",
    title: "Ferramentas para MEI",
    desc: "Recebimentos, controle financeiro, declaração e organização fiscal.",
    tag: "Ferramentas",
  },
  {
    href: "/mei/vender-e-receber",
    title: "Guia do MEI para vender e receber melhor",
    desc: "Hub completo: Pix, cartão, app e maquininha.",
    tag: "Hub",
  },
  {
    href: "/mei/maquininha-para-mei",
    title: "Maquininha para MEI",
    desc: "Como escolher e começar a receber no cartão.",
    tag: "Guia",
  },
  {
    href: "/mei/point-smart-2-para-mei",
    title: "Point Smart 2 para MEI",
    desc: "Vale a pena? Análise completa.",
    tag: "Point Smart 2",
  },
  {
    href: "/mei/point-pro-3-para-mei",
    title: "Point Pro 3 para MEI",
    desc: "Para quem vende muito. Análise completa.",
    tag: "Point Pro 3",
  },
  {
    href: "/mei/app-mercado-pago-para-mei",
    title: "App Mercado Pago para MEI",
    desc: "Receba sem maquininha: Pix, cartão e link.",
    tag: "App MP",
  },
  {
    href: "/mei/link-de-pagamento-para-mei",
    title: "Link de pagamento para MEI",
    desc: "Como criar e receber pelo celular.",
    tag: "Link de pagamento",
  },
  {
    href: "/mei/maquininha-para-autonomo",
    title: "Maquininha para autônomo MEI",
    desc: "Guia para autônomos receberem no cartão.",
    tag: "Autônomo",
  },
  {
    href: "/mei/maquininha-para-salao-de-beleza",
    title: "Maquininha para salão de beleza",
    desc: "Guia para cabeleireiras, manicures e estéticas MEI.",
    tag: "Salão",
  },
  {
    href: "/mei/maquininha-para-barbeiro",
    title: "Maquininha para barbeiro MEI",
    desc: "Qual maquininha faz mais sentido para barbearia.",
    tag: "Barbeiro",
  },
  {
    href: "/mei/maquininha-para-delivery",
    title: "Maquininha para delivery MEI",
    desc: "Maquininha com bateria e 4G para entregadores.",
    tag: "Delivery",
  },
  {
    href: "/mei/maquininha-para-prestador-de-servico",
    title: "Maquininha para prestador de serviço MEI",
    desc: "Receba no cartão prestando serviços.",
    tag: "Prestador",
  },
  {
    href: "/mei/maquininha-para-vendedor-ambulante",
    title: "Maquininha para vendedor ambulante MEI",
    desc: "Opções para feirantes e vendedores na rua.",
    tag: "Ambulante",
  },
];

// Guias existentes da área MEI principal
const GUIAS_MEI_PRINCIPAL: Guia[] = [
  {
    href: "/mei/declaracao-anual",
    title: "Declaração Anual do MEI (DASN-SIMEI)",
    desc: "Entregue sua DASN-SIMEI até 31/05. Evite multa de R$ 50.",
    tag: "Obrigatório",
  },
  {
    href: "/mei/mei-e-irpf",
    title: "MEI e Imposto de Renda (IRPF)",
    desc: "Quando o MEI precisa declarar IRPF como pessoa física.",
    tag: "IRPF",
  },
  {
    href: "/mei/dividas-parcelamento",
    title: "DAS atrasado: parcelamento e Desenrola",
    desc: "Como parcelar o DAS em até 60 meses e usar o Desenrola Empresas.",
    tag: "Regularização",
  },
];

interface MeiGuiasRelacionadosProps {
  /** Slug da página atual — será excluído da listagem */
  currentSlug?: string;
  /** Máximo de cards a exibir */
  max?: number;
  /** Incluir também guias da área principal do MEI */
  includePrincipal?: boolean;
}

export default function MeiGuiasRelacionados({
  currentSlug,
  max = 4,
  includePrincipal = false,
}: MeiGuiasRelacionadosProps) {
  const pool = includePrincipal
    ? [...TODOS_GUIAS, ...GUIAS_MEI_PRINCIPAL]
    : TODOS_GUIAS;

  const guias = pool
    .filter((g) => !currentSlug || !g.href.endsWith(currentSlug))
    .slice(0, max);

  if (guias.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[#0A0A0A]/10 pt-12">
      <h2 className="font-serif text-2xl mb-6">Guias relacionados</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {guias.map((g) => (
          <a
            key={g.href}
            href={g.href}
            className="group block border border-[#0A0A0A]/15 p-5 hover:border-[#0A0A0A]/40 transition"
          >
            <span className="text-[10px] uppercase tracking-widest text-[#C6FF00] bg-[#0A0A0A] px-2 py-0.5 mr-2">
              {g.tag}
            </span>
            <h3 className="font-serif text-base mt-3 mb-1 group-hover:italic transition-all">
              {g.title}
            </h3>
            <p className="text-xs text-[#0A0A0A]/55 leading-relaxed">{g.desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
