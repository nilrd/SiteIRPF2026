import type { Metadata } from "next";
import Link from "next/link";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Política de Privacidade | Consultoria IRPF NSB",
  description:
    "Política de Privacidade da Consultoria IRPF NSB. Saiba como coletamos, usamos e protegemos seus dados pessoais conforme a LGPD.",
  alternates: { canonical: "https://irpf.qaplay.com.br/politica-de-privacidade" },
  robots: { index: true, follow: true },
};

export default function PoliticaPrivacidadePage() {
  const lastUpdate = "1 de junho de 2026";

  return (
    <main className="pt-32 pb-24">
      <JsonLdBreadcrumb
        items={[
          { name: "Política de Privacidade", url: "https://irpf.qaplay.com.br/politica-de-privacidade" },
        ]}
      />

      <section className="max-w-4xl mx-auto px-6">
        <span className="block text-sm uppercase tracking-[0.3em] mb-4 opacity-60">
          Transparência
        </span>
        <h1 className="font-serif text-5xl md:text-6xl mb-4">
          Política de Privacidade
        </h1>
        <p className="text-sm opacity-50 mb-16">
          Última atualização: {lastUpdate}
        </p>

        <div className="prose-irpf space-y-10">

          <section>
            <h2 className="font-serif text-2xl mb-4">1. Quem somos</h2>
            <p>
              A <strong>Consultoria IRPF NSB</strong>, operada por Nilson Brites
              (Analista Financeiro, 10+ anos de experiência), presta serviços de
              declaração de Imposto de Renda Pessoa Física (IRPF) de forma 100%
              online para todo o Brasil.
            </p>
            <p>
              <strong>Site:</strong>{" "}
              <a href="https://irpf.qaplay.com.br">https://irpf.qaplay.com.br</a>
              <br />
              <strong>E-mail:</strong>{" "}
              <a href="mailto:nilson.brites@gmail.com">nilson.brites@gmail.com</a>
              <br />
              <strong>WhatsApp:</strong>{" "}
              <a href="https://wa.me/5511940825120">+55 (11) 94082-5120</a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">2. Dados que coletamos</h2>
            <p>Coletamos os seguintes dados pessoais quando você nos contata ou usa nossos serviços:</p>
            <ul>
              <li><strong>Dados de identificação:</strong> nome completo, CPF (apenas para prestação do serviço de IRPF)</li>
              <li><strong>Dados de contato:</strong> e-mail, número de WhatsApp/telefone</li>
              <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas visitadas, tempo na página (via Google Analytics)</li>
              <li><strong>Cookies:</strong> identificadores de sessão, preferências, cookies de publicidade do Google AdSense</li>
              <li><strong>Dados financeiros:</strong> somente os documentos que você envia voluntariamente para a declaração do IRPF (informe de rendimentos, recibos, etc.)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">3. Como usamos seus dados</h2>
            <p>Utilizamos seus dados para:</p>
            <ul>
              <li>Prestação do serviço de declaração de IRPF contratado</li>
              <li>Comunicação sobre o andamento do serviço (WhatsApp ou e-mail)</li>
              <li>Envio de orientações fiscais pertinentes ao seu caso</li>
              <li>Melhorar a experiência de navegação no site</li>
              <li>Análise de uso agregada por meio do Google Analytics</li>
              <li>Exibição de publicidade contextual pelo Google AdSense</li>
            </ul>
            <p>
              <strong>Não vendemos, alugamos nem compartilhamos seus dados pessoais</strong> com
              terceiros, exceto com provedores de serviço estritamente necessários (Google Analytics,
              Google AdSense, serviço de e-mail) e mediante obrigação legal.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">4. Cookies e publicidade</h2>
            <p>
              Nosso site usa cookies para melhorar a experiência de navegação e para exibição de
              anúncios personalizados. Utilizamos os seguintes serviços que podem inserir cookies:
            </p>
            <ul>
              <li>
                <strong>Google Analytics (GA4):</strong> análise de tráfego e comportamento de
                navegação de forma anonimizada.
              </li>
              <li>
                <strong>Google AdSense:</strong> exibição de anúncios contextuais. O Google pode
                usar cookies para exibir anúncios com base em visitas anteriores ao nosso site ou
                a outros sites.{" "}
                <a
                  href="https://www.google.com/policies/privacy/partners/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Saiba como o Google usa informações de sites que utilizam seus serviços ↗
                </a>
              </li>
              <li>
                <strong>Google Ads (Conversões):</strong> medição de conversões de campanhas de
                anúncios.
              </li>
            </ul>
            <p>
              Você pode gerenciar suas preferências de cookies nas configurações do seu navegador ou
              em{" "}
              <a
                href="https://adssettings.google.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Configurações de Anúncios do Google ↗
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">5. Base legal (LGPD)</h2>
            <p>
              O tratamento de dados pessoais realizado pela Consultoria IRPF NSB está fundamentado
              nas seguintes bases legais da Lei Geral de Proteção de Dados (Lei nº 13.709/2018):
            </p>
            <ul>
              <li>
                <strong>Execução de contrato:</strong> para prestação do serviço de declaração
                de IRPF solicitado por você (Art. 7º, V da LGPD).
              </li>
              <li>
                <strong>Legítimo interesse:</strong> para análise de uso do site e melhoria dos
                serviços (Art. 7º, IX da LGPD).
              </li>
              <li>
                <strong>Consentimento:</strong> para uso de cookies de publicidade e comunicações
                de marketing (Art. 7º, I da LGPD).
              </li>
              <li>
                <strong>Cumprimento de obrigação legal:</strong> quando exigido por lei ou órgão
                governamental (Art. 7º, II da LGPD).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">6. Compartilhamento de dados</h2>
            <p>
              Compartilhamos dados estritamente necessários com os seguintes parceiros de tecnologia:
            </p>
            <ul>
              <li>
                <strong>Google LLC</strong> — Google Analytics, Google AdSense, Google Ads
                (sujeito à{" "}
                <a
                  href="https://policies.google.com/privacy?hl=pt-BR"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Política de Privacidade do Google ↗
                </a>
                )
              </li>
              <li>
                <strong>Resend (email service)</strong> — envio de e-mails transacionais de
                confirmação de contato
              </li>
              <li>
                <strong>Supabase</strong> — armazenamento seguro de dados de contato e sessão,
                com servidores na região América do Sul
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">7. Retenção de dados</h2>
            <p>
              Mantemos seus dados pessoais pelo tempo necessário para a prestação do serviço e
              cumprimento de obrigações legais:
            </p>
            <ul>
              <li>Dados de contato e serviço: até 5 anos após o encerramento do contrato (prazo
              de guarda fiscal)</li>
              <li>Dados de navegação (Analytics): 14 meses (configuração padrão do GA4)</li>
              <li>Cookies de sessão: até o fechamento do navegador</li>
              <li>Cookies de publicidade: conforme política do Google AdSense (até 13 meses)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">8. Seus direitos (LGPD)</h2>
            <p>
              Como titular de dados pessoais, você tem os seguintes direitos garantidos pela LGPD:
            </p>
            <ul>
              <li>Confirmação da existência de tratamento de seus dados</li>
              <li>Acesso aos dados que mantemos sobre você</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
              <li>Portabilidade dos dados a outro prestador de serviço</li>
              <li>Eliminação dos dados tratados com base no seu consentimento</li>
              <li>Revogação do consentimento a qualquer momento</li>
            </ul>
            <p>
              Para exercer qualquer um desses direitos, entre em contato pelo e-mail{" "}
              <a href="mailto:nilson.brites@gmail.com">nilson.brites@gmail.com</a> ou pelo{" "}
              <a href="https://wa.me/5511940825120">WhatsApp +55 (11) 94082-5120</a>. Responderemos
              em até 15 dias úteis.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">9. Segurança dos dados</h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados pessoais:
            </p>
            <ul>
              <li>Transmissão de dados via HTTPS (TLS 1.3)</li>
              <li>Armazenamento em banco de dados criptografado (Supabase/PostgreSQL)</li>
              <li>Acesso restrito aos dados por autenticação segura</li>
              <li>Não armazenamos documentos fiscais no servidor — eles são processados e
              descartados após a declaração</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">10. Menores de idade</h2>
            <p>
              Nossos serviços são destinados a pessoas maiores de 18 anos. Não coletamos
              intencionalmente dados de crianças ou adolescentes. Caso identifiquemos que dados
              de menor foram coletados sem consentimento parental, os excluiremos imediatamente.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">11. Alterações nesta política</h2>
            <p>
              Esta política pode ser atualizada periodicamente para refletir mudanças em nossas
              práticas ou na legislação. A data da última atualização é sempre indicada no topo
              desta página. Alterações significativas serão comunicadas por e-mail ou aviso
              no site.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">12. Contato e DPO</h2>
            <p>
              Para dúvidas, solicitações ou exercício de direitos relacionados à privacidade:
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
              <li>
                <strong>Responsável:</strong> Nilson Brites — Analista Financeiro
              </li>
            </ul>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-[#0A0A0A]/10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/termos-de-uso"
            className="text-sm text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition underline"
          >
            Termos de Uso
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
