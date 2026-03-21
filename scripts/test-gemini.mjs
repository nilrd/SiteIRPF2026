import { GoogleGenerativeAI } from "@google/generative-ai"
import { config } from "dotenv"
config({ path: ".env.local" })

const key = process.env.GEMINI_API_KEY
console.log("Chave presente:", !!key)
console.log("Primeiros chars:", key?.substring(0, 8))

if (!key) { console.error("SEM CHAVE"); process.exit(1) }

const genAI = new GoogleGenerativeAI(key)

const nomes = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest"
]

for (const nome of nomes) {
  try {
    const model = genAI.getGenerativeModel({ model: nome })
    const result = await model.generateContent(
      "Diga apenas: funcionou"
    )
    console.log(`SUCESSO com ${nome}:`, result.response.text())
    break
  } catch (err) {
    console.log(`FALHOU ${nome}:`, err.message.slice(0, 120))
  }
}
