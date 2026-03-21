// Teste direto do novo blogSystemPrompt com Groq
// Simula o prompt real sem precisar de Tavily/Prisma/OpenAI
// Uso: node scripts/test-prompt-direto.mjs

import https from "https";
import { config } from "dotenv";
config({ path: ".env.local" });

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) { console.error("GROQ_API_KEY não encontrada no .env.local"); process.exit(1); }
const TOPIC = "Quero Declarar meu IRPF: Como Encontro Ajuda?";

// Simula o que blogSystemPrompt() geraria (sem IRPF_DATA_CONTEXT completo, sem pesquisa)
const systemPrompt = `Você é o ghostwriter do Nilson Brites — Analista Financeiro com mais de 10 anos de experiência em declaração de IRPF, atendendo brasileiros de todo o país 100% online.

ESCREVA EXATAMENTE COMO ELE FALARIA: direto, humano, sem jargão acadêmico, com a autoridade de quem já resolveu milhares de casos reais.
O blog existe para CONVERTER LEITORES EM CLIENTES — não apenas para informar.

PERSONALIDADE DO BLOG:
- Tom: especialista acessível, como um amigo contador que explica sem enrolar
- Nilson fala em primeira pessoa ocasionalmente: "Na minha experiência...", "Já vi muitos casos de..."
- Empatia + urgência: o leitor procurou esse artigo porque tem um problema real
- Parágrafos curtos (máximo 4 linhas), frase de impacto no início de cada seção
- Zero emojis no texto corrido. Zero jargão tributário sem explicação imediata.

CONTEXTO TEMPORAL:
- Hoje: 10 de junho de 2025
- IRPF 2026 = declaração entregue em 2026, rendimentos de 01/01/2025 a 31/12/2025 (ano-base 2025)
- PRAZO IRPF 2026: 23 de março a 29 de maio de 2026
- Multa por atraso: mínimo R$ 165,74 ou 1% ao mês (máximo 20%)
- OBRIGATORIEDADE: rendimentos tributáveis acima de R$ 35.584,00 em 2025
- Tabela IRPF 2026: até R$ 2.428,80/mês isento; até R$ 2.826,65: 7,5%; até R$ 3.751,05: 15%; até R$ 4.664,68: 22,5%; acima: 27,5%

ESTRUTURA DO ARTIGO:
1. LEAD — começa com dor/medo/situação real. NUNCA "O IRPF é um imposto..."
2. TL;DR em HTML style (class="tldr-box")
3. Corpo com H2 como perguntas, parágrafos curtos, exemplo numérico, tabela HTML
4. CTA integrado no meio com HTML:
   <div class="cta-inline" style="background:#0A0A0A;color:#F5F5F2;padding:20px 24px;margin:32px 0;border-left:4px solid #C6FF00;"><p style="margin:0 0 12px;font-weight:600;">Ficou com dúvida sobre sua situação específica?</p><p style="margin:0 0 16px;">Nilson Brites atende 100% online para todo o Brasil. Mais de 10 anos declarando IRPF.</p><a href="https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson!%20Li%20o%20artigo%20do%20blog%20e%20preciso%20de%20ajuda" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:12px 24px;font-weight:700;text-decoration:none;">💬 Falar com especialista no WhatsApp</a></div>
5. Key Facts HTML (class="key-facts")
6. 6 FAQs
7. Conclusão com urgência
8. CTA FINAL HTML:
   <div class="cta-final" style="background:#0A0A0A;color:#F5F5F2;padding:32px;margin:48px 0;text-align:center;"><h3 style="color:#C6FF00;margin:0 0 16px;font-size:1.4em;">Precisa de ajuda com sua declaração?</h3><p style="margin:0 0 8px;">Nilson Brites atende 100% online para todo o Brasil.</p><p style="margin:0 0 24px;">Mais de 10 anos de experiência. Novas declarações, atrasadas e retificações.</p><a href="https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson!%20Quero%20declarar%20meu%20IRPF%202026" style="display:inline-block;background:#C6FF00;color:#0A0A0A;padding:16px 32px;font-weight:700;font-size:1.1em;text-decoration:none;">📱 Declarar meu IRPF agora — falar com Nilson</a><p style="margin:16px 0 0;font-size:0.85em;color:#999;">Atendimento rápido · Sem burocracia · Todo o Brasil</p></div>
9. Nota de rodapé disclaimer HTML

PROIBIÇÕES:
- NUNCA "CTA para WhatsApp:" como texto — usar os blocos HTML
- NUNCA abrir com "O IRPF é..."
- NUNCA "Tudo sobre X", "O que você precisa saber"

FORMATO DE SAÍDA (JSON válido, mínimo 800 palavras no content para este teste):
{
  "title": "título max 65 chars",
  "slug": "slug-seo",
  "summary": "150-160 chars com dado numérico",
  "content": "HTML completo com TL;DR, CTAs HTML, Key Facts",
  "tags": ["tag1","tag2","tag3"],
  "keywords": ["kw1","kw2"],
  "faqs": [{"question":"...","answer":"..."}],
  "usedSourceUrls": [],
  "imageQuery": "3-5 palavras em inglês para Unsplash",
  "imageAlt": "descrição da imagem em português",
  "articleSection": "IRPF 2026",
  "isNewsworthy": false
}`;

const userMsg = `Escreva um artigo para o blog da Consultoria IRPF NSB sobre: "${TOPIC}"

Use o formato sorteado: PERGUNTA DIRETA (ex: "Como encontrar um especialista de IRPF confiável?")
Verifique que o lead NÃO começa com definição do IRPF.
Verifique que os blocos HTML de CTA estão presentes (cta-inline e cta-final).
Responda apenas com o JSON válido.`;

const payload = JSON.stringify({
  model: "llama-3.1-8b-instant",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMsg },
  ],
  response_format: { type: "json_object" },
  temperature: 0.75,
  max_tokens: 4096,
});

console.log(`Testando novo blogSystemPrompt com tema: "${TOPIC}"`);
console.log("Chamando Groq llama-3.3-70b-versatile...\n");

const req = https.request(
  {
    hostname: "api.groq.com",
    path: "/openai/v1/chat/completions",
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
    },
  },
  (res) => {
    let body = "";
    res.on("data", (d) => (body += d));
    res.on("end", () => {
      try {
        const api = JSON.parse(body);
        if (api.error) {
          console.log("❌ Erro Groq:", api.error.message);
          return;
        }
        const raw = api.choices?.[0]?.message?.content || "";
        const post = JSON.parse(raw);

        console.log("═══════════════════════════════════════════");
        console.log("TÍTULO:", post.title);
        console.log("═══════════════════════════════════════════");
        console.log("CHARS título:", post.title?.length);
        console.log("\nSUMMARY:", post.summary);
        console.log("CHARS summary:", post.summary?.length);
        console.log("\nTAGS:", JSON.stringify(post.tags));
        console.log("IMAGE QUERY:", post.imageQuery);

        const content = post.content || "";
        console.log("\n─── LEAD (primeiros 600 chars) ───");
        console.log(content.substring(0, 600));

        console.log("\n─── VERIFICAÇÕES ───");
        const lead300 = content.substring(0, 300).toLowerCase();
        const badLead =
          lead300.includes("o irpf é") ||
          lead300.includes("o imposto de renda é") ||
          lead300.includes("o imposto de renda da pessoa física é") ||
          lead300.includes("imposto de renda da pessoa física (irpf) é um tributo");
        console.log("Lead sem definição enciclopédica?", badLead ? "❌ NÃO (lead ruim!)" : "✅ SIM");
        console.log("Tem cta-inline?", content.includes("cta-inline") ? "✅ SIM" : "❌ NÃO");
        console.log("Tem cta-final?", content.includes("cta-final") ? "✅ SIM" : "❌ NÃO");
        console.log("Tem wa.me link?", content.includes("wa.me/5511940825120") ? "✅ SIM" : "❌ NÃO");
        console.log("Tem tldr-box?", content.includes("tldr-box") ? "✅ SIM" : "❌ NÃO");
        console.log("Tem key-facts?", content.includes("key-facts") ? "✅ SIM" : "❌ NÃO");
        console.log("Tem disclaimer?", content.includes("disclaimer") ? "✅ SIM" : "❌ NÃO");
        console.log("Texto 'CTA para WhatsApp' presente?", content.includes("CTA para WhatsApp") ? "❌ SIM (proibido!)" : "✅ NÃO");
        console.log("FAQs count:", post.faqs?.length || 0);
        console.log("Content word count (aprox):", content.split(/\s+/).length);

        console.log("\n─── FAQ 1 ───");
        if (post.faqs?.[0]) {
          console.log("Q:", post.faqs[0].question);
          console.log("A:", post.faqs[0].answer?.substring(0, 200));
        }

        console.log("\n─── TRECHO CTA-INLINE (se presente) ───");
        const ctaIdx = content.indexOf("cta-inline");
        if (ctaIdx >= 0) {
          console.log(content.substring(ctaIdx - 5, ctaIdx + 400));
        }
      } catch (e) {
        console.log("Erro ao parsear resposta:", e.message);
        console.log("Raw:", body.substring(0, 1000));
      }
    });
  }
);

req.on("error", (e) => console.log("Erro de rede:", e.message));
req.setTimeout(60000, () => {
  console.log("Timeout 60s");
  req.destroy();
});
req.write(payload);
req.end();
