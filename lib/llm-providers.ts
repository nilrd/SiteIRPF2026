import OpenAI from "openai";

export const gpt4o = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const groqLlama = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export const MODELS = {
  chatbot: "gpt-4o",
  adminIA: "gpt-4o",
  blogGeneration: "llama-3.3-70b-versatile",
} as const;
