"use client";

/**
 * MaquininhaAfiliado.tsx
 * Bloco de CTA para maquininhas/conta Mercado Pago com aviso obrigatório de afiliação.
 * Usar apenas em conteúdos de MEI com intenção comercial clara sobre recebimentos.
 *
 * Regras editoriais:
 * - Não usar em páginas de CPF bloqueado, malha fina, dívidas graves ou restituição.
 * - Sempre exibir o aviso de indicação.
 * - Nunca prometer taxa, ganho ou aprovação garantida.
 */

type Product = "point-pro-3" | "point-smart-2" | "app-mercado-pago";

interface MaquininhaAfiliadoProps {
  /** Qual produto destacar no bloco */
  product: Product;
  /** Contexto de uso — exibido no subtítulo */
  context?: string;
  /** Esconde o aviso de indicação (não recomendado — use apenas se aviso já está na página) */
  hideDisclosure?: boolean;
}

const PRODUCTS: Record<Product, {
  name: string;
  tagline: string;
  desc: string;
  href: string;
  ideal: string;
  cta: string;
  image: string;
  imageAlt: string;
}> = {
  "point-pro-3": {
    name: "Point Pro 3",
    tagline: "Para MEI com atendimento presencial e vendas recorrentes",
    desc: "Aceita débito, crédito, Pix e voucher. Conectividade Wi-Fi e 4G. Bateria para o dia todo. Indicada para balcão, delivery e eventos.",
    href: "https://mpago.li/31QNkWU",
    ideal: "Comércios, prestadores com ponto fixo, entregadores, feirantes.",
    cta: "Conhecer a Point Pro 3",
    image:
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "MEI usando maquininha de cartao para receber vendas no balcão",
  },
  "point-smart-2": {
    name: "Point Smart 2",
    tagline: "Para MEI que precisa de tela, relatórios e experiência completa",
    desc: "Tela touchscreen, relatórios de vendas integrados, recarga de celular e NFC. Solução mais completa para quem quer controle profissional.",
    href: "https://mpago.li/1UXbbb9",
    ideal: "Prestadores de serviço, consultores, salões, clínicas e MEIs que valorizam relatórios.",
    cta: "Conhecer a Point Smart 2",
    image:
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Profissional MEI analisando vendas na maquininha com tela",
  },
  "app-mercado-pago": {
    name: "App Mercado Pago",
    tagline: "Conta digital para receber por Pix, cartão e link de pagamento",
    desc: "Abra a conta Mercado Pago, receba pelo celular sem maquininha, use link de pagamento e organize os recebimentos do seu MEI em um só lugar.",
    href: "https://mpago.li/18rGCG2",
    ideal: "MEI iniciante, prestadores online, quem quer separar conta PJ de conta PF.",
    cta: "Conhecer o App Mercado Pago",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Celular com app de pagamentos para MEI receber por link e Pix",
  },
};

const PRODUCT_EVENT_TYPE: Record<Product, string> = {
  "point-smart-2": "mp_point_smart_click",
  "point-pro-3": "mp_point_pro_click",
  "app-mercado-pago": "mp_app_click",
};

function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = sessionStorage.getItem("_sid");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("_sid", sessionId);
  }

  return sessionId;
}

function trackAffiliateClick(product: Product, cta: string, href: string) {
  const page = typeof window !== "undefined" ? window.location.pathname : "/";
  const eventType = PRODUCT_EVENT_TYPE[product];
  const sessionId = getSessionId();

  // GA4
  if (typeof window !== "undefined" && typeof (window as Window & { gtag?: (...args: unknown[]) => void }).gtag === "function") {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", "affiliate_cta_click", {
      product_type: product,
      cta_label: cta,
      destination_url: href,
      page_path: page,
    });
  }

  // Analytics interno + AffiliateLink.clickCount
  fetch("/api/afiliados/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product, page, element: eventType, sessionId }),
  }).catch(() => {});
}

export default function MaquininhaAfiliado({
  product,
  context,
  hideDisclosure = false,
}: MaquininhaAfiliadoProps) {
  const p = PRODUCTS[product];

  return (
    <div className="border-2 border-[#0A0A0A] p-6 md:p-7 my-10 bg-[#F5F5F2] shadow-[8px_8px_0_#0A0A0A]">
      {/* Label */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <p className="text-[10px] uppercase tracking-widest text-[#0A0A0A]/60">
          Solução mencionada neste guia
        </p>
        <span className="inline-block bg-[#C6FF00] text-[#0A0A0A] text-[10px] font-black uppercase tracking-[0.1em] px-2 py-1 border border-[#0A0A0A]">
          Alta procura MEI
        </span>
      </div>

      {/* Nome + tagline */}
      <h3 className="font-serif text-xl mb-1">{p.name}</h3>
      <p className="text-sm font-medium text-[#0A0A0A]/70 mb-3">{p.tagline}</p>

      {/* Contexto opcional */}
      {context && (
        <p className="text-sm text-[#0A0A0A]/60 mb-3 italic">{context}</p>
      )}

      <div className="mb-4 overflow-hidden border border-[#0A0A0A]/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={p.imageAlt}
          loading="lazy"
          className="w-full h-48 md:h-56 object-cover"
        />
      </div>

      {/* Descrição */}
      <p className="text-sm text-[#0A0A0A]/80 leading-relaxed mb-3">{p.desc}</p>

      {/* Ideal para */}
      <p className="text-xs text-[#0A0A0A]/60 mb-5">
        <strong>Indicada para:</strong> {p.ideal}
      </p>

      {/* CTA */}
      <div className="grid gap-2">
        <a
          href={p.href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={() => trackAffiliateClick(product, `${p.cta} principal`, p.href)}
          className="block w-full text-center bg-[#0A0A0A] text-[#C6FF00] px-6 py-4 uppercase text-[12px] tracking-[0.14em] font-black border-2 border-[#0A0A0A] hover:bg-[#C6FF00] hover:text-[#0A0A0A] transition"
          data-cta="mp-affiliate-primary"
        >
          {p.cta} agora →
        </a>
        <a
          href={p.href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={() => trackAffiliateClick(product, "comparar-taxas-e-condicoes", p.href)}
          className="block w-full text-center bg-transparent text-[#0A0A0A] px-6 py-3 uppercase text-[11px] tracking-[0.12em] font-bold border-2 border-[#0A0A0A]/80 hover:border-[#0A0A0A] hover:bg-white transition"
          data-cta="mp-affiliate-secondary"
        >
          Comparar taxas e condições
        </a>
      </div>

      <p className="text-[11px] text-[#0A0A0A]/70 mt-3">
        Clique para abrir a página oficial e validar preço, taxas e prazo atualizados.
      </p>

      {/* Disclosure obrigatório */}
      {!hideDisclosure && (
        <p className="text-[10px] text-[#0A0A0A]/40 mt-4 leading-relaxed border-t border-[#0A0A0A]/10 pt-3">
          Este pode ser um link de indicação. Consulte diretamente no Mercado Pago as taxas,
          condições promocionais, prazos e regras vigentes antes de contratar. Este conteúdo
          tem caráter informativo e não substitui análise individual do seu MEI.
        </p>
      )}
    </div>
  );
}
