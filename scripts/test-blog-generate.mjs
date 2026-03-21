// Script de teste para geração de post com o novo blogSystemPrompt
// Uso: node scripts/test-blog-generate.mjs

import https from "https";

const topic = "Quero Declarar meu IRPF: Como Encontro Ajuda?";
const url = "https://irpf.qaplay.com.br/api/admin/blog/generate";
const data = JSON.stringify({ topic });

console.log(`Gerando post sobre: "${topic}"`);
console.log("Aguardando resposta do Vercel (pode levar 60-90s)...\n");

const req = https.request(
  url,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data),
    },
  },
  (res) => {
    let body = "";
    res.on("data", (d) => (body += d));
    res.on("end", () => {
      console.log("Status HTTP:", res.statusCode);
      try {
        const json = JSON.parse(body);

        if (json.post) {
          const p = json.post;
          console.log("\n═══════════════════════════════════════════");
          console.log("TÍTULO:", p.title);
          console.log("═══════════════════════════════════════════");
          console.log("\nSUMMARY:", p.summary);
          console.log("\nSECTION:", p.articleSection);
          console.log("TAGS:", JSON.stringify(p.tags));
          console.log("KEYWORDS:", JSON.stringify(p.keywords));
          console.log("\n─── LEAD (primeiros 1200 chars do content) ───");
          console.log((p.content || "").substring(0, 1200));
          console.log("\n─── TEM cta-inline? ───");
          console.log(p.content?.includes('cta-inline') ? "✅ SIM" : "❌ NÃO");
          console.log("─── TEM cta-final? ───");
          console.log(p.content?.includes('cta-final') ? "✅ SIM" : "❌ NÃO");
          console.log("─── COMEÇA com definição? ───");
          const lead200 = (p.content || "").substring(0, 200).toLowerCase();
          const badLead = lead200.includes("o irpf é") || lead200.includes("o imposto de renda é") || lead200.includes("o imposto de renda da pessoa física é");
          console.log(badLead ? "❌ SIM — LEAD RUIM!" : "✅ NÃO — lead ok");
          console.log("\n─── FAQs (primeiras 2) ───");
          (p.faqs || []).slice(0, 2).forEach((f, i) => {
            console.log(`\nFAQ ${i + 1}: ${f.question}`);
            console.log(`Resp: ${f.answer?.substring(0, 120)}...`);
          });
        } else if (json.error) {
          console.log("\n❌ ERRO:", json.error);
          if (json.details) console.log("Detalhes:", json.details);
          if (json.raw) console.log("Raw:", json.raw?.substring(0, 500));
        } else {
          console.log("\nResposta inesperada:", body.substring(0, 2000));
        }
      } catch (e) {
        console.log("Erro ao parsear JSON:", e.message);
        console.log("Body raw:", body.substring(0, 2000));
      }
    });
  }
);

req.on("error", (e) => console.log("Erro de rede:", e.message));
req.setTimeout(120000, () => {
  console.log("Timeout de 120s atingido");
  req.destroy();
});
req.write(data);
req.end();
