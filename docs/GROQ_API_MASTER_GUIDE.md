# GROQ API MASTER GUIDE - IRPF NSB

Data: 2026-03-09 (atualizado: 2026-03-09 v2 — 100% Groq)
Escopo: guia tecnico COMPLETO da API Groq para o projeto IRPF NSB. Cobre todos os endpoints, modelos, precos, recursos e estrategias de uso.
Fonte: documentacao oficial https://console.groq.com/docs e https://console.groq.com/docs/api-reference

## 1) Estado atual do projeto (ATUALIZADO — 100% Groq)

Apos migracao concluida em 2026-03-09, todos os servicos usam Groq:

| Servico                     | Antes        | Agora                         |
|-----------------------------|--------------|-------------------------------|
| Chatbot publico (chat)      | gpt-4o       | llama-3.3-70b-versatile       |
| Admin IA (chat)             | gpt-4o       | llama-3.3-70b-versatile       |
| Blog IA (geracao)           | llama-3.3-70b | llama-3.3-70b-versatile (sem mudanca) |
| STT (transcricao de audio)  | whisper-1 (OpenAI) | whisper-large-v3-turbo   |
| TTS (voz do chatbot)        | tts-1 (OpenAI)     | playai-tts / Fritz-PlayAI |

Arquivos alterados:
- `lib/llm-providers.ts`: gpt4o comentado, todos os MODELS apontam para Groq
- `app/api/chatbot/route.ts`: gpt4o -> groqLlama
- `app/api/chatbot/speak/route.ts`: tts-1+onyx -> playai-tts+Fritz-PlayAI
- `app/api/chatbot/transcribe/route.ts`: whisper-1 -> whisper-large-v3-turbo
- `app/api/admin/chat/route.ts`: gpt4o -> groqLlama

Chave OpenAI comentada (`OPENAI_API_KEY`): pode ser reativada removendo comentario em `lib/llm-providers.ts`.

---

## 2) Base URL e autenticacao

```
Base URL: https://api.groq.com/openai/v1
Auth: Authorization: Bearer $GROQ_API_KEY
```

Configuracao em TypeScript (padrao do projeto):

```ts
import OpenAI from "openai";

export const groqLlama = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});
```

---

## 3) Endpoints — lista completa

### Chat
- `POST /chat/completions` — chat com streaming, tool use, structured outputs
- `POST /responses` (beta) — interface nova, similar ao Responses API da OpenAI

### Audio
- `POST /audio/transcriptions` — STT (speech-to-text)
- `POST /audio/translations` — traducao de audio para ingles
- `POST /audio/speech` — TTS (text-to-speech)

### Models
- `GET /models` — lista todos os modelos ativos
- `GET /models/{model_id}` — detalhes de um modelo especifico

### Batch (processamento assincrono com 50% desconto)
- `POST /batches` — cria um batch
- `GET /batches` — lista batches
- `GET /batches/{batch_id}` — recupera batch
- `POST /batches/{batch_id}/cancel` — cancela batch

### Files (usado junto com Batch)
- `POST /files` — upload de arquivo JSONL (`purpose: "batch"`)
- `GET /files` — lista arquivos
- `GET /files/{file_id}` — info do arquivo
- `GET /files/{file_id}/content` — download do conteudo
- `DELETE /files/{file_id}` — deleta arquivo

### Fine-Tuning (closed beta)
- `GET /v1/fine_tunings` — lista fine-tunings
- `POST /v1/fine_tunings` — cria fine-tuning (LoRA)
- `GET /v1/fine_tunings/{id}` — detalha fine-tuning
- `DELETE /v1/fine_tunings/{id}` — deleta fine-tuning

---

## 4) Modelos de producao (recomendados para producao)

| ID                            | Velocidade | Preco (por 1M tokens)         | Contexto | Max Output |
|-------------------------------|-----------|-------------------------------|----------|------------|
| `llama-3.1-8b-instant`        | 560 tps   | $0.05 input / $0.08 output    | 131k     | 131k       |
| `llama-3.3-70b-versatile`     | 280 tps   | $0.59 input / $0.79 output    | 131k     | 32k        |
| `openai/gpt-oss-120b`         | 500 tps   | $0.15 input / $0.60 output    | 131k     | 65k        |
| `openai/gpt-oss-20b`          | 1000 tps  | $0.075 input / $0.30 output   | 131k     | 65k        |
| `whisper-large-v3`            | —         | $0.111 / hora audio           | —        | —          |
| `whisper-large-v3-turbo`      | —         | $0.04 / hora audio            | —        | —          |

### Sistemas agentivos de producao (Compound)

| ID                   | Velocidade | Contexto | Max Output |
|----------------------|-----------|----------|------------|
| `groq/compound`      | ~450 tps  | 131k     | 8k         |
| `groq/compound-mini` | ~450 tps  | 131k     | 8k         |

---

## 5) Modelos preview (nao usar em producao — podem ser descontinuados)

| ID                                      | Preco                       | Contexto |
|-----------------------------------------|-----------------------------|----------|
| `canopylabs/orpheus-v1-english`         | $22 / 1M chars (TTS)        | 4k input |
| `canopylabs/orpheus-arabic-saudi`       | $40 / 1M chars (TTS)        | 4k input |
| `meta-llama/llama-4-scout-17b-16e-instruct` | $0.11 input / $0.34 output | 131k   |
| `moonshotai/kimi-k2-instruct-0905`      | $1.00 input / $3.00 output  | 262k     |
| `qwen/qwen3-32b`                        | $0.29 input / $0.59 output  | 131k     |
| `openai/gpt-oss-safeguard-20b`          | $0.075 input / $0.30 output | 131k     |
| `meta-llama/llama-prompt-guard-2-22m`   | $0.03 / 1M tokens           | 512      |
| `meta-llama/llama-prompt-guard-2-86m`   | $0.04 / 1M tokens           | 512      |

---

## 6) Chat Completions — parametros completos

`POST /openai/v1/chat/completions`

### Parametros obrigatorios
- `model`: string — ID do modelo
- `messages`: array — lista de mensagens

### Parametros opcionais relevantes
- `temperature`: 0-2 (default 1)
- `max_completion_tokens`: limite de tokens gerados
- `top_p`: 0-1 (default 1)
- `stream`: boolean — streaming via SSE
- `stream_options`: ex.: `{ include_usage: true }`
- `stop`: string ou array (ate 4 sequencias)
- `seed`: integer — para resultados reprodutiveis
- `response_format`: `{ type: "text" }` | `{ type: "json_object" }` | `{ type: "json_schema", json_schema: {...} }`
- `tools`: array — definicoes de tools para function calling
- `tool_choice`: `"auto"` | `"none"` | `"required"` | objeto especifico
- `parallel_tool_calls`: boolean (default true)
- `service_tier`: `"on_demand"` | `"flex"` | `"performance"` | `"auto"` | null
- `reasoning_format`: `"parsed"` | `"raw"` | `"hidden"` (modelos reasoning)
- `include_reasoning`: boolean (GPT-OSS models)
- `reasoning_effort`: `"none"` | `"default"` | `"low"` | `"medium"` | `"high"`
- `citation_options`: `"enabled"` | `"disabled"`
- `compound_custom`: objeto para configurar Compound systems
- `documents`: array de documentos de contexto
- `search_settings`: objeto com `include_domains`, `exclude_domains`
- `disable_tool_validation`: boolean (default false)
- `user`: string — identificador do usuario final

### Campos NAO suportados (retornam 400)
- `n` > 1 (so aceita `n=1`)
- `logprobs`, `logit_bias`, `top_logprobs`, `frequency_penalty`, `presence_penalty` (nao suportados na maioria dos modelos)
- `metadata`, `store` (nao suportados atualmente)

### Objeto de resposta
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1730241104,
  "model": "llama-3.3-70b-versatile",
  "choices": [{
    "index": 0,
    "message": { "role": "assistant", "content": "..." },
    "logprobs": null,
    "finish_reason": "stop"
  }],
  "usage": {
    "queue_time": 0.037,
    "prompt_tokens": 18,
    "prompt_time": 0.001,
    "completion_tokens": 556,
    "completion_time": 0.463,
    "total_tokens": 574,
    "total_time": 0.464
  },
  "system_fingerprint": "fp_...",
  "service_tier": "on_demand",
  "x_groq": { "id": "req_..." }
}
```

---

## 7) Responses API (beta)

`POST /openai/v1/responses`

Interface mais nova, suporta:
- `input`: string ou array
- `model`, `instructions` (system), `tools`, `temperature`, `top_p`
- `stream`, `store` (apenas false/null), `service_tier`
- `reasoning`: objeto para modelos de raciocinio
- `truncation`: `"auto"` | `"disabled"`
- `text`: configuracao de formato de saida

**Limitacoes em relacao ao OpenAI**: `previous_response_id` sempre null, sem suporte a `include`, `prompt`.

---

## 8) Audio — Speech to Text (STT)

`POST /openai/v1/audio/transcriptions`
`POST /openai/v1/audio/translations`

### Modelos disponiveis
| Modelo                    | Preco        | Limite de arquivo |
|---------------------------|-------------|-------------------|
| `whisper-large-v3`        | $0.111/hora | 100 MB (dev)      |
| `whisper-large-v3-turbo`  | $0.04/hora  | sem limite especificado |

### Parametros (transcricao)
- `model` (obrigatorio): `"whisper-large-v3"` ou `"whisper-large-v3-turbo"`
- `file` (obrigatorio se nao usar url): audio em flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm
- `url`: URL do audio (obrigatorio em Batch API, opcional em sincrono)
- `language`: ISO-639-1 — ex.: `"pt"` para portugues (melhora precisao e latencia)
- `prompt`: texto opcional para guiar o modelo (mesmo idioma do audio)
- `response_format`: `"json"` (default) | `"text"` | `"verbose_json"`
- `temperature`: 0-1 (default 0)
- `timestamp_granularities[]`: `"word"` | `"segment"` (requer `verbose_json`)

### Resposta
```json
{ "text": "Texto transcrito..." }
```

### Uso atual no projeto (transcribe route)
```ts
const transcription = await groqLlama.audio.transcriptions.create({
  file: audio,
  model: "whisper-large-v3-turbo",
  language: "pt",
});
```

---

## 9) Audio — Text to Speech (TTS)

`POST /openai/v1/audio/speech`

### Modelos e vozes disponiveis

**PlayAI TTS** (modelo no API Reference):
- Modelo: `playai-tts` (ingles, multilingual)
- Vozes: `Fritz-PlayAI`, `Atlas-PlayAI`, `Angelo-PlayAI`, `Arista-PlayAI`, `Basil-PlayAI`,
  `Briggs-PlayAI`, `Calum-PlayAI`, `Celeste-PlayAI`, `Cheyenne-PlayAI`, `Chip-PlayAI`,
  `Cillian-PlayAI`, `Cole-PlayAI`, `Corey-PlayAI`, `Davis-PlayAI`, `Douglas-PlayAI`,
  `Deedee-PlayAI`, `Eleanor-PlayAI`, `Elize-PlayAI`, `Eli-PlayAI`, `Elliot-PlayAI`

**Orpheus TTS** (modelos preview — mais expressivos, com vocal directions):
- Modelo: `canopylabs/orpheus-v1-english` — $22/1M chars
  - Vozes: `tara`, `leah`, `leo`, `dan`, `mia`, `zac`, `zoe`, `julia`, `troy`
  - Suporte a vocal directions (ex.: `[cheerful]`, `[excited]`)
- Modelo: `canopylabs/orpheus-arabic-saudi` — $40/1M chars

### Parametros
- `model` (obrigatorio): ID do modelo
- `input` (obrigatorio): texto a sintetizar
- `voice` (obrigatorio): nome da voz
- `response_format`: `"mp3"` (default) | `"flac"` | `"mulaw"` | `"ogg"` | `"wav"`
- `sample_rate`: 8000 | 16000 | 22050 | 24000 | 32000 | 44100 | 48000 (default)
- `speed`: 0.5-5 (default 1)

### Uso atual no projeto (speak route)
```ts
const mp3 = await groqLlama.audio.speech.create({
  model: "playai-tts",
  voice: "Fritz-PlayAI",
  input: text.trim(),
  speed: 1.05,
});
```

### Diferenca PlayAI vs Orpheus
| Aspecto           | playai-tts       | canopylabs/orpheus-v1-english |
|-------------------|-----------------|-------------------------------|
| Status            | Producao         | Preview                       |
| Idiomas           | Multilingual     | Ingles (expresivo)            |
| Vocal directions  | Nao              | Sim ([cheerful], [sad], etc.) |
| Preco             | Nao divulgado    | $22/1M chars                  |

---

## 10) Tool Use — 3 modos

### Modo 1: Groq Built-In Tools (zero orchestration)
- Modelo executa e gerencia o loop internamente
- 1 unica chamada de API retorna resposta final
- Suportado por: `groq/compound`, `groq/compound-mini`, `openai/gpt-oss-120b`, `openai/gpt-oss-20b`

Tools disponiveis:

| Tool              | Groq Compound | GPT-OSS |
|-------------------|---------------|---------|
| web_search        | ✅            | ❌ (browser_search) |
| code_interpreter  | ✅            | ✅      |
| visit_website     | ✅            | ❌      |
| browser_automation| ✅            | ❌      |
| wolfram_alpha     | ✅            | ❌      |

```ts
// Exemplo com Compound
const res = await groqLlama.chat.completions.create({
  model: "groq/compound",
  messages: [{ role: "user", content: "Qual a Selic atual?" }],
  // compound_custom opcional:
  compound_custom: {
    tools: { enabled_tools: ["web_search"] }
  }
});
```

### Modo 2: Remote MCP (Model Context Protocol)
- Groq conecta em servidor MCP externo e gerencia o loop
- Ideal para integracoes padronizadas (GitHub, Google Drive, etc.)
- Configurar via `mcp_servers` no request

### Modo 3: Local Tool Calling (function calling manual)
- App gerencia o loop (multiplas chamadas)
- Definir `tools` array com JSON Schema de cada funcao
- Modelo retorna `tool_calls`; app executa; retorna resultado; modelo responde

Suporte por modelo:

| Modelo                          | Tool Use | Parallel | JSON Mode | Structured Output |
|---------------------------------|----------|----------|-----------|-------------------|
| `moonshotai/kimi-k2-instruct-0905` | ✅    | ✅       | ✅        | ❌                |
| `openai/gpt-oss-20b`            | ✅       | ❌       | ✅        | ✅                |
| `openai/gpt-oss-120b`           | ✅       | ❌       | ✅        | ✅                |
| `qwen/qwen3-32b`                | ✅       | ✅       | ✅        | ❌                |
| `llama-3.3-70b-versatile`       | ✅       | ✅       | ✅        | ❌                |
| `llama-3.1-8b-instant`          | ✅       | ✅       | ✅        | ❌                |

---

## 11) Structured Outputs

`response_format` de 3 formas:

```ts
// 1. JSON Object Mode (valido sintaticamente mas sem schema)
response_format: { type: "json_object" }

// 2. JSON Schema best-effort (strict: false — padrao)
response_format: {
  type: "json_schema",
  json_schema: { name: "my_schema", strict: false, schema: {...} }
}

// 3. JSON Schema strict (garantia absoluta de aderencia ao schema)
// Apenas em: openai/gpt-oss-20b e openai/gpt-oss-120b
response_format: {
  type: "json_schema",
  json_schema: { name: "my_schema", strict: true, schema: {...} }
}
```

Modo strict exige:
- Todos os campos presentes em `required`
- `additionalProperties: false` em todos os objetos
- Campos opcionais como `{ type: ["string", "null"] }` com `null` na lista de required

**Nota**: Structured Outputs nao funciona com `stream: true` ou tool use.

---

## 12) Reasoning models

Modelos com raciocinio explicito:

| Modelo                         | reasoning_format suportado | reasoning_effort |
|--------------------------------|---------------------------|-----------------|
| `openai/gpt-oss-20b`           | Sem parametro (inclui em `reasoning` field) | low/medium/high |
| `openai/gpt-oss-120b`          | Similar ao gpt-oss-20b    | low/medium/high |
| `openai/gpt-oss-safeguard-20b` | Sim                        | —               |
| `qwen/qwen3-32b`               | raw/parsed/hidden          | none/default    |

Configuracoes recomendadas para reasoning:
- `temperature`: 0.5-0.7 (0.6 ideal)
- `max_completion_tokens`: 1024+ para problemas complexos
- `top_p`: 0.95
- Para GPT-OSS: incluir instrucoes no user message (nao no system)
- Para Qwen3: usar `reasoning_format: "hidden"` com tool use e JSON mode

---

## 13) Prompt Caching

- Automatico, sem configuracao adicional
- 50% de desconto em cache hits nos tokens de input
- TTL: ~2 horas de inatividade
- Requer prefixo identico (mesmo system prompt, few-shots)
- Tokens em cache NAO contam para rate limits de TPM
- Nao acumula com desconto de Batch API

Estrategia:
- System prompt estatico no inicio (regras, contexto fixo)
- Documentos de conhecimento depois
- Dados dinamicos (input do usuario) no final

---

## 14) Batch API (50% desconto)

Ideal para geracao de blog em volume.

Fluxo:
1. Upload arquivo JSONL: `POST /files` com `purpose: "batch"`
2. Criar batch: `POST /batches` com `input_file_id` e `completion_window`
3. Aguardar: poll em `GET /batches/{id}` ate `status: "completed"`
4. Download resultado: `GET /files/{output_file_id}/content`

Parametros:
- `completion_window`: `"24h"` ate `"7d"` (duracoes suportadas)
- `endpoint`: so suporta `"/v1/chat/completions"` atualmente
- Arquivo: `.jsonl`, ate 100 MB

Status possiveis: `validating`, `in_progress`, `finalizing`, `completed`, `failed`, `expired`, `cancelling`, `cancelled`

**Importante**: desconto de batch NAO acumula com prompt caching.

---

## 15) Service Tiers

Passado no parametro `service_tier` do request:

| Tier         | Descricao                                         | Quando usar                          |
|--------------|--------------------------------------------------|--------------------------------------|
| `on_demand`  | Padrao. Rate limits normais.                     | Producao geral                       |
| `flex`       | Melhor esforco, pode falhar (erro 498). Rate limits 10x maiores. | Volume alto, tolerancia a falhas     |
| `performance`| Enterprise. Menor latencia, maior previsibilidade. | Critico de producao contratado      |
| `auto`       | Escolhe melhor tier disponivel automaticamente.  | Balancear custo e disponibilidade    |

Erros de Flex: `498 capacity_exceeded` — aplicar backoff e retry.

---

## 16) Rate Limits

Tipos de limite:
- RPM — requests por minuto
- TPM — tokens por minuto (nao conta tokens em cache)
- ASH — audio segundos por hora (STT)
- ASD — audio segundos por dia (STT)

Exemplos por modelo (on_demand):
| Modelo                    | TPM    | RPM  |
|---------------------------|--------|------|
| `llama-3.1-8b-instant`    | 560k   | 1k   |
| `llama-3.3-70b-versatile` | 300k   | 1k   |
| `openai/gpt-oss-120b`     | 250k   | 1k   |
| `whisper-large-v3`        | 200k audio-seconds/hora | 300 |
| `whisper-large-v3-turbo`  | 400k audio-seconds/hora | 400 |
| `groq/compound`           | 200k   | 200  |

Headers de resposta:
- `x-ratelimit-limit-requests`
- `x-ratelimit-limit-tokens`
- `x-ratelimit-remaining-requests`
- `x-ratelimit-remaining-tokens`
- `x-ratelimit-reset-requests`
- `x-ratelimit-reset-tokens`
- `retry-after` (em caso de 429)

---

## 17) Erros e codigos

| Codigo | Nome                  | Acao                                              |
|-------|-----------------------|---------------------------------------------------|
| 400   | Bad Request           | Revisar payload. Nao tentar novamente sem correcao. |
| 401   | Unauthorized          | Verificar GROQ_API_KEY                            |
| 403   | Forbidden             | Permissao negada para o recurso/modelo            |
| 404   | Not Found             | Verificar endpoint e model ID                    |
| 413   | Request Too Large     | Reduzir mensagens ou conteudo                     |
| 422   | Unprocessable Entity  | Schema invalido ou parametros incorretos          |
| 424   | Failed Dependency     | Dependencia externa falhou                        |
| 429   | Rate Limit Exceeded   | Backoff exponencial com jitter; respeitar `retry-after` |
| 498   | Capacity Exceeded     | Tier flex sem capacidade; retry ou usar on_demand |
| 499   | Cancelled             | Request cancelado pelo cliente                    |
| 503   | Service Unavailable   | Retry com backoff                                 |

Rastreabilidade: logar `response.x_groq.id` e `response.id` para suporte.

---

## 18) Privacidade e dados (LGPD)

- Por padrao, Groq NAO retEM dados de inference de customers
- Retencao pode ocorrer para: batch, fine-tuning, retencao para confiabilidade (ate 30 dias)
- Zero Data Retention (ZDR) disponivel com trade-offs de performance
- Configurar em Data Controls no console: https://console.groq.com/settings/data-controls

Praticas para IRPF NSB (LGPD):
- NUNCA incluir CPF, RG, ou dados sensiveis do cliente nos prompts
- Pseudonimizar: usar `lead_id` interno, nunca nome completo + dados fiscais juntos
- Mensagens do chatbot NAO incluem dados PII do lead (numero do whatsapp, CPF)

---

## 19) Compatibilidade com OpenAI SDK

A Groq e compativel com a biblioteca OpenAI (`openai` npm/pip). Apenas alterar `baseURL` e `apiKey`.

Features OpenAI sem suporte na Groq:
- `n > 1` (so aceita n=1)
- `logprobs`, `logit_bias`, `top_logprobs` (nao suportados na maioria dos modelos)
- `frequency_penalty`, `presence_penalty` (nao suportados)
- `metadata`, `store` (nao suportados em chat completions)
- Em Responses API: `previous_response_id`, `truncation: "auto"` com limitacoes, `include`, `prompt`
- Fine-tuning (diferente: endpoint `/v1/fine_tunings` e apenas LoRA)

---

## 20) Arquitetura atual do projeto IRPF NSB

### Todos os servicos agora em Groq

```
Usuario/Lead
     │
     ├── Chatbot publico ──────► groqLlama.chat.completions (llama-3.3-70b)
     │        │
     │        ├── Botao de audio (TTS) ──► groqLlama.audio.speech (playai-tts + Fritz-PlayAI)
     │        └── Envio de audio (STT) ──► groqLlama.audio.transcriptions (whisper-large-v3-turbo)
     │
Admin
     ├── IA Admin ─────────────► groqLlama.chat.completions (llama-3.3-70b)
     └── Blog Generator ───────► groqLlama.chat.completions (llama-3.3-70b) + BCB Selic + RSS
```

### Custo estimado mensal (Groq only)
- `llama-3.3-70b-versatile`: $0.59/1M input + $0.79/1M output
  - Chatbot: ~100k tokens/mes = ~$0.07
  - Blog (20 posts): ~500k tokens/mes = ~$0.50
- STT: $0.04/hora = praticamente zero em uso normal
- TTS: baixo volume = custo marginal

---

## 21) Snippets de codigo — projeto IRPF NSB

### 21.1 Configuracao atual (lib/llm-providers.ts)

```ts
import OpenAI from "openai";

// Cliente OpenAI — desativado. Descomente para reativar.
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
} as const;
```

### 21.2 Chat com streaming (chatbot route)

```ts
const stream = await groqLlama.chat.completions.create({
  model: MODELS.chatbot,
  messages: [
    { role: "system", content: CHATBOT_SYSTEM_PROMPT },
    ...recentMessages,
  ],
  max_tokens: 400,
  temperature: 0.7,
  stream: true,
});
```

### 21.3 STT — transcricao de audio

```ts
const transcription = await groqLlama.audio.transcriptions.create({
  file: audio,           // File object (fromData)
  model: "whisper-large-v3-turbo",
  language: "pt",
});
// transcription.text = texto transcrito
```

### 21.4 TTS — voz do chatbot

```ts
const mp3 = await groqLlama.audio.speech.create({
  model: "playai-tts",
  voice: "Fritz-PlayAI",
  input: text.trim(),
  speed: 1.05,
});
const buffer = Buffer.from(await mp3.arrayBuffer());
```

### 21.5 Batch para blog em volume (50% desconto)

```ts
// 1. Criar arquivo JSONL com os requests
const requests = topics.map((topic, i) => ({
  custom_id: `blog-${i}`,
  method: "POST",
  url: "/v1/chat/completions",
  body: {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: blogSystemPrompt(selicAtual, [], []) },
      { role: "user", content: `Escreva um post sobre: ${topic}` },
    ],
    max_tokens: 2000,
  },
}));

// 2. Upload
const file = await groqLlama.files.create({
  file: new Blob([requests.map(r => JSON.stringify(r)).join("\n")], { type: "application/json" }),
  purpose: "batch",
});

// 3. Criar batch
const batch = await groqLlama.batches.create({
  input_file_id: file.id,
  endpoint: "/v1/chat/completions",
  completion_window: "24h",
});

// 4. Poll e download
// GET /batches/{batch.id} ate status == "completed"
// GET /files/{batch.output_file_id}/content
```

### 21.6 Compound com web search (para blog factual)

```ts
const res = await groqLlama.chat.completions.create({
  model: "groq/compound",
  messages: [
    { role: "system", content: "Voce e especialista em IRPF." },
    { role: "user", content: `Pesquise as ultimas noticias sobre: ${topic}` },
  ],
  // @ts-expect-error compound_custom nao esta tipado no SDK OpenAI
  compound_custom: {
    tools: { enabled_tools: ["web_search"] },
  },
});
```

### 21.7 Structured Output (blog tags)

```ts
const res = await groqLlama.chat.completions.create({
  model: "openai/gpt-oss-20b",  // strict mode disponivel
  messages: [...],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "blog_metadata",
      strict: true,
      schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          summary: { type: "string" },
        },
        required: ["title", "tags", "summary"],
        additionalProperties: false,
      },
    },
  },
});
```

---

## 22) Prompting otimizado para Groq + IRPF

### 22.1 Estrutura recomendada do system prompt (com caching)

```
[PARTE 1 — ESTATICA, SEMPRE IGUAL — caching ocorre aqui]
Identidade + missao + regras de compliance fiscal
Tabela IRPF atualizada
Limites de obrigatoriedade
Regras fixas de deducao

[PARTE 2 — SEMI-ESTATICA — caching parcial]
Selic atual: {selicAtual}%
Top 40 posts existentes (anti-repeticao)

[PARTE 3 — DINAMICA — nunca em cache]
Input do usuario / pergunta especifica
```

### 22.2 Parametros recomendados por caso de uso

| Caso              | temperature | max_tokens | Observacao                            |
|-------------------|------------|------------|---------------------------------------|
| Chatbot vendas    | 0.7        | 400        | Tom natural, sem rigidez              |
| Blog IA           | 0.85       | 2000+      | Criatividade controlada               |
| Admin IA          | 0.5        | 2000       | Mais preciso                          |
| Classificacao lead | 0.1       | 50         | Determinismo alto                     |
| Geracao de tags   | 0.2        | 100        | Padrao consistente                    |

### 22.3 Anti-jailbreak (ja implementado no chatbot)
- Bloquear padroes: `role hijack`, `ignore instruções`, `finja que`, `novo prompt`
- Bloquear off-topic: codigo, hackeamento, programacao
- Limitar mensagens a 2000 chars por input
- Manter apenas ultimas 10 mensagens de contexto

---

## 23) Roadmap de evolucao (ordem de prioridade)

### Curto prazo (ja feito ✅)
- ✅ Blog: Groq llama-3.3-70b-versatile
- ✅ Chatbot: migrado para Groq
- ✅ Admin IA: migrado para Groq
- ✅ STT: migrado para whisper-large-v3-turbo
- ✅ TTS: migrado para playai-tts

### Medio prazo
- Blog com Compound (web search para noticias em tempo real)
- Batch API para geracao mensal de blog em volume (50% desconto)
- Content Moderation com `llama-prompt-guard-2` para filtrar inputs do chatbot

### Longo prazo
- Orpheus TTS (se sair de preview) para voz mais expressiva em portugues
- LoRA fine-tuning em modelo menor para chatbot especializado em IRPF
- Reasoning models para analise fiscal complexa (retificacoes, malha fina)
- Flash pricing com `llama-3.1-8b-instant` para triagem inicial de FAQ simples

---

## 24) Fontes oficiais

- https://console.groq.com/docs/overview
- https://console.groq.com/docs/models
- https://console.groq.com/docs/api-reference#chat-create
- https://console.groq.com/docs/openai
- https://console.groq.com/docs/responses-api
- https://console.groq.com/docs/text-chat
- https://console.groq.com/docs/speech-to-text
- https://console.groq.com/docs/text-to-speech
- https://console.groq.com/docs/text-to-speech/orpheus
- https://console.groq.com/docs/reasoning
- https://console.groq.com/docs/structured-outputs
- https://console.groq.com/docs/prompt-caching
- https://console.groq.com/docs/tool-use/overview
- https://console.groq.com/docs/tool-use/built-in-tools
- https://console.groq.com/docs/compound
- https://console.groq.com/docs/rate-limits
- https://console.groq.com/docs/service-tiers
- https://console.groq.com/docs/flex-processing
- https://console.groq.com/docs/batch
- https://console.groq.com/docs/errors
- https://console.groq.com/docs/your-data
- https://console.groq.com/docs/production-readiness/production-ready-checklist

---

## 25) Nota de manutencao

A Groq atualiza modelos, limites e precos com frequencia.
Revisar este documento quando:
- Orpheus sair de preview para producao (TTS de alta qualidade)
- Novos modelos com suporte a portugues melhorado
- Atualizacoes em rate limits por organizacao
- Mudancas no Compound systems
- Respostas API saindo de beta
