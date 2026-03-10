import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLdPerson } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Sobre | Consultoria IRPF NSB",
  description:
    "Conheca a Consultoria IRPF NSB. Mais de 10 anos de experiencia em declaracao de Imposto de Renda Pessoa Fisica. 100% online, todo o Brasil.",
};

export default function SobrePage() {
  return (
    <main className="pt-32 pb-24">
      <JsonLdPerson />
      <section className="max-w-7xl mx-auto px-6">
        <span className="block text-sm uppercase tracking-[0.3em] mb-6 opacity-60">
          Sobre Nos
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-16">
          A Consultoria
        </h1>

        <div className="grid md:grid-cols-2 gap-16 mb-24">
          <div className="relative aspect-[4/5] bg-gray-200 overflow-hidden">
            <Image
              src="/nilson-profile.jpg"
              alt="Consultor IRPF NSB"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="font-serif text-3xl mb-6">
              Mais de uma decada de dedicacao ao IRPF
            </h2>
            <p className="opacity-70 leading-relaxed mb-6">
              A Consultoria IRPF NSB nasceu da conviccao de que a declaracao de
              Imposto de Renda nao precisa ser uma experiencia estressante.
              Com mais de 10 anos de experiencia em analise financeira e
              tributacao de pessoa fisica, transformamos um processo
              burocratico em algo simples e seguro.
            </p>
            <p className="opacity-70 leading-relaxed mb-6">
              Nosso compromisso e com a precisao, a conformidade e a
              maximizacao da sua restituicao dentro da legalidade. Cada
              declaracao recebe atencao individualizada, porque entendemos que
              cada patrimonio tem suas particularidades.
            </p>
            <p className="opacity-70 leading-relaxed mb-8">
              Atendemos contribuintes de todo o Brasil, 100% online, com a
              mesma qualidade e agilidade — independente de onde voce esteja.
            </p>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <span className="font-serif text-3xl text-ouro">10+</span>
                <span className="block text-[10px] uppercase tracking-widest opacity-50 mt-1">
                  Anos
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl text-ouro">400+</span>
                <span className="block text-[10px] uppercase tracking-widest opacity-50 mt-1">
                  Declaracoes/mes
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl text-ouro">100%</span>
                <span className="block text-[10px] uppercase tracking-widest opacity-50 mt-1">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 editorial-border pt-12">
          <div>
            <h3 className="font-serif text-xl mb-4">Missao</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              Oferecer consultoria tributaria de Imposto de Renda Pessoa Fisica
              com excelencia, acessibilidade e transparencia para todos os
              contribuintes brasileiros.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl mb-4">Valores</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              Precisao tecnica, etica profissional, atendimento humanizado e
              compromisso total com a conformidade fiscal dos nossos clientes.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl mb-4">Diferencial</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              Combinamos experiencia consolidada com tecnologia moderna.
              Atendimento personalizado com ferramentas inteligentes para
              maximizar seu resultado.
            </p>
          </div>
        </div>

        {/* Bloco E-E-A-T: por que confiar */}
        <div className="editorial-border pt-12 mt-12">
          <span className="block text-sm uppercase tracking-[0.3em] mb-6 opacity-60">
            Credenciais
          </span>
          <h2 className="font-serif text-3xl md:text-4xl mb-10">
            Por que confiar na Consultoria IRPF NSB
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="font-serif text-2xl text-ouro flex-shrink-0">01</span>
                <div>
                  <h4 className="font-semibold text-sm mb-1">10+ anos de experiencia exclusiva em IRPF PF</h4>
                  <p className="text-sm opacity-60 leading-relaxed">
                    Declaracoes simples, complexas, atrasadas e com multiplas fontes de renda — todo o espectro do Imposto de Renda Pessoa Fisica.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="font-serif text-2xl text-ouro flex-shrink-0">02</span>
                <div>
                  <h4 className="font-semibold text-sm mb-1">400+ declaracoes processadas por mes</h4>
                  <p className="text-sm opacity-60 leading-relaxed">
                    Volume real, atendimento individual. Cada declaracao e revisada com rigor antes do envio a Receita Federal.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="font-serif text-2xl text-ouro flex-shrink-0">03</span>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Entrega em 24 horas uteis</h4>
                  <p className="text-sm opacity-60 leading-relaxed">
                    Agilidade sem abrir mao da qualidade. Voce envia os documentos, nos cuidamos do resto.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="font-serif text-2xl text-ouro flex-shrink-0">04</span>
                <div>
                  <h4 className="font-semibold text-sm mb-1">1 ano de suporte pos-declaracao incluido</h4>
                  <p className="text-sm opacity-60 leading-relaxed">
                    Caso a Receita Federal solicite documentacao ou esclarecimentos, estamos disponíveis sem custo adicional.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="font-serif text-2xl text-ouro flex-shrink-0">05</span>
                <div>
                  <h4 className="font-semibold text-sm mb-1">100% online — todo o Brasil</h4>
                  <p className="text-sm opacity-60 leading-relaxed">
                    Processo digital completo: envio de documentos, revisao, entrega e suporte sem sair de casa.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="font-serif text-2xl text-ouro flex-shrink-0">06</span>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Dados verificados, zero praticas enganosas</h4>
                  <p className="text-sm opacity-60 leading-relaxed">
                    Todos os consultores usam apenas informacoes oficiais da Receita Federal e legislacao vigente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-verde text-white p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-serif text-xl mb-1">Pronto para regularizar sua situacao fiscal?</p>
              <p className="text-sm opacity-70">Fale com o especialista. Resposta rapida, sem compromisso.</p>
            </div>
            <Link
              href={`https://wa.me/5511940825120?text=${encodeURIComponent("Olá! Quero declarar meu IRPF.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-verde px-8 py-3 uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition flex-shrink-0"
            >
              Falar pelo WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
