import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consulta Situacao IRPF | Consultoria IRPF NSB",
  description:
    "Saiba como consultar a situacao da sua declaracao de IRPF na Receita Federal.",
};

const WA_LINK = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "5511940825120"}?text=${encodeURIComponent("Olá! Quero consultar a situação do meu IRPF.")}`;

const passos = [
  {
    num: "01",
    title: "Acesse o e-CAC",
    desc: 'Entre no Centro Virtual de Atendimento da Receita Federal (e-CAC) atraves do portal gov.br com sua conta nivel prata ou ouro.',
  },
  {
    num: "02",
    title: "Meu Imposto de Renda",
    desc: 'Acesse a opcao "Meu Imposto de Renda (Extrato da DIRPF)" para visualizar todas as suas declaracoes.',
  },
  {
    num: "03",
    title: "Verifique o status",
    desc: 'Confira se sua declaracao consta como "Em processamento", "Processada", "Em fila de restituicao" ou "Com pendencias".',
  },
  {
    num: "04",
    title: "Pendencias na malha?",
    desc: "Se houver pendencias, identifique o motivo e nos procure para resolver. Retificamos sua declaracao e acompanhamos ate a regularizacao.",
  },
];

export default function ConsultaSituacaoPage() {
  return (
    <main className="pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-6">
        <span className="block text-sm uppercase tracking-[0.3em] mb-6 opacity-60">
          Orientacao
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-4">
          Consultar Situacao do IRPF
        </h1>
        <p className="text-lg opacity-70 max-w-2xl mb-16">
          Acompanhe o processamento da sua declaracao e verifique se ha
          pendencias com a Receita Federal.
        </p>

        <div className="space-y-12 mb-16">
          {passos.map((p) => (
            <div key={p.num} className="grid md:grid-cols-12 gap-6 editorial-border pb-10">
              <span className="md:col-span-1 font-serif italic text-2xl text-ouro">
                {p.num}
              </span>
              <h3 className="md:col-span-3 font-serif text-2xl">{p.title}</h3>
              <p className="md:col-span-8 opacity-70 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-verde text-white p-12 text-center">
          <h2 className="font-serif text-3xl mb-4">
            Precisa de ajuda com pendencias?
          </h2>
          <p className="opacity-70 mb-8 max-w-xl mx-auto">
            Se sua declaracao caiu na malha fina ou tem pendencias, nossa equipe
            pode resolver. Atendimento rapido e especializado.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-verde px-8 py-4 inline-block uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition"
          >
            Falar com Consultor
          </a>
        </div>
      </section>
    </main>
  );
}
