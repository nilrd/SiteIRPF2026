import OpenAI from "openai";

// Cliente OpenAI — desativado temporariamente. Descomente para reativar.
// export const gpt4o = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

export const groqLlama = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export const MODELS = {
  chatbot: "llama-3.3-70b-versatile",
  adminIA: "llama-3.3-70b-versatile",
  blogGeneration: "llama-3.3-70b-versatile",
  blogVerifier: "llama-3.1-8b-instant",  // verificador factual — rápido e gratuito
} as const;
