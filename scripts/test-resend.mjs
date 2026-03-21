import { Resend } from "resend"
import { config } from "dotenv"
config({ path: ".env.local" })

const key = process.env.RESEND_API_KEY
console.log("RESEND_API_KEY presente:", !!key)
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "(não configurada)")

if (!key) {
  console.error("RESEND_API_KEY não encontrada no .env.local")
  process.exit(1)
}

const resend = new Resend(key)

// Teste 1: from com domínio customizado (como está na rota)
console.log("\n--- Teste 1: from = noreply@irpf.qaplay.com.br ---")
try {
  const { data, error } = await resend.emails.send({
    from: "IRPF NSB <noreply@irpf.qaplay.com.br>",
    to: "nilson.brites@gmail.com",
    subject: "Teste contato IRPF NSB (domínio custom)",
    html: "<p>Este é um teste do formulário de contato com domínio customizado.</p>"
  })
  console.log("Data:", JSON.stringify(data))
  console.log("Error:", JSON.stringify(error))
} catch (err) {
  console.error("Exceção:", err.message)
}

// Teste 2: from com onboarding@resend.dev (funciona no plano free)
console.log("\n--- Teste 2: from = onboarding@resend.dev ---")
try {
  const { data, error } = await resend.emails.send({
    from: "IRPF NSB <onboarding@resend.dev>",
    to: "nilson.brites@gmail.com",
    subject: "Teste contato IRPF NSB (resend.dev)",
    html: "<p>Este é um teste do formulário de contato com onboarding@resend.dev.</p>"
  })
  console.log("Data:", JSON.stringify(data))
  console.log("Error:", JSON.stringify(error))
} catch (err) {
  console.error("Exceção:", err.message)
}
