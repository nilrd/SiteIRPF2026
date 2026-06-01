import type { Metadata } from "next";
import Link from "next/link";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Termos de Uso | Consultoria IRPF NSB",
  description:
    "Termos de Uso da Consultoria IRPF NSB. Condições para utilização do site e dos serviços de declaração de Imposto de Renda.",
  alternates: { canonical: "https://irpf.qaplay.com.br/termos-de-uso" },
  robots: { index: true, follow: true },
};

export default function TermosDeUsoPage() {
  const lastUpdate = "1 de junho de 2026";

  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Termos de Uso", url: "https://irpf.qaplay.com.br/termos-de-uso" },
        ]}
      />

      <section className="max-w-4xl mx-auto px-6">
        <span className="block text-sm uppercase tracking-[0.3em] mb-4 opacity-60">
          Legal
        </span>
        <h1 className="font-serif text-5xl md:text-6xl mb-4">
          Termos de Uso
        </h1>
        <p className="text-sm opacity-50 mb-16">
          Última atualização: {lastUpdate}
        </p>

        <div className="prose-irpf space-y-10">

          <section>
            <h2 className="font-serif text-2xl mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar o site <strong>irpf.qaplay.com.br</strong> (&ldquo;Site&rdquo;) ou
              contratar os serviços da <strong>Consultoria IRPF NSB</strong>, operada por
              Nilson Brites, você concorda com os presentes Termos de Uso. Caso não concorde,
              não utilize o Site nem nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">2. Descrição dos Serviços</h2>
            <p>
              A Consultoria IRPF NSB oferece, através do Site e de canais digitais (WhatsApp,
              e-mail), os seguintes serviços:
            </p>
            <ul>
              <li>Declaração de Imposto de Renda Pessoa Física (IRPF) — anos correntes e anteriores</li>
              <li>Retificação de declarações de IRPF já entregues</li>
              <li>Orientação para regularização de CPF junto à Receita Federal</li>
              <li>Declaração Anual do MEI (DASN-SIMEI)</li>
              <li>Ferramentas informativas online: calculadora de IR, simulador de multa</li>
              <li>Blog com conteúdo educativo sobre tributação pessoal</li>
            </ul>
            <p>
              Os serviços são prestados <strong>100% online</strong> para todo o território
              brasileiro. A prestação do serviço está condicionada ao envio dos documentos
              necessários pelo cliente e ao pagamento do valor acordado.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">3. Uso do Site</h2>
            <p>Ao utilizar o Site, você se compromete a:</p>
            <ul>
              <li>Fornecer informações verdadeiras, completas e atualizadas ao nos contatar</li>
              <li>Não utilizar o Site para fins ilícitos, fraudulentos ou que violem direitos de terceiros</li>
              <li>Não tentar acessar áreas restritas do sistema sem autorização</li>
              <li>Não reproduzir, copiar ou redistribuir o conteúdo do Site sem autorização expressa</li>
              <li>Não utilizar robôs, scripts ou outros meios automatizados para acessar o Site sem permissão</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">4. Conteúdo do Site</h2>
            <p>
              Todo o conteúdo publicado no Site — incluindo artigos de blog, ferramentas,
              calculadoras e guias — tem <strong>caráter exclusivamente informativo e educativo</strong>.
            </p>
            <p>
              As informações não constituem consultoria jurídica ou fiscal formal e não
              substituem a análise individualizada da sua situação tributária por um profissional
              qualificado. Decisões fiscais devem ser tomadas com base na legislação vigente
              e, preferencialmente, com orientação profissional.
            </p>
            <p>
              Embora nos esforcemos para manter o conteúdo atualizado e preciso, não garantimos
              que todas as informações estejam sempre atualizadas em relação às últimas mudanças
              na legislação tributária brasileira.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">5. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo do Site, incluindo textos, imagens, logotipos, design, código-fonte
              e materiais educativos, é de propriedade da Consultoria IRPF NSB ou licenciado
              para uso. É vedada a reprodução, total ou parcial, sem autorização prévia por escrito.
            </p>
            <p>
              Você pode compartilhar links para páginas do Site, desde que não desvirtue o
              conteúdo ou crie impressão falsa de afiliação com a Consultoria IRPF NSB.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">6. Limitação de Responsabilidade</h2>
            <p>A Consultoria IRPF NSB não se responsabiliza por:</p>
            <ul>
              <li>Erros ou omissões nas declarações causados por documentos incorretos ou
              incompletos fornecidos pelo cliente</li>
              <li>Decisões da Receita Federal sobre processos de malha fina ou autuações
              decorrentes de informações prestadas pelo próprio contribuinte</li>
              <li>Indisponibilidade temporária dos sistemas da Receita Federal (e-CAC, PGDAS,
              portal do MEI)</li>
              <li>Danos indiretos, lucros cessantes ou perdas decorrentes do uso ou
              impossibilidade de uso do Site</li>
            </ul>
            <p>
              Nossa responsabilidade limita-se ao valor pago pelo serviço contratado.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">7. Pagamento e Cancelamento</h2>
            <p>
              Os valores dos serviços são informados no momento da contratação via WhatsApp
              ou formulário de contato. O pagamento é acordado individualmente conforme a
              complexidade da declaração.
            </p>
            <p>
              <strong>Cancelamento:</strong> após o início da elaboração da declaração (análise
              dos documentos), pode ser cobrado valor proporcional ao trabalho já realizado.
              Declarações já transmitidas à Receita Federal não podem ser canceladas — somente
              retificadas (serviço separado).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">8. Publicidade</h2>
            <p>
              O Site pode exibir anúncios veiculados pelo Google AdSense. Esses anúncios são
              selecionados e exibidos automaticamente pelo Google com base em algoritmos de
              relevância e personalização. A Consultoria IRPF NSB não é responsável pelo
              conteúdo dos anúncios exibidos.
            </p>
            <p>
              Para mais informações sobre como o Google usa dados para personalização de anúncios,
              acesse:{" "}
              <a
                href="https://policies.google.com/technologies/ads?hl=pt-BR"
                target="_blank"
                rel="noopener noreferrer"
              >
                Políticas de Publicidade do Google ↗
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">9. Links Externos</h2>
            <p>
              O Site pode conter links para sites externos (como Receita Federal, portal do
              e-CAC, Serpro). Não somos responsáveis pelo conteúdo, política de privacidade
              ou práticas desses sites de terceiros.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">10. Legislação Aplicável</h2>
            <p>
              Estes Termos são regidos pelas leis brasileiras, em especial:
            </p>
            <ul>
              <li>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</li>
              <li>Código de Defesa do Consumidor (Lei nº 8.078/1990)</li>
              <li>Marco Civil da Internet (Lei nº 12.965/2014)</li>
              <li>Código Civil Brasileiro (Lei nº 10.406/2002)</li>
            </ul>
            <p>
              Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer
              controvérsias oriundas destes Termos.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">11. Contato</h2>
            <p>
              Para dúvidas sobre estes Termos de Uso:
            </p>
            <ul>
              <li>
                <strong>E-mail:</strong>{" "}
                <a href="mailto:nilson.brites@gmail.com">nilson.brites@gmail.com</a>
              </li>
              <li>
                <strong>WhatsApp:</strong>{" "}
                <a href="https://wa.me/5511940825120">+55 (11) 94082-5120</a>
              </li>
            </ul>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-[#0A0A0A]/10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/politica-de-privacidade"
            className="text-sm text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition underline"
          >
            Política de Privacidade
          </Link>
          <Link
            href="/contato"
            className="text-sm text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition underline"
          >
            Entre em Contato
          </Link>
        </div>
      </section>
    </main>
  );
}
