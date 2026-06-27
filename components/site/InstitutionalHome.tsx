import Link from "next/link";

export default function InstitutionalHome() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Nilson Brites",
    "jobTitle": "Consultor Financeiro e Tributário",
    "description": "Consultoria especializada em Imposto de Renda Pessoa Física (IRPF), regularização de MEI e planejamento tributário.",
    "url": "https://qaplay.com.br",
    "knowsAbout": [
      "Imposto de Renda",
      "IRPF",
      "MEI",
      "Planejamento Tributário",
      "Legislação Fiscal Brasileira"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "São Paulo",
      "addressRegion": "SP",
      "addressCountry": "BR"
    }
  };

  return (
    <>
      <script
        type="application/ld-json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <div className="bg-[#F9F7F2] text-[#1A1A1A] min-h-screen font-sans selection:bg-[#C9A84C] selection:text-white">
        {/* Header */}
        <header className="border-b border-black/10 py-6 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#2D4033]">
              Nilson Brites
            </span>
            <span className="text-[10px] uppercase tracking-widest bg-[#2D4033] text-white px-2 py-0.5 rounded font-medium">
              Consultoria
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider text-[#2D4033]">
            <a href="#sobre" className="hover:text-[#C9A84C] transition">Sobre</a>
            <a href="#servicos" className="hover:text-[#C9A84C] transition">Serviços</a>
            <a href="#contato" className="hover:text-[#C9A84C] transition">Contato</a>
            <a
              href="https://irpf.qaplay.com.br"
              className="bg-[#2D4033] text-white px-5 py-2.5 rounded hover:bg-[#2D4033]/90 transition"
            >
              Portal IRPF & MEI
            </a>
          </nav>
          <a
            href="https://irpf.qaplay.com.br"
            className="md:hidden bg-[#2D4033] text-white text-xs uppercase tracking-widest font-bold px-4 py-2 rounded"
          >
            Portal
          </a>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 border-b border-black/5">
          <div className="flex-1 space-y-6">
            <span className="inline-block uppercase tracking-widest text-xs font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-3 py-1 rounded">
              10+ Anos de Experiência Tributária
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-[#2D4033] leading-tight font-bold">
              Descomplicando suas obrigações fiscais e tributárias.
            </h1>
            <p className="text-lg text-black/70 max-w-xl leading-relaxed">
              Atendimento 100% online humanizado, com foco em Imposto de Renda Pessoa Física (IRPF), regularização de microempreendedores (MEI) e planejamento financeiro estratégico. A segurança que você precisa com o profissionalismo que você exige.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="https://irpf.qaplay.com.br"
                className="bg-[#2D4033] text-white text-center px-8 py-4 rounded font-bold uppercase tracking-wider text-sm hover:bg-[#2D4033]/90 transition shadow-lg shadow-black/10"
              >
                Acesse o Portal IRPF & MEI
              </a>
              <a
                href="#servicos"
                className="border border-[#2D4033]/30 text-[#2D4033] text-center px-8 py-4 rounded font-bold uppercase tracking-wider text-sm hover:bg-[#2D4033]/5 transition"
              >
                Ver Serviços
              </a>
            </div>
          </div>
          <div className="flex-1 relative w-full max-w-md md:max-w-none flex justify-center">
            <div className="relative p-8 bg-white border border-black/10 rounded-2xl shadow-xl w-full max-w-sm">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#C9A84C]/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#2D4033]/10 rounded-full blur-2xl" />
              <div className="w-24 h-24 bg-[#2D4033] rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-serif font-bold">
                NB
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-serif text-xl font-bold text-[#2D4033]">Nilson Brites</h3>
                <p className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold">Consultor e Gestor Tributário</p>
                <div className="w-12 h-0.5 bg-[#C9A84C] mx-auto my-3" />
                <p className="text-sm text-black/60 italic px-4">
                  "Minha missão é guiar contribuintes e microempreendedores por caminhos seguros, evitando a malha fina e otimizando a carga de impostos de forma totalmente legal."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre Section */}
        <section id="sobre" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-black/5">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="uppercase tracking-widest text-xs font-bold text-[#C9A84C]">Quem é Nilson Brites</span>
              <h2 className="font-serif text-3xl md:text-5xl text-[#2D4033] font-bold">Sobre o Profissional</h2>
              <div className="w-16 h-0.5 bg-[#C9A84C] mx-auto" />
            </div>

            <div className="space-y-6 text-black/80 leading-relaxed text-base md:text-lg">
              <p>
                Sou <strong>Nilson Brites</strong>, consultor tributário especializado com mais de dez anos de atuação prática no mercado financeiro e contábil brasileiro. Ao longo da minha carreira, percebi que a maior barreira para as pessoas físicas e microempresas não é a falta de vontade de pagar os impostos devidos, mas sim a enorme complexidade burocrática imposta pela legislação nacional.
              </p>
              <p>
                Por essa razão, estruturei uma consultoria focada em um atendimento humanizado, ágil e 100% online, para atender contribuintes de todas as regiões do Brasil de maneira rápida e segura. Já vi inúmeros casos em que erros simples na declaração anual levaram trabalhadores a caírem na temida malha fina ou pagarem valores excessivos de imposto sem qualquer necessidade.
              </p>
              <p>
                Meu trabalho baseia-se na transparência absoluta. Seja para elaborar a declaração do seu Imposto de Renda Pessoa Física (IRPF), retificar declarações de anos anteriores, defender notificações de malha fiscal ou gerenciar a regularização de empresas MEI, busco sempre a solução jurídica e tributária mais vantajosa para o cliente. Minha consultoria é projetada para dar tranquilidade ao seu bolso, com a garantia de conformidade fiscal de ponta a ponta.
              </p>
            </div>
          </div>
        </section>

        {/* Servicos Section */}
        <section id="servicos" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-black/5">
          <div className="text-center space-y-3 mb-16">
            <span className="uppercase tracking-widest text-xs font-bold text-[#C9A84C]">O que fazemos</span>
            <h2 className="font-serif text-3xl md:text-5xl text-[#2D4033] font-bold">Serviços Especializados</h2>
            <div className="w-16 h-0.5 bg-[#C9A84C] mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 border border-black/5 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#2D4033]/5 rounded-lg flex items-center justify-center text-2xl text-[#2D4033]">
                  📄
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2D4033]">Declaração IRPF</h3>
                <p className="text-sm text-black/70 leading-relaxed">
                  Elaboração e transmissão completa da declaração de ajuste anual do Imposto de Renda Pessoa Física. Análise minuciosa de despesas dedutíveis para maximizar sua restituição ou reduzir o imposto a pagar.
                </p>
              </div>
              <div className="pt-6">
                <a href="https://irpf.qaplay.com.br/declarar-agora" className="text-sm font-bold text-[#C9A84C] hover:underline inline-flex items-center gap-1">
                  Saiba mais &rarr;
                </a>
              </div>
            </div>

            <div className="bg-white p-8 border border-black/5 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#2D4033]/5 rounded-lg flex items-center justify-center text-2xl text-[#2D4033]">
                  💼
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2D4033]">Regularização MEI</h3>
                <p className="text-sm text-black/70 leading-relaxed">
                  Gestão contábil e fiscal para Microempreendedores Individuais. Emissão de guias DAS atrasadas, parcelamento de débitos, declaração anual DASN-SIMEI e assessoria para desenquadramento ou formalização.
                </p>
              </div>
              <div className="pt-6">
                <a href="https://irpf.qaplay.com.br/mei" className="text-sm font-bold text-[#C9A84C] hover:underline inline-flex items-center gap-1">
                  Saiba mais &rarr;
                </a>
              </div>
            </div>

            <div className="bg-white p-8 border border-black/5 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#2D4033]/5 rounded-lg flex items-center justify-center text-2xl text-[#2D4033]">
                  🛠️
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2D4033]">Retificação & Malha</h3>
                <p className="text-sm text-black/70 leading-relaxed">
                  Correção de inconsistências em declarações já enviadas para retirar seu CPF da malha fina. Atendimento rápido de notificações da Receita Federal e solução de pendências do extrato IRPF.
                </p>
              </div>
              <div className="pt-6">
                <a href="https://irpf.qaplay.com.br/consulte-sem-medo" className="text-sm font-bold text-[#C9A84C] hover:underline inline-flex items-center gap-1">
                  Saiba mais &rarr;
                </a>
              </div>
            </div>

            <div className="bg-white p-8 border border-black/5 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#2D4033]/5 rounded-lg flex items-center justify-center text-2xl text-[#2D4033]">
                  📈
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2D4033]">Bolsa & Cripto</h3>
                <p className="text-sm text-black/70 leading-relaxed">
                  Declaração avançada para investidores. Apuração de ganhos de capital em operações day trade, swing trade, fundos imobiliários, dividendos recebidos no exterior e movimentações com criptoativos.
                </p>
              </div>
              <div className="pt-6">
                <a href="https://irpf.qaplay.com.br/blog" className="text-sm font-bold text-[#C9A84C] hover:underline inline-flex items-center gap-1">
                  Saiba mais &rarr;
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contato Section */}
        <section id="contato" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="bg-white border border-black/10 rounded-2xl p-8 md:p-16 shadow-xl flex flex-col lg:flex-row gap-12 items-center justify-between">
            <div className="space-y-6 max-w-lg">
              <span className="uppercase tracking-widest text-xs font-bold text-[#C9A84C]">Fale Conosco</span>
              <h2 className="font-serif text-3xl md:text-5xl text-[#2D4033] font-bold">Entre em contato hoje mesmo</h2>
              <p className="text-black/70">
                Tem dúvidas sobre a sua situação fiscal ou precisa declarar seu imposto de renda atrasado? Deixe uma mensagem ou clique para falar diretamente conosco pelo nosso portal integrado.
              </p>
              <div className="space-y-4 pt-2 text-sm text-black/80 font-medium">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📧</span>
                  <span>contato@qaplay.com.br</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">📍</span>
                  <span>Atendimento 100% Online — São Paulo / SP, Brasil</span>
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm bg-[#F9F7F2] p-8 border border-black/5 rounded-xl text-center space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#2D4033]">Atendimento Exclusivo</h3>
              <p className="text-sm text-black/60">
                Acesse nossa plataforma oficial para realizar simulações de imposto de renda, ler as últimas notícias fiscais ou agendar uma reunião direta.
              </p>
              <a
                href="https://irpf.qaplay.com.br"
                className="block bg-[#2D4033] text-white text-center py-3 rounded font-bold uppercase tracking-wider text-xs hover:bg-[#2D4033]/90 transition"
              >
                Acessar Plataforma IRPF
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#2D4033] text-[#F9F7F2]/70 py-12 px-6 md:px-12 border-t border-black/20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border-b border-[#F9F7F2]/10 pb-8 mb-8 text-sm">
            <div className="space-y-2 text-center md:text-left">
              <span className="font-serif text-xl font-bold text-white block">Nilson Brites</span>
              <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold">Consultoria Tributária</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 font-semibold uppercase tracking-wider text-xs text-white">
              <a href="#sobre" className="hover:text-white transition">Sobre</a>
              <a href="#servicos" className="hover:text-white transition">Serviços</a>
              <a href="#contato" className="hover:text-white transition">Contato</a>
              <a href="https://irpf.qaplay.com.br/politica-de-privacidade" className="hover:text-white transition">Políticas de Privacidade</a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto text-center md:text-left text-[11px] space-y-4">
            <p>
              &copy; {new Date().getFullYear()} Nilson Brites — Consultoria Tributária. Todos os direitos reservados.
            </p>
            <p className="max-w-3xl leading-relaxed">
              <strong>Isenção de Responsabilidade:</strong> As informações contidas neste site possuem caráter puramente institucional e informativo. Para orientação ou planejamento de casos específicos, solicite atendimento diretamente com nossa consultoria especializada para análise das peculiaridades tributárias aplicáveis.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
