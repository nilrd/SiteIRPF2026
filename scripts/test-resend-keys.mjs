import { Resend } from "resend"
import { config } from "dotenv"
config({ path: ".env.local" })

const keys = {
  "NOVA (re_HPQy)": "re_HPQyRPLx_KJv7XoUShTWjfj3Vgdbf2D1Z",
  "ANTIGA (re_R4RY)": "re_R4RYVVep_LNkgHytiu1VMSAjkGABNyfFw",
}

for (const [label, key] of Object.entries(keys)) {
  console.log(`\n--- Testando chave ${label} ---`)
  const resend = new Resend(key)
  
  try {
    const { data, error } = await resend.emails.send({
      from: "IRPF NSB <noreply@irpf.qaplay.com.br>",
      to: "nilson.brites@gmail.com",
      subject: `Teste IRPF - chave ${label}`,
      html: "<p>Teste de envio com domínio verificado.</p>"
    })
    console.log("Data:", JSON.stringify(data))
    console.log("Error:", JSON.stringify(error))
  } catch (err) {
    console.error("Exceção:", err.message?.slice(0, 120))
  }
}
