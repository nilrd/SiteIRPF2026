"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WA_DEFAULT_URL = "https://wa.me/5511940825120?text=Ol%C3%A1%2C+quero+ajuda+com+meu+IRPF.";

/** Detecta URL do WhatsApp na mensagem (link markdown ou mencao textual) */
function detectWAUrl(content: string): string | null {
  const mdMatch = content.match(/\[([^\]]+)\]\((https:\/\/wa\.me\/[^)]+)\)/);
  if (mdMatch) return mdMatch[2];
  if (/\bwhatsapp\b|fale conosco pelo whatsapp/i.test(content)) return WA_DEFAULT_URL;
  return null;
}

/** Remove linha de link markdown do WhatsApp para exibicao limpa */
function cleanBotContent(content: string): string {
  return content
    .replace(/\[[^\]]+\]\(https:\/\/wa\.me\/[^)]+\)\n?/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ---- Audio helpers ----

/** Remove markdown e normaliza texto para leitura natural em voz */
function cleanForTTS(text: string): string {
  const cleaned = text
    // Remove headers markdown
    .replace(/^#{1,6}\s+/gm, "")
    // Remove negrito e italico
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    .replace(/_{1,2}([^_]+)_{1,2}/g, "$1")
    // Remove backticks inline
    .replace(/`([^`]+)`/g, "$1")
    // Remove blocos de codigo
    .replace(/```[\s\S]*?```/g, "")
    // Converte R$ para leitura natural
    .replace(/R\$\s?([\d.,]+)/g, (_, v) => `${v.replace(/\./g, "").replace(",", " reais e ")} reais`)
    // Converte % para leitura
    .replace(/(\d+)%/g, "$1 por cento")
    // Remove bullets e hifens de lista
    .replace(/^[-*•]\s+/gm, "")
    // Remove numeracao de listas
    .replace(/^\d+\.\s+/gm, "")
    // Remove links markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Espaceja siglas comuns para pronuncia correta
    .replace(/\bIRPF\b/g, "I R P F")
    .replace(/\bCPF\b/g, "C P F")
    .replace(/\bCNPJ\b/g, "C N P J")
    // Remove multiplos espacos/linhas em branco
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
  // Limita a 900 chars para nao exceder o limite do endpoint (evita erro 400)
  if (cleaned.length > 900) {
    const truncated = cleaned.slice(0, 900);
    const lastDot = truncated.lastIndexOf(". ");
    return lastDot > 400 ? truncated.slice(0, lastDot + 1) : truncated;
  }
  return cleaned;
}

async function transcribeAudio(blob: Blob): Promise<string> {
  const form = new FormData();
  form.append("audio", blob, "recording.webm");
  const res = await fetch("/api/chatbot/transcribe", { method: "POST", body: form });
  if (!res.ok) return "";
  const data = await res.json();
  return data.text ?? "";
}

async function speakText(
  text: string,
  audioEl: HTMLAudioElement,
  onBlocked?: (url: string) => void
) {
  const cleaned = cleanForTTS(text);
  if (!cleaned) return;
  const res = await fetch("/api/chatbot/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: cleaned }),
  });
  if (!res.ok) return;
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  audioEl.src = url;
  try {
    await audioEl.play();
  } catch {
    // Autoplay bloqueado pelo navegador — exibe botao de play manual
    onBlocked?.(url);
  }
}

const QUICK_QUESTIONS = [
  "Sou obrigado a declarar?",
  "Tenho IR atrasado, e agora?",
  "Quanto custa a declaracao?",
  "Como funciona o servico?",
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true); // voz ativa por padrão
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const pendingAudioUrlRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const voiceInputRef = useRef(false); // input veio do microfone

  // init audio element once
  useEffect(() => {
    audioElRef.current = new Audio();
    audioElRef.current.onplay = () => setIsSpeaking(true);
    audioElRef.current.onended = () => setIsSpeaking(false);
    audioElRef.current.onerror = () => setIsSpeaking(false);
    return () => {
      audioElRef.current?.pause();
      mediaRecorderRef.current?.stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startRecording = useCallback(async () => {
    if (isLoading || isTranscribing) return;
    // Desbloqueia autoplay via gesto do usuario (deve ser sincrono, antes de qualquer await)
    if (audioElRef.current && audioEnabled) {
      const el = audioElRef.current;
      el.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
      el.volume = 0;
      void el.play().catch(() => {});
      el.volume = 1;
    }
    setAudioBlocked(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setIsTranscribing(true);
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const text = await transcribeAudio(blob);
        setIsTranscribing(false);
        if (text) {
          voiceInputRef.current = true; // marcar que veio do microfone
          sendMessage(text);
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      alert("Permita o acesso ao microfone nas configuracoes do navegador.");
    }
  }, [isLoading, isTranscribing, audioEnabled]); // sendMessage added below via ref trick

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Ola! Sou o Bot Nilson, assistente da Consultoria IRPF NSB. Aqui voce tira duvidas sobre Imposto de Renda com quem entende do assunto.\n\nDiga qual a sua situacao e vejo como posso te ajudar. Pode ser por texto ou voz, como preferir!",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const userMessage = (text || input).trim();
      if (!userMessage || isLoading || isRecording || isTranscribing) return;

      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
      setIsLoading(true);

      try {
        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...messages,
              { role: "user", content: userMessage },
            ],
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: err.error || "Desculpe, ocorreu um erro. Tente novamente.",
            },
          ]);
          setIsLoading(false);
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let assistantContent = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantContent += parsed.content;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: assistantContent,
                    };
                    return updated;
                  });
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        }
        // Auto-speak: sempre se veio do microfone, ou se audioEnabled estiver ativo
        const shouldSpeak = voiceInputRef.current || audioEnabled;
        voiceInputRef.current = false; // reset para próxima mensagem
        if (shouldSpeak && assistantContent && audioElRef.current) {
          setAudioBlocked(false);
          speakText(assistantContent, audioElRef.current, (url) => {
            pendingAudioUrlRef.current = url;
            setAudioBlocked(true);
          });
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Desculpe, houve um erro de conexao. Tente novamente.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [input, isLoading, isRecording, isTranscribing, messages, audioEnabled]
  );

  // fix: make startRecording see sendMessage via ref
  useEffect(() => {
    // no-op — startRecording uses sendMessage via closure; audioEnabled captured above
  }, [sendMessage]);

  const handleSpeakMessage = useCallback(
    (content: string) => {
      if (!audioElRef.current) return;
      audioElRef.current.pause();
      setAudioBlocked(false);
      speakText(content, audioElRef.current, (url) => {
        pendingAudioUrlRef.current = url;
        setAudioBlocked(true);
      });
    },
    []
  );

  return (
    <>
      {/* Trigger Button - Bottom LEFT */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-[#1A1A1A] text-white px-5 py-3.5 shadow-2xl hover:bg-[#333] transition-colors group"
          >
            <span className="relative flex h-8 w-8 items-center justify-center flex-shrink-0">
              <Image
                src="/Eu_Avatar.png"
                alt="Bot Nilson"
                width={32}
                height={32}
                className="rounded-full object-cover w-8 h-8"
              />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            </span>
            <span className="flex flex-col items-start">
              <span className="text-xs font-semibold tracking-wide">
                Tire duvidas sobre IR
              </span>
              <span className="text-[10px] text-green-400">Online</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-6 z-50 w-[384px] h-[530px] bg-white flex flex-col shadow-2xl border border-gray-100 max-[420px]:w-[calc(100vw-24px)] max-[420px]:h-[calc(100vh-80px)] max-[420px]:left-3 max-[420px]:bottom-3"
          >
            {/* Header */}
            <div className="bg-[#1A1A1A] text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <Image
                  src="/Eu_Avatar.png"
                  alt="Bot Nilson"
                  width={36}
                  height={36}
                  className="rounded-full object-cover w-9 h-9 flex-shrink-0"
                />
                <div>
                  <div className="text-sm font-semibold">Bot Nilson</div>
                  <div className="text-[10px] text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    Assistente Virtual · NSB
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Toggle audio automático */}
                <button
                  onClick={() => {
                    if (audioEnabled && audioElRef.current) audioElRef.current.pause();
                    setAudioEnabled((v) => !v);
                  }}
                  title={audioEnabled ? "Desativar voz" : "Ativar voz"}
                  className={`p-1 transition ${
                    audioEnabled ? "text-[#C6FF00]" : "text-white/40 hover:text-white"
                  }`}
                >
                  {audioEnabled ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white transition p-1"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAF8]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] group relative ${
                    msg.role === "user" ? "" : "flex items-end gap-1"
                  }`}>
                    <div
                      className={`px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#1A1A1A] text-white"
                          : "bg-white border border-gray-100 text-[#1A1A1A]"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <>
                          <p className="whitespace-pre-wrap m-0">{cleanBotContent(msg.content)}</p>
                          {detectWAUrl(msg.content) && (
                            <a
                              href={detectWAUrl(msg.content)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ead59] text-white text-xs font-bold py-2.5 px-3 transition"
                            >
                              Fale conosco pelo WhatsApp
                            </a>
                          )}
                        </>
                      ) : (
                        <span className="whitespace-pre-wrap">{msg.content}</span>
                      )}
                    </div>
                    {/* Speaker button on bot messages */}
                    {msg.role === "assistant" && msg.content && (
                      <button
                        onClick={() => handleSpeakMessage(msg.content)}
                        title="Ouvir"
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-[#1A1A1A] p-1"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isLoading &&
                messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 px-4 py-3 flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}

              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs bg-white border border-[#C9A84C] text-[#1A1A1A] px-3 py-1.5 hover:bg-[#C9A84C] hover:text-white transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 bg-white flex-shrink-0">
              {/* Recording indicator */}
              {(isRecording || isTranscribing) && (
                <div className="flex items-center gap-2 px-4 py-2 text-xs text-red-500 border-b border-gray-100">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {isTranscribing ? "Transcrevendo..." : "Gravando... clique no mic para parar"}
                </div>
              )}
              {isSpeaking && (
                <div className="flex items-center gap-2 px-4 py-2 text-xs text-[#2D4033] border-b border-gray-100">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Reproduzindo resposta...
                </div>
              )}
              {audioBlocked && !isSpeaking && (
                <button
                  onClick={() => {
                    if (pendingAudioUrlRef.current && audioElRef.current) {
                      audioElRef.current.src = pendingAudioUrlRef.current;
                      audioElRef.current.play()
                        .then(() => setAudioBlocked(false))
                        .catch(() => {});
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#C9A84C] border-b border-amber-100 bg-amber-50 hover:bg-amber-100 transition w-full"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Toque para ouvir a resposta em voz
                </button>
              )}
              <div className="flex items-center gap-2 px-4 py-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={isTranscribing ? "Transcrevendo..." : input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Digite ou fale sua duvida..."
                  className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
                  disabled={isLoading || isRecording || isTranscribing}
                />
                {/* Mic button */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading || isTranscribing}
                  title={isRecording ? "Parar gravacao" : "Gravar pergunta"}
                  className={`p-2 transition disabled:opacity-40 ${
                    isRecording
                      ? "text-red-500 animate-pulse"
                      : "text-gray-400 hover:text-[#1A1A1A]"
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </button>
                {/* Send button */}
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || isRecording || isTranscribing || !input.trim()}
                  className="bg-[#1A1A1A] text-white p-2 hover:bg-[#2D4033] transition disabled:opacity-40"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
