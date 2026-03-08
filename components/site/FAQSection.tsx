"use client";

import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { JsonLdFAQ } from "@/components/seo/JsonLd";

const faqs = [
  {
    q: "Quem e obrigado a declarar o IRPF em 2025?",
    a: "Deve declarar quem recebeu rendimentos tributaveis acima de R$ 33.888 em 2024, rendimentos isentos acima de R$ 200.000, teve bens acima de R$ 800.000, operou na bolsa acima de R$ 40.000, entre outros criterios definidos pela Receita Federal.",
  },
  {
    q: "Qual o prazo para entregar a declaracao?",
    a: "O prazo de entrega da declaracao do IRPF 2025 (ano-calendario 2024) vai de 17 de marco a 30 de maio de 2025. Declaracoes atrasadas estao sujeitas a multa minima de R$ 165,74.",
  },
  {
    q: "Como funciona o servico 100% online?",
    a: "Voce envia seus documentos pelo WhatsApp ou formulario no nosso site. Nosso consultor analisa tudo, prepara a declaracao e envia o comprovante de entrega. Todo o processo e digital, sem necessidade de presenca fisica.",
  },
  {
    q: "Quanto custa para declarar o IRPF?",
    a: "O valor depende da complexidade da sua declaracao. Envie seus documentos pelo WhatsApp e recebera um orcamento personalizado sem compromisso.",
  },
  {
    q: "Como posso maximizar minha restituicao?",
    a: "Atraves da analise detalhada de todas as suas deducoes legais: despesas medicas, educacao, dependentes, previdencia privada (PGBL) e outras. Nosso consultor identifica todas as oportunidades dentro da lei.",
  },
  {
    q: "O que acontece se eu nao declarar?",
    a: "A falta de declaracao gera multa de 1% ao mes sobre o imposto devido (minimo R$ 165,74, maximo R$ 6.275,00), alem de CPF irregular que impede emprestimos, concursos publicos e viagens ao exterior.",
  },
  {
    q: "Posso retificar uma declaracao ja enviada?",
    a: "Sim. A retificacao pode ser feita a qualquer momento dentro do prazo de 5 anos. Corrigimos erros, incluimos informacoes faltantes e ajustamos valores para manter sua conformidade com a Receita Federal.",
  },
  {
    q: "Atendem todo o Brasil?",
    a: "Sim. Nosso atendimento e 100% online, atendendo contribuintes de todos os estados brasileiros com a mesma qualidade e agilidade.",
  },
];

export default function FAQSection() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-14">
      <JsonLdFAQ faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))} />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <span className="text-[10px] uppercase tracking-widest opacity-40 mb-4 block">
          Perguntas Frequentes
        </span>
        <h2 className="font-serif text-4xl md:text-5xl">Duvidas Comuns</h2>
      </motion.div>

      <Accordion.Root type="single" collapsible className="space-y-0">
        {faqs.map((faq, i) => (
          <Accordion.Item key={i} value={`faq-${i}`} className="editorial-border">
            <Accordion.Trigger className="w-full flex justify-between items-center py-6 text-left group">
              <span className="font-serif text-lg md:text-xl pr-8 group-hover:italic transition-all">
                {faq.q}
              </span>
              <ChevronDown className="w-5 h-5 shrink-0 opacity-40 transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
              <p className="pb-6 text-sm leading-relaxed opacity-70 pl-0 md:pl-0 max-w-2xl">
                {faq.a}
              </p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
