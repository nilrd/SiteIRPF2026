import type { Metadata } from "next";
import Link from "next/link";
import ContatoSection from "@/components/site/ContatoSection";

export const metadata: Metadata = {
  title: "Consulte Sem Medo: Regularize sua Situação Fiscal | NSB",
  description:
    "Entenda sua situação fiscal com orientação clara e preço justo. Atendemos IRPF, CPF pendente, MEI, dívidas e regularização. Consulte sem compromisso.",
  keywords: [
    "consulta fiscal",
    "regularizar situação fiscal",
    "CPF pendente",
    "IRPF atrasado",
    "MEI irregular",
    "orientação fiscal",
    "atendimento preço justo",
  ],
  alternates: {
    canonical: "https://irpf.qaplay.com.br/consulte-sem-medo",
  },
  openGraph: {
    title: "Consulte Sem Medo: Regularize sua Situação Fiscal com Orientação e Preço Justo",
    description:
      "Atendemos pessoas físicas, MEIs, autônomos e pequenos empreendedores. Primeiro, entendemos sua situação — depois, orientamos o melhor caminho.",
    url: "https://irpf.qaplay.com.br/consulte-sem-medo",
    type: "website",
  },
};

const WA_CONSULTE = "https://wa.me/5511940825120?text=Ol%C3%A1!%20Quero%20consultar%20minha%20situa%C3%A7%C3%A3o%20fiscal%20sem%20compromisso.%20Pode%20me%20ajudar%3F";
const WA_DUVIDA   = "https://wa.me/5511940825120?text=Ol%C3%A1!%20Tenho%20uma%20d%C3%BAvida%20sobre%20minha%20situa%C3%A7%C3%A3o%20fiscal.%20Pode%20me%20ajudar%3F";

const servicos = [
  {
    icone: "📄",
    titulo: "Declaração de IRPF",
    descricao: "Para quem precisa declarar o Imposto de Renda este ano, atrasado ou retificação.",
    link: "/servicos",
  },
  {
    icone: "⏳",
    titulo: "IRPF Atrasado",
    descricao: "Regularize entregas de anos anteriores e evite que a situação fique mais complicada.",
    link: "/servicos",
  },
  {
    icone: "🪪",
    titulo: "CPF Pendente ou Bloqueado",
    descricao: "Análise e orientação para entender o problema e buscar o melhor caminho de regularização.",
    link: "/ferramentas/consulta-situacao",
  },
  {
    icone: "🏪",
    titulo: "Declaração Anual do MEI",
    descricao: "DASN-SIMEI obrigatória todo ano. Evite pendências com a Receita Federal.",
    link: "/mei/declaracao-anual",
  },
  {
    icone: "💸",
    titulo: "Dívida ou DAS Atrasado",
    descricao: "Orientação sobre parcelamento e regularização de débitos do MEI.",
    link: "/mei/dividas-parcelamento",
  },
  {
    icone: "🏢",
    titulo: "Abertura ou Encerramento de MEI",
    descricao: "Formalizar ou encerrar o MEI com segurança e dentro das regras.",
    link: "/mei/abertura-mei",
  },
  {
    icone: "🧾",
    titulo: "Nota Fiscal para MEI",
    descricao: "Orientação para emitir notas fiscais corretamente.",
    link: "/mei/declaracao-anual",
  },
  {
    icone: "🔍",
    titulo: "Orientação Fiscal Geral",
    descricao: "Autônomos, prestadores de serviço e profissionais informais que precisam entender sua situação.",
    link: "/servicos",
  },
];

const passos = [
  { num: "01", titulo: "Você chama no WhatsApp", descricao: "Sem formulário complicado. Só manda uma mensagem contando sua dúvida ou situação." },
  { num: "02", titulo: "Explica brevemente o caso", descricao: "Não precisa saber termos técnicos — explica do seu jeito e nós entendemos." },
  { num: "03", titulo: "Analisamos o tipo de pendência", descricao: "A equipe avalia o que está acontecendo e identifica o caminho mais adequado para você." },
  { num: "04", titulo: "Você decide com informação", descricao: "Recebe orientação clara sobre o que pode ser feito e os valores envolvidos — antes de qualquer decisão." },
];

const faqs = [
  {
    q: "Posso chamar mesmo sem saber qual é o problema?",
    a: "Sim. Na maioria dos casos, as pessoas sabem que algo está errado, mas não sabem exatamente o quê. Pode chamar explicando o que você percebeu — a gente ajuda a entender.",
  },
  {
    q: "O atendimento é só para MEI?",
    a: "Não. Atendemos pessoas físicas, autônomos, prestadores de serviço, MEIs e pequenos empreendedores. Se você tem dúvidas sobre Imposto de Renda, CPF ou regularização fiscal, pode entrar em contato.",
  },
  {
    q: "Vocês atendem pessoa física?",
    a: "Sim. A maior parte dos nossos atendimentos é exatamente para pessoas físicas com dúvidas sobre IRPF, CPF, declaração atrasada ou pendências com a Receita Federal.",
  },
  {
    q: "Dá para saber o valor antes de contratar?",
    a: "Sim. Após analisar seu caso, passamos os valores possíveis antes de qualquer compromisso. Você decide com calma.",
  },
  {
    q: "Meu CPF está pendente. Vocês podem analisar?",
    a: "Podemos orientar sobre os possíveis caminhos para regularização. A análise começa entendendo a causa da pendência — e isso a gente faz na primeira conversa.",
  },
  {
    q: "Estou com IR atrasado. O que devo fazer?",
    a: "O primeiro passo é entender quantos anos estão em aberto e se há imposto devido. Chame no WhatsApp e explicamos como funciona o processo de regularização.",
  },
  {
    q: "Tenho dívida no MEI. Posso pedir orientação?",
    a: "Sim. Podemos verificar a situação e orientar sobre as opções disponíveis — como parcelamento pelo PGFN ou regularização de DAS — para que você entenda os caminhos possíveis.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Consulte Sem Medo: Regularize sua Situação Fiscal",
  description:
    "Atendemos pessoas físicas, MEIs, autônomos e pequenos empreendedores com orientação clara e preço justo.",
  url: "https://irpf.qaplay.com.br/consulte-sem-medo",
  inLanguage: "pt-BR",
  publisher: {
    "@type": "Organization",
    name: "Consultoria IRPF NSB",
    url: "https://irpf.qaplay.com.br",
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function ConsulteSemMedoPage() {
  return (
    <main className="pt-32 pb-0 bg-[#F5F5F2]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* ─── HERO ─── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <span className="block text-[10px] uppercase tracking-[0.3em] text-[#0A0A0A]/40 mb-6">
          Orientação Fiscal
        </span>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight mb-8 max-w-4xl">
          Consulte sem medo: entenda sua situação fiscal com orientação e preço justo
        </h1>
        <p className="text-lg md:text-xl text-[#0A0A0A]/65 max-w-2xl leading-relaxed mb-10">
          Atendemos pessoas físicas, MEIs, autônomos e pequenos empreendedores que precisam
          resolver pendências com IRPF, CPF, MEI ou regularização fiscal — de forma clara,
          sem complicação e com atenção ao seu bolso.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={WA_CONSULTE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#0A0A0A] text-white px-8 py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-[#1a1a1a] transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.98.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chamar no WhatsApp
          </a>
          <a
            href={WA_DUVIDA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-[#0A0A0A]/30 text-[#0A0A0A] px-8 py-4 text-[11px] uppercase tracking-widest font-bold hover:border-[#0A0A0A] transition"
          >
            Tirar minha dúvida
          </a>
        </div>
      </section>

      {/* ─── BLOCO DE CONFIANÇA ─── */}
      <section className="bg-[#0A0A0A] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <span className="text-[#C6FF00] text-[10px] uppercase tracking-widest block mb-3">Como trabalhamos</span>
            <h2 className="font-serif text-2xl md:text-3xl mb-4 leading-snug">
              Primeiro, entendemos o seu caso
            </h2>
            <p className="text-white/60 leading-relaxed text-sm">
              Antes de qualquer proposta, analisamos a sua situação com calma. Não prometemos
              solução antes de entender o que está acontecendo — porque cada caso tem suas
              particularidades.
            </p>
          </div>
          <div>
            <span className="text-[#C6FF00] text-[10px] uppercase tracking-widest block mb-3">Orientação clara</span>
            <h2 className="font-serif text-2xl md:text-3xl mb-4 leading-snug">
              Sem juridiquês, sem susto
            </h2>
            <p className="text-white/60 leading-relaxed text-sm">
              Explicamos tudo de forma simples. Você entende o que está acontecendo, quais são
              as opções e quais são os valores — antes de decidir qualquer coisa.
            </p>
          </div>
          <div>
            <span className="text-[#C6FF00] text-[10px] uppercase tracking-widest block mb-3">Preço justo</span>
            <h2 className="font-serif text-2xl md:text-3xl mb-4 leading-snug">
              Respeitamos o seu bolso
            </h2>
            <p className="text-white/60 leading-relaxed text-sm">
              Nossa proposta é orientar com qualidade e cobrar de forma justa. Não trabalhamos
              com valores exorbitantes e prezamos pela transparência desde o primeiro contato.
            </p>
          </div>
        </div>
      </section>

      {/* ─── VOCÊ PODE NOS CHAMAR SE... ─── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <span className="block text-[10px] uppercase tracking-[0.3em] text-[#0A0A0A]/40 mb-4">Situações atendidas</span>
        <h2 className="font-serif text-3xl md:text-5xl mb-12 max-w-2xl leading-tight">
          Você pode nos chamar se…
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Está com o Imposto de Renda atrasado de anos anteriores",
            "Tem dúvidas sobre como fazer a declaração de IRPF",
            "Está com CPF pendente, bloqueado ou irregular",
            "Precisa regularizar a situação do seu MEI",
            "Tem DAS atrasado ou dívida no MEI",
            "Precisa fazer a declaração anual do MEI (DASN-SIMEI)",
            "Quer abrir ou encerrar o MEI com segurança",
            "Precisa emitir nota fiscal e não sabe como",
            "Não sabe por onde começar para resolver uma pendência fiscal",
          ].map((item) => (
            <div
              key={item}
              className="border border-[#0A0A0A]/15 p-5 flex items-start gap-3 hover:border-[#C6FF00] transition"
            >
              <span className="text-[#C6FF00] font-bold text-lg mt-0.5 shrink-0">✓</span>
              <span className="text-sm text-[#0A0A0A]/75 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── COMO FUNCIONA ─── */}
      <section className="bg-[#0A0A0A] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="block text-[10px] uppercase tracking-[0.3em] text-white/35 mb-4">Processo</span>
          <h2 className="font-serif text-3xl md:text-5xl mb-16 max-w-xl leading-tight">
            Como funciona o atendimento
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {passos.map(({ num, titulo, descricao }) => (
              <div key={num} className="relative">
                <span className="font-serif text-6xl text-white/10 block mb-4 leading-none">{num}</span>
                <h3 className="font-bold text-sm uppercase tracking-widest mb-3 text-[#C6FF00]">
                  {titulo}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">{descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POR QUE CHAMAR ANTES DE SE PREOCUPAR ─── */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="block text-[10px] uppercase tracking-[0.3em] text-[#0A0A0A]/40 mb-4">Entenda o problema</span>
          <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-tight">
            Por que chamar antes de se preocupar?
          </h2>
          <p className="text-[#0A0A0A]/65 leading-relaxed mb-5">
            Muitas pessoas ficam angustiadas com notificações da Receita Federal, CPF
            irregular ou alertas do MEI — mas não buscam ajuda por medo de descobrir
            que o problema é grande ou que vai custar caro.
          </p>
          <p className="text-[#0A0A0A]/65 leading-relaxed mb-5">
            Na maioria dos casos, o primeiro passo é <strong className="text-[#0A0A0A]">entender a situação com calma</strong>.
            Muitas pendências têm solução mais simples do que parecem — e a resolução fica
            mais fácil quanto antes for tratada.
          </p>
          <p className="text-[#0A0A0A]/65 leading-relaxed">
            Chamar no WhatsApp não gera nenhum compromisso. Podemos analisar sua situação,
            explicar o que encontramos e orientar o melhor caminho — antes de qualquer decisão.
          </p>
        </div>
        <div className="bg-[#0A0A0A] text-white p-10">
          <p className="font-serif text-xl md:text-2xl leading-snug mb-8 text-white/90 italic">
            "Consulte sem medo. Entender sua situação é o primeiro passo para resolver com mais
            tranquilidade."
          </p>
          <div className="border-t border-white/15 pt-6">
            <span className="block text-[10px] uppercase tracking-widest text-white/35 mb-1">Nilson Brites</span>
            <span className="text-[11px] text-white/50">Analista Financeiro · 10+ anos em tributação de pessoa física</span>
          </div>
        </div>
      </section>

      {/* ─── SERVIÇOS ─── */}
      <section className="bg-[#F5F5F2] border-t border-[#0A0A0A]/10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="block text-[10px] uppercase tracking-[0.3em] text-[#0A0A0A]/40 mb-4">Serviços disponíveis</span>
          <h2 className="font-serif text-3xl md:text-5xl mb-12 max-w-xl leading-tight">
            Como podemos ajudar você
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {servicos.map(({ icone, titulo, descricao, link }) => (
              <Link
                key={titulo}
                href={link}
                className="group border border-[#0A0A0A]/15 p-6 hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all"
              >
                <span className="text-2xl block mb-4">{icone}</span>
                <h3 className="font-bold text-sm uppercase tracking-widest mb-2 group-hover:text-[#C6FF00] transition">
                  {titulo}
                </h3>
                <p className="text-[#0A0A0A]/60 group-hover:text-white/60 text-xs leading-relaxed transition">
                  {descricao}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA PRINCIPAL ─── */}
      <section className="bg-[#C6FF00] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-5xl text-[#0A0A0A] mb-4 leading-tight">
            Consulte sem medo
          </h2>
          <p className="text-[#0A0A0A]/70 text-lg mb-2">
            Chame no WhatsApp e entenda como podemos te ajudar.
          </p>
          <p className="text-[#0A0A0A]/55 text-sm mb-10">
            Não precisa decidir agora. Primeiro, vamos entender sua situação com calma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={WA_CONSULTE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#0A0A0A] text-white px-10 py-5 text-[11px] uppercase tracking-widest font-bold hover:bg-[#1a1a1a] transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.98.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chamar no WhatsApp
            </a>
            <a
              href={WA_DUVIDA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border-2 border-[#0A0A0A] text-[#0A0A0A] px-10 py-5 text-[11px] uppercase tracking-widest font-bold hover:bg-[#0A0A0A] hover:text-white transition"
            >
              Tirar minha dúvida
            </a>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <span className="block text-[10px] uppercase tracking-[0.3em] text-[#0A0A0A]/40 mb-4">Dúvidas frequentes</span>
        <h2 className="font-serif text-3xl md:text-4xl mb-12 leading-tight">
          Perguntas que chegam com frequência
        </h2>
        <div className="space-y-0 divide-y divide-[#0A0A0A]/10">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group py-6 cursor-pointer">
              <summary className="flex items-start justify-between gap-4 list-none font-bold text-sm md:text-base text-[#0A0A0A] group-open:text-[#0A0A0A]">
                <span>{q}</span>
                <span className="shrink-0 text-lg leading-none font-light mt-0.5 group-open:rotate-45 transition-transform duration-200">+</span>
              </summary>
              <p className="mt-4 text-[#0A0A0A]/60 leading-relaxed text-sm">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ─── CONTATO ─── */}
      <ContatoSection />
    </main>
  );
}
