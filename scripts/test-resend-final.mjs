import { Resend } from "resend"
import { config } from "dotenv"
config({ path: ".env.local" })

const resend = new Resend(process.env.RESEND_API_KEY)
console.log("Chave presente:", !!process.env.RESEND_API_KEY)
console.log("FROM_EMAIL:", process.env.FROM_EMAIL)

const { data, error } = await resend.emails.send({
  from: process.env.FROM_EMAIL,
  to: "nilson.brites@gmail.com",
  subject: "Teste formulário de contato IRPF NSB",
  html: "<p>Este é um teste. Se chegou, está funcionando.</p>"
})

console.log("Data:", JSON.stringify(data))
console.log("Error:", JSON.stringify(error))
