import { Resend } from "resend"

const keys = {
  "NOVA (re_HPQy)": "re_HPQyRPLx_KJv7XoUShTWjfj3Vgdbf2D1Z",
  "ANTIGA (re_R4RY)": "re_R4RYVVep_LNkgHytiu1VMSAjkGABNyfFw",
}

for (const [label, key] of Object.entries(keys)) {
  console.log(`\n--- ${label} com onboarding@resend.dev ---`)
  const resend = new Resend(key)
  
  try {
    // No plano free, só envia para o email da conta
    const { data, error } = await resend.emails.send({
      from: "IRPF NSB <onboarding@resend.dev>",
      to: "nilson.brites@gmail.com",
      subject: `Teste ${label}`,
      html: "<p>Teste de envio via onboarding@resend.dev.</p>"
    })
    console.log("Data:", JSON.stringify(data))
    console.log("Error:", JSON.stringify(error))
  } catch (err) {
    console.error("Exceção:", err.message?.slice(0, 150))
  }
}
