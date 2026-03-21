import { Resend } from "resend"
import { config } from "dotenv"
config({ path: ".env.local" })

const key = process.env.RESEND_API_KEY
if (!key) { console.error("SEM CHAVE"); process.exit(1) }

const resend = new Resend(key)

console.log("Enviando para nsbimports@gmail.com via onboarding@resend.dev...")
const { data, error } = await resend.emails.send({
  from: "IRPF NSB <onboarding@resend.dev>",
  to: "nsbimports@gmail.com",
  subject: "Teste contato IRPF NSB",
  html: "<p>Este é um teste do formulário de contato. Se recebeu, está funcionando!</p>"
})
console.log("Data:", JSON.stringify(data))
console.log("Error:", JSON.stringify(error))
