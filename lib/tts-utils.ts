export function cleanTextForTTS(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/R\$\s*([\d.,]+)/g, "$1 reais")
    .replace(/(\d+)%/g, "$1 por cento")
    .replace(/(\d+)\/(\d+)\/(\d{4})/g, "$1 de $2 de $3")
    .replace(/\. /g, ".  ")
    .replace(/: /g, ":  ")
    .replace(/\n\n/g, ".  ")
    .replace(/\n/g, ", ")
    .replace(/\bIRPF\b/g, "I R P F")
    .replace(/\bCPF\b/g, "C P F")
    .replace(/\bCNPJ\b/g, "C N P J")
    .replace(/\bINSS\b/g, "I N S S")
    .replace(/\bFGTS\b/g, "F G T S")
    .replace(/\bRFB\b/g, "Receita Federal")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);
}
