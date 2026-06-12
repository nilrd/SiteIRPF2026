"use client";

import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { JsonLdFAQ } from "@/components/seo/JsonLd";

const faqs = [
  {
    q: "Quem é obrigado a declarar o IRPF em 2026?",
    a: "No exercício de 2026, ficou obrigado a declarar quem recebeu rendimentos tributáveis acima de R$ 35.584,00, rendimentos isentos ou não tributáveis acima de R$ 200.000,00, fez operações em bolsa acima de R$ 40.000,00, teve atividade rural acima de R$ 177.920,00, possuía bens acima de R$ 800.000,00 em 31/12/2025 ou se enquadrou nas demais hipóteses legais da Receita Federal.",
  },
  {
    q: "Qual o prazo para entregar a declaração IRPF 2026?",
    a: "O prazo do IRPF 2026 já foi encerrado. Mesmo assim, a declaração em atraso continua podendo ser entregue a qualquer momento, com multa mínima de R$ 165,74 ou 1% ao mês sobre o imposto devido, limitada a 20%.",
  },
  {
    q: "Como funciona o serviço 100% online?",
    a: "Você envia seus documentos pelo WhatsApp ou formulário no nosso site. Nosso consultor analisa tudo, prepara a declaração e envia o comprovante de entrega. Todo o processo é digital, sem necessidade de presença física.",
  },
  {
    q: "Quanto custa para declarar o IRPF?",
    a: "O valor depende da complexidade da sua declaração. Envie seus documentos pelo WhatsApp e receberá um orçamento personalizado sem compromisso.",
  },
  {
    q: "Como posso maximizar minha restituição?",
    a: "Através da análise detalhada de todas as suas deduções legais: despesas médicas sem limite, educação até R$ 3.561,50 por pessoa, dependentes (R$ 2.275,08 cada), previdência privada PGBL (até 12% da renda) e outras. Nosso consultor identifica todas as oportunidades dentro da lei.",
  },
  {
    q: "O que acontece se eu não declarar?",
    a: "A falta de declaração gera multa de 1% ao mês sobre o imposto devido, com mínimo de R$ 165,74 e limite de 20%. Além disso, a omissão pode gerar pendências no CPF, dificuldade para obter crédito, financiar bens e comprovar regularidade fiscal.",
  },
  {
    q: "Posso retificar uma declaração já enviada?",
    a: "Sim. A retificação pode ser feita a qualquer momento dentro do prazo de 5 anos. Corrigimos erros, incluímos informações faltantes e ajustamos valores para manter sua conformidade com a Receita Federal.",
  },
  {
    q: "Atendem todo o Brasil?",
    a: "Sim. Nosso atendimento é 100% online, atendendo contribuintes de todos os estados brasileiros com a mesma qualidade e agilidade.",
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
        <h2 className="font-serif text-4xl md:text-5xl">Dúvidas Comuns</h2>
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
