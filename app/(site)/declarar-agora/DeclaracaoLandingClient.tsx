"use client";

import { useState, useEffect } from "react";

const WA_LINK = `https://wa.me/5511940825120?text=${encodeURIComponent(
  "Olá Nilson! Vi o site e quero declarar meu IRPF 2026. Pode me ajudar com um orçamento?"
)}`;
const PRAZO = new Date("2026-05-29T23:59:59-03:00");

function useCountdown(target: Date) {
  const calc = () => Math.max(0, target.getTime() - Date.now());
  const [ms, setMs] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setMs(calc()), 1000);
    return () => clearInterval(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
  };
}

const beneficios = [
  {
    num: "01",
    titulo: "10+ Anos de Experiência",
    desc: "Especialista dedicado exclusivamente ao IRPF. Histórico comprovado de declarações corretas, sem erros junto à Receita Federal.",
  },
  {
    num: "02",
    titulo: "Entrega em 24 Horas",
    desc: "Declaração pronta e transmitida em até 24h após o envio dos seus documentos. Sem filas, sem burocracia, sem sair de casa.",
  },
  {
    num: "03",
    titulo: "100% Online — Todo Brasil",
    desc: "Atendimento completo via WhatsApp e email. Você mora em qualquer cidade do Brasil e ainda assim é atendido com a mesma qualidade.",
  },
  {
    num: "04",
    titulo: "Suporte por 1 Ano",
    desc: "Após a declaração, você tem suporte gratuito por 12 meses para dúvidas sobre restituição, pendências e notificações da Receita.",
  },
  {
    num: "05",
    titulo: "Malha Fina Resolvida",
    desc: "Se você caiu na malha fina, identificamos o erro, retificamos e regularizamos sua situação com o menor custo possível.",
  },
  {
    num: "06",
    titulo: "Sigilo e Segurança — LGPD",
    desc: "Seus dados fiscais ficam protegidos. Cumprimos integralmente a Lei Geral de Proteção de Dados. Suas informações nunca são compartilhadas.",
  },
];

const passos = [
  {
    num: "01",
    titulo: "Envie seus documentos",
    desc: "Informe renda, dependentes, despesas médicas e outros dados pelo WhatsApp. Orientamos exatamente o que precisamos — sem lista complicada.",
  },
  {
    num: "02",
    titulo: "Preparamos sua declaração",
    desc: "Analisamos seu perfil, aplicamos todas as deduções legais e otimizamos o resultado para maximizar restituição ou reduzir imposto a pagar.",
  },
  {
    num: "03",
    titulo: "Transmitimos e entregamos",
    desc: "Enviamos para revisão, você aprova, transmitimos à Receita Federal e entregamos o recibo oficial de entrega no mesmo dia.",
  },
];

const depoimentos = [
  {
    nome: "Marcos A.",
    cidade: "São Paulo, SP",
    texto:
      "Tinha IRPF atrasado de 3 anos e meu CPF estava irregular. O Nilson resolveu tudo rapidamente, calculou as multas corretamente e transmitiu. Meu CPF ficou regular em dias. Processo 100% pelo WhatsApp.",
  },
  {
    nome: "Fernanda S.",
    cidade: "Belo Horizonte, MG",
    texto:
      "Caí na malha fina por erro em declaração anterior. O Nilson identificou o problema em horas, retificou e minha restituição saiu mais rápido do que eu esperava. Profissional sério e atencioso.",
  },
  {
    nome: "Ricardo T.",
    cidade: "Porto Alegre, RS",
    texto:
      "Declaração nova 2026 feita em menos de 24 horas. Tudo pelo WhatsApp, sem precisar sair de casa. Já indiquei para toda a família. Vou usar o serviço todo ano.",
  },
];

const faqs = [
  {
    q: "Quem é obrigado a declarar o IRPF 2026?",
    a: "Quem recebeu rendimentos tributáveis acima de R$ 35.584 em 2025, obteve ganho de capital na venda de bens, realizou operações na bolsa de valores, ou possui bens e direitos acima de R$ 800.000 em 31/12/2025.",
  },
  {
    q: "Qual o prazo oficial do IRPF 2026?",
    a: "O prazo vai de 17 de março a 29 de maio de 2026. Declarações entregues fora do prazo geram multa mínima de R$ 165,74 ou 1% ao mês sobre o imposto devido (o que for maior), limitado a 20%.",
  },
  {
    q: "Como funciona o atendimento 100% online?",
    a: "Você nos envia os documentos via WhatsApp ou email. Analisamos, preparamos a declaração completa e enviamos para sua revisão e aprovação antes de transmitir à Receita Federal. Prazo médio: 24 horas.",
  },
  {
    q: "Posso declarar IRPF de anos anteriores (atrasados)?",
    a: "Sim. Declarações atrasadas podem ser entregues a qualquer momento, com apuração correta das multas e juros. Quanto antes você regularizar, menor o acúmulo de penalidades e o risco de CPF irregular.",
  },
  {
    q: "Qual o valor do serviço?",
    a: "O valor é definido após análise gratuita do seu perfil tributário. Declarações simples têm um custo, enquanto declarações com investimentos, imóveis ou dependentes têm outro. Entre em contato para orçamento sem compromisso.",
  },
];

export default function DeclaracaoLandingClient() {
  const cd = useCountdown(PRAZO);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    tipoDecl: "declaracao-nova",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, origem: "declarar-agora" }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen">
      {/* URGENCY BAR */}
      <div className="bg-[#C6FF00] text-black text-center py-3 px-4">
        <p className="text-[11px] uppercase tracking-widest font-bold">
          ⚠️ Prazo IRPF 2026: 29 de Maio de 2026 — Multa mínima R$ 165,74 por entrega em
          atraso
        </p>
      </div>

      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: headline + CTA */}
            <div>
              <span className="block text-[11px] uppercase tracking-[0.3em] text-white/40 mb-6">
                Consultoria IRPF 2026 — Nilson Brites
              </span>
              <h1 className="font-black text-5xl md:text-6xl lg:text-7xl leading-[0.9] uppercase mb-8">
                Declare seu
                <br />
                <span className="text-[#C6FF00]">IRPF 2026</span>
                <br />
                agora.
              </h1>
              <p className="text-base text-white/60 leading-relaxed mb-8 max-w-md">
                Declarações novas, atrasadas e retificações para todo o Brasil, 100%
                online. Especialista com 10+ anos de experiência. Entrega em 24 horas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#C6FF00] text-black px-8 py-4 font-black uppercase text-sm tracking-widest hover:bg-white transition text-center"
                >
                  Falar com Especialista →
                </a>
                <a
                  href="#declarar"
                  className="inline-block border border-white/30 text-white px-8 py-4 font-bold uppercase text-xs tracking-widest hover:border-white transition text-center"
                >
                  Orçamento Gratuito
                </a>
              </div>
            </div>

            {/* Right: countdown */}
            <div className="border border-white/10 p-8">
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-6 text-center">
                Tempo restante para o prazo IRPF 2026
              </p>
              <div className="grid grid-cols-4 gap-3 text-center mb-6">
                {[
                  { v: cd.days, l: "Dias" },
                  { v: cd.hours, l: "Horas" },
                  { v: cd.minutes, l: "Min" },
                  { v: cd.seconds, l: "Seg" },
                ].map(({ v, l }) => (
                  <div key={l} className="bg-white/5 py-4">
                    <div className="text-4xl md:text-5xl font-black text-[#C6FF00] font-mono tabular-nums leading-none">
                      {String(v).padStart(2, "0")}
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-white/30 mt-2">
                      {l}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-6 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Prazo oficial</span>
                  <span className="text-white font-bold">29 de Maio de 2026</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Multa mínima</span>
                  <span className="text-red-400 font-bold">R$ 165,74</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Multa máx. sobre imposto</span>
                  <span className="text-red-400 font-bold">20% ao mês</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">CPF irregular</span>
                  <span className="text-red-400">Após 30 dias sem declarar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEAD FORM */}
      <section className="border-b border-white/10 py-16 bg-white/[0.02]" id="declarar">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-widest text-[#C6FF00]">
              Orçamento 100% gratuito
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase mt-3 mb-4">
              Solicite seu orçamento
            </h2>
            <p className="text-sm text-white/50">
              Preencha abaixo. Entramos em contato em até 1 hora via WhatsApp com todas as
              informações.
            </p>
          </div>

          {status === "success" ? (
            <div className="border border-[#C6FF00]/40 bg-[#C6FF00]/5 p-10 text-center">
              <p className="text-[#C6FF00] font-black text-2xl uppercase mb-3">
                Recebemos seu contato!
              </p>
              <p className="text-white/60 text-sm mb-8">
                Entraremos em contato em até 1 hora pelo WhatsApp com orientações e
                orçamento personalizado.
              </p>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#C6FF00] text-black px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-white transition"
              >
                Já quer falar agora? WhatsApp →
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nome}
                    onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                    placeholder="Seu nome"
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/20 outline-none focus:border-[#C6FF00] transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="seu@email.com"
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/20 outline-none focus:border-[#C6FF00] transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={form.telefone}
                    onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/20 outline-none focus:border-[#C6FF00] transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">
                    Tipo de declaração
                  </label>
                  <select
                    value={form.tipoDecl}
                    onChange={(e) => setForm((f) => ({ ...f, tipoDecl: e.target.value }))}
                    className="w-full bg-[#0A0A0A] border-b border-white/20 py-3 text-white outline-none focus:border-[#C6FF00] transition [&>option]:bg-[#0A0A0A]"
                  >
                    <option value="declaracao-nova">Declaração nova 2026</option>
                    <option value="irpf-atrasado">IRPF atrasado (anos anteriores)</option>
                    <option value="retificacao">Retificação de declaração</option>
                    <option value="malha-fina">Malha fina / pendências Receita</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#C6FF00] text-black py-5 font-black uppercase text-sm tracking-widest hover:bg-white transition disabled:opacity-50"
              >
                {status === "loading"
                  ? "Enviando..."
                  : "Solicitar Orçamento Gratuito — Resposta em 1 Hora"}
              </button>
              {status === "error" && (
                <p className="text-center text-red-400 text-sm">
                  Erro ao enviar.{" "}
                  <a href={WA_LINK} className="underline">
                    Fale diretamente no WhatsApp →
                  </a>
                </p>
              )}
              <p className="text-center text-[10px] text-white/25">
                Seus dados são protegidos conforme a LGPD. Nenhuma informação é
                compartilhada com terceiros.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="border-b border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              Por que escolher
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase mt-2">
              Nilson Brites — Especialista IRPF
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-white/10">
            {beneficios.map((b) => (
              <div key={b.num} className="bg-[#0A0A0A] p-8">
                <div className="text-[#C6FF00] font-black text-4xl mb-4 leading-none">
                  {b.num}
                </div>
                <h3 className="font-black uppercase text-sm tracking-wide mb-3">{b.titulo}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSO */}
      <section className="border-b border-white/10 py-16 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase">
              Como funciona em{" "}
              <span className="text-[#C6FF00]">3 passos</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {passos.map((p) => (
              <div key={p.num}>
                <div className="text-[90px] font-black text-white/5 leading-none mb-2">
                  {p.num}
                </div>
                <h3 className="font-black uppercase text-sm tracking-wide mb-3 -mt-8">
                  {p.titulo}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-b border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase">O que dizem nossos clientes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {depoimentos.map((t, i) => (
              <div key={i} className="border border-white/10 p-6">
                <p className="text-sm text-white/70 leading-relaxed mb-6">
                  &ldquo;{t.texto}&rdquo;
                </p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs font-black uppercase tracking-wide">{t.nome}</p>
                  <p className="text-[10px] text-white/30">{t.cidade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-white/10 py-16 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase">Perguntas frequentes</h2>
          </div>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/10">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left py-6 flex justify-between items-start gap-4"
                >
                  <span className="text-sm font-bold uppercase tracking-wide">{faq.q}</span>
                  <span className="text-[#C6FF00] shrink-0 text-xl leading-none font-black">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="pb-6 text-sm text-white/60 leading-relaxed -mt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[11px] uppercase tracking-widest text-[#C6FF00] mb-4">
            ⏳ Restam apenas {cd.days} dias para o prazo
          </p>
          <h2 className="text-5xl md:text-6xl font-black uppercase leading-[0.9] mb-8">
            Não arrisque
            <br />
            <span className="text-white/30">sua multa</span>
            <br />
            nem seu CPF.
          </h2>
          <p className="text-sm text-white/50 mb-10 max-w-lg mx-auto">
            Orçamento gratuito, sem compromisso. Resposta em até 1 hora pelo WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#C6FF00] text-black px-10 py-5 font-black uppercase text-sm tracking-widest hover:bg-white transition"
            >
              Declarar Agora — WhatsApp →
            </a>
            <a
              href="#declarar"
              className="inline-block border border-white/20 text-white px-8 py-5 font-bold uppercase text-xs tracking-widest hover:border-white transition"
            >
              Preencher Formulário
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
