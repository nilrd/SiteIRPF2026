import { groqLlama, MODELS } from "@/lib/llm-providers";

/**
 * Gera texto alternativo de imagem via Groq (llama-3.1-8b-instant).
 * Máximo 12 palavras, em português, com keyword-chave do post.
 * Retorna o título como fallback em caso de erro.
 */
export async function generateImageAlt(title: string): Promise<string> {
  try {
    const completion = await groqLlama.chat.completions.create({
      model: MODELS.blogVerifier,
      messages: [
        {
          role: "user",
          content:
            `Escreva um texto alt para a imagem de capa deste post de blog sobre IRPF. ` +
            `Máximo 12 palavras, em português, descritivo e com a palavra-chave principal do post. ` +
            `Retorne APENAS o texto, sem aspas, sem pontuação final.\n` +
            `Título: ${title}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 50,
    });

    const alt = (completion.choices?.[0]?.message?.content ?? "").trim();
    // Remove aspas e pontuação final se o modelo as retornar
    const cleaned = alt.replace(/^["']|["']$/g, "").replace(/[.!?]$/, "").trim();
    return cleaned || title;
  } catch {
    return title;
  }
}
