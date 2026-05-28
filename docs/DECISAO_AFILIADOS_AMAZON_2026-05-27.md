# Decisão Técnica — Afiliados Amazon (2026-05-27)

## Decisão aprovada
1. Não usar OpenAI no fluxo de geração automática de posts.
2. Não criar novas chaves de API.
3. Operar somente com as chaves já existentes no projeto.

## Diretriz de estabilidade
1. Evitar mudanças que possam quebrar o fluxo atual de blog/autopost.
2. Manter arquitetura de fallback já existente (Gemini/Groq/Mistral/GitHub Models).
3. Fallback OpenAI desligado por padrão via `ENABLE_OPENAI_FALLBACK=false`.

## Regra inegociável de imagem para afiliados Amazon
1. Todo conteúdo com link Amazon deve usar a imagem original do produto entregue pelo link.
2. Imagem genérica, de IA, de banco de imagens ou de produto similar é proibida.
3. Se a validação automática não confirmar correspondência da imagem, o post não pode ser publicado automaticamente.
4. Nestes casos, o post deve ser marcado para revisão manual (`needsReview=true`).

## Regra inegociável de link Amazon
1. Conteúdos gerados sem link Amazon afiliado não podem ser criados.
2. O backend bloqueia a criação quando não detecta URL Amazon/amzn.to no conteúdo.
3. Flag de controle: `REQUIRE_AMAZON_LINK_IN_GENERATED_CONTENT=true`.

## Implementação aplicada
1. Criado validador de compliance de imagem Amazon em `lib/affiliate-image-compliance.ts`.
2. Validação integrada no salvamento de posts em:
- `lib/blog-engine.ts`
- `lib/mei-blog-engine.ts`
- `lib/motorista-engine.ts`
3. Quando houver link Amazon e a imagem não for validada:
- `published=false`
- `needsReview=true`
- motivo registrado em `reviewJson.affiliateCompliance`

## Observação operacional
1. Para conteúdos sem links Amazon, não há alteração de comportamento de publicação.
2. Para conteúdos com links Amazon, a publicação automática só ocorre quando a imagem de capa passar na verificação de conformidade.
