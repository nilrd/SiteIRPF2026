# 📋 Relatório de Auditoria — Blog IRPF NSB
**Site:** https://irpf.qaplay.com.br/blog  
**Data da auditoria:** 15 de março de 2026  
**Destinatário:** GitHub Copilot / Desenvolvedor responsável  
**Objetivo:** Corrigir erros factuais em posts gerados por IA e implementar travas para evitar novas publicações com dados incorretos.

---

## 🔴 PARTE 1 — POSTS COM ERROS: O QUE FAZER COM CADA UM

### POST 1 — ⚠️ EDITAR
**Título:** Prazo Declaração IRPF 2026 - Ano Base 2025  
**URL:** `/blog/prazo-declaracao-irpf-2026-ano-base-2025`  
**Ação:** **EDITAR** — corrigir 3 dados errados

| Campo no post | Valor publicado (ERRADO) | Valor correto |
|---|---|---|
| Data de início da declaração | 18 de março de 2026 | **16 de março de 2026** |
| Rendimento mínimo para declarar | R$ 28.123,91 | **R$ 33.888,00** |
| Encerramento das restituições | Outubro de 2026 | **30 de setembro de 2026** |

> ⚠️ **O valor R$ 28.123,91 não existe em nenhuma norma da Receita Federal. Foi inventado pela IA.**  
> Um usuário que leia esse post pode acreditar que não precisa declarar quando na verdade precisa, gerando multa.

---

### POST 2 — ⚠️ EDITAR
**Título:** IRPF 2026: O que muda no Imposto de Renda em 2026  
**URL:** `/blog/irpf-2026-o-que-muda-no-imposto-de-renda-em-2026`  
**Ação:** **EDITAR** — corrigir 2 afirmações incorretas

| Problema | Trecho publicado (ERRADO) | Correção |
|---|---|---|
| Obrigatoriedade genérica | "Todas as pessoas físicas que receberam rendimentos em 2025 devem declarar" | Apenas quem superou os limites legais (ex: rendimentos tributáveis acima de R$ 33.888) |
| Contradição interna | "O prazo para a declaração do IRPF 2026 ainda não foi divulgado" | O prazo foi divulgado: 16/03 a 30/05/2026 |

> ⚠️ Dizer que "todos" precisam declarar é factualmente errado e pode gerar trabalho desnecessário ao usuário — ou pior, levar alguém sem obrigação a acreditar que tem pendência fiscal.

---

### POST 3 — ⚠️ EDITAR
**Título:** Isenção Imposto de Renda 2026  
**URL:** `/blog/isencao-imposto-de-renda-2026`  
**Ação:** **EDITAR** — corrigir exemplo de cálculo enganoso

| Problema | Trecho publicado (ENGANOSO) | Correção |
|---|---|---|
| Exemplo de cálculo errado | "Contribuinte com R$ 4.000/mês está na faixa 22,5%... mas não precisará pagar IR" | A isenção efetiva até R$ 5.000 se aplica via dedução especial, não isenção total. O cálculo mostrado é incorreto e omite a mecânica da dedução. Remover o exemplo ou reescrever com a fórmula correta. |

---

### POST 4 — ⚠️ EDITAR
**Título:** 5 Erros de Declaração IRPF 2026 que a Receita Federal Detecta Automaticamente  
**URL:** `/blog/erros-declaracao-irpf-2026-receita-federal`  
**Ação:** **EDITAR** — corrigir data e prazo de restituição

| Campo | Publicado (ERRADO) | Correto |
|---|---|---|
| Data de início | "18 de março" | **16 de março** |
| Último lote de restituições | "outubro de 2026" | **30 de setembro de 2026** |

> O título do post na tag `<meta>` também repete "18 de março" — corrigir também no SEO/metadata.

---

### POST 5 — 🔴 EXCLUIR
**Título:** Aposentadoria INSS 2026: Regras e Pontuação  
**URL:** `/blog/aposentadoria-inss-regras-pontuacao-2026`  
**Ação:** **EXCLUIR IMEDIATAMENTE** — contém fórmula inventada e tabela de pontuação falsa

**Erros graves encontrados:**

1. **Fórmula inventada:**  
   O post apresenta a fórmula: `Benefício = (Salário x Tempo) / 100`  
   **Esta fórmula não existe.** O cálculo real do INSS usa a média dos 80% maiores salários de contribuição multiplicada pelo fator previdenciário (ou regras de transição da reforma de 2019). Usar essa fórmula levaria o usuário a calcular um valor completamente errado do seu benefício.

2. **Tabela de pontuação inventada:**  
   O post publica:
   | Idade | Pontuação |
   |---|---|
   | 60+ anos | 100 pontos |
   | 55–59 anos | 80 pontos |
   | 50–54 anos | 60 pontos |
   
   **Esta tabela não existe no INSS.** A pontuação real em 2026 é: homens = 97 pontos (mínimo 35 anos de contribuição), mulheres = 87 pontos (mínimo 30 anos de contribuição), conforme cronograma da Reforma da Previdência (EC 103/2019).

3. **Fora do escopo do site:** O blog é de consultoria IRPF, não Previdência Social. Um post errado sobre INSS não agrega valor e aumenta o risco de credibilidade.

> 🔴 **Este post deve ser excluído antes de qualquer outra ação. É o de maior risco no site.**

---

### POSTS 6 a 10 — ✅ MANTER (sem erros graves detectados)
Os posts abaixo apresentam conteúdo educativo genérico sem dados específicos incorretos detectados na auditoria:

- `/blog/simplificado-x-completo-irpf-qual-e-melhor`
- `/blog/heranca-e-doacao-irpf-como-declarar`
- `/blog/retificacao-irpf-como-fazer`
- `/blog/irpf-2026-guia-completo`
- `/blog/irpf-2026-tabela-e-calculo`

> ℹ️ Recomenda-se revisar manualmente os posts de tabela e cálculo para confirmar que os valores coincidem com a tabela oficial Lei 15.270/2025.

---

## 🟡 PARTE 2 — CAUSA RAIZ DO PROBLEMA

O gerador automático (Groq) não tem nenhuma trava contra alucinação de dados numéricos. Quando o modelo não sabe um valor exato, ele **inventa um número plausível** em vez de dizer que não sabe. Isso é comportamento padrão de LLMs sem contexto externo forçado.

**Padrões de erro identificados:**
- Valores em R$ criados por interpolação (R$ 28.123,91)
- Datas próximas mas incorretas (18/03 vs 16/03)
- Fórmulas e tabelas completamente fictícias (INSS)
- Afirmações absolutas incorretas ("todos devem declarar")
- Contradições internas no mesmo post (prazo "não divulgado" vs prazo citado)

---

## 🟢 PARTE 3 — PROPOSTA DE SOLUÇÃO PARA O COPILOT IMPLEMENTAR

> **Premissa:** Sem novas chaves de API. Usar apenas a infraestrutura Groq já existente.

---

### 3.1 — Substituir o System Prompt

Localizar o arquivo onde o system prompt do gerador está definido (provavelmente em `/api/generate-post`, `/lib/ai.ts`, `/services/groq.ts` ou similar) e **substituir o system prompt atual** pelo seguinte:

```
Você é um redator especializado em tributação brasileira e IRPF.
Você opera com nível máximo de responsabilidade factual.

REGRAS ABSOLUTAS — nunca viole nenhuma delas:

REGRA 1 — DADOS NUMÉRICOS
Nunca escreva valores em R$ específicos, datas exatas ou percentuais
sem que esses dados estejam explicitamente no contexto fornecido.
Se não tiver o dado exato, use sempre:
  -> "conforme tabela vigente da Receita Federal"
  -> "no prazo oficial divulgado pela Receita Federal"
  -> "verifique o valor atualizado em gov.br/receitafederal"

REGRA 2 — NOMES DE LEIS
Nunca cite número de lei (ex: "Lei nº X.XXX") sem tê-la no contexto.
Use: "conforme legislação vigente" se não tiver a fonte.

REGRA 3 — FÓRMULAS E CÁLCULOS
Nunca publique fórmulas matemáticas de cálculo de impostos, benefícios
ou contribuições sem que a fórmula exata esteja no contexto fornecido.
Se não tiver a fórmula, direcione o usuário para a fonte oficial.

REGRA 4 — AFIRMAÇÕES ABSOLUTAS
Nunca use "todos devem", "sempre é obrigatório", "qualquer pessoa precisa"
para regras fiscais. Substitua por "quem se enquadra nas regras vigentes"
ou "conforme os critérios da Receita Federal".

REGRA 5 — ESCOPO DO SITE
Este site é de consultoria IRPF (Imposto de Renda Pessoa Física).
Não gere posts sobre: INSS, Previdência Social, aposentadoria, FGTS,
CLT, direito trabalhista ou qualquer tema fora do IRPF.
Se o tema solicitado estiver fora do escopo, recuse e sugira um tema de IRPF.

REGRA 6 — SEÇÃO DE FONTES
Todo post deve terminar com seção "Fontes" listando apenas:
- gov.br/receitafederal
- planalto.gov.br (apenas se citar lei específica do contexto)
Não inventar URLs. Não listar fontes que não foram consultadas.
```

---

### 3.2 — Adicionar Verificador Pós-Geração (2ª chamada Groq)

Após a geração do post, antes de salvar/publicar, adicionar uma segunda chamada à API Groq usando o modelo `llama-3.1-8b-instant` (mais rápido e barato):

```javascript
// Exemplo de implementação — adaptar à estrutura do projeto
async function verificarPost(conteudoPost) {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `Você é um verificador de fatos tributários.
Analise o post recebido e identifique:
1. Valores em R$ específicos sem ressalva de fonte
2. Datas exatas sem confirmação oficial
3. Nomes de leis citadas (ex: "Lei nº X.XXX")
4. Fórmulas matemáticas de cálculo
5. Afirmações absolutas sobre obrigatoriedade
6. Conteúdo fora do escopo IRPF (INSS, aposentadoria, FGTS, etc.)

Retorne APENAS JSON válido, sem texto adicional:
{
  "aprovado": true ou false,
  "nivel_risco": "baixo" | "medio" | "alto" | "critico",
  "itens_de_risco": ["descrição de cada problema encontrado"],
  "resumo": "frase curta explicando a decisão"
}`
      },
      {
        role: "user",
        content: `POST PARA VERIFICAR:\n\n${conteudoPost}`
      }
    ],
    temperature: 0,
    max_tokens: 500
  });

  const texto = response.choices[0].message.content;
  return JSON.parse(texto);
}
```

---

### 3.3 — Lógica de Publicação Condicional

Substituir a lógica atual de publicação direta pela seguinte:

```javascript
// Pseudocódigo — adaptar à estrutura real do projeto
async function gerarEPublicarPost(tema) {
  // 1. Gerar post com novo system prompt
  const postGerado = await gerarPost(tema);

  // 2. Verificar com segunda chamada
  const verificacao = await verificarPost(postGerado.conteudo);

  if (verificacao.aprovado === true) {
    // Publicar normalmente
    await salvarPost({ ...postGerado, status: 'published' });
    console.log('✅ Post publicado:', postGerado.titulo);

  } else {
    // Reter para revisão no painel ADM
    await salvarPost({
      ...postGerado,
      status: 'pending_review',
      revisao_motivo: verificacao.itens_de_risco,
      revisao_nivel: verificacao.nivel_risco,
      revisao_resumo: verificacao.resumo
    });
    console.warn('⚠️ Post retido para revisão:', verificacao.resumo);
    // Opcional: notificar ADM (email, webhook, etc.)
  }
}
```

---

### 3.4 — Adicionar Contexto Fixo com Dados Corretos (DATA_CONTEXT)

Criar um arquivo de contexto com os dados oficiais atuais e injetá-lo como contexto no prompt de geração:

```javascript
// /lib/irpf-context.ts — criar este arquivo
export const IRPF_DATA_CONTEXT = `
DADOS OFICIAIS IRPF 2026 (verificados em 15/03/2026):

PRAZOS:
- Início da declaração: 16 de março de 2026
- Fim da declaração: 30 de maio de 2026
- Lote 1 restituição: maio/junho 2026
- Lote final restituição: 30 de setembro de 2026

OBRIGATORIEDADE:
- Rendimentos tributáveis acima de R$ 33.888,00 em 2025
- Rendimentos isentos acima de R$ 200.000,00
- Bens e direitos acima de R$ 800.000,00

TABELA PROGRESSIVA 2026 (Lei 15.270/2025):
- Até R$ 2.428,80/mês: isento
- R$ 2.428,81 a R$ 2.826,65: 7,5% (dedução R$ 182,16)
- R$ 2.826,66 a R$ 3.751,05: 15% (dedução R$ 394,16)
- R$ 3.751,06 a R$ 4.664,68: 22,5% (dedução R$ 675,49)
- Acima de R$ 4.664,68: 27,5% (dedução R$ 908,73)

ISENÇÃO EFETIVA ATÉ R$ 5.000:
- Via dedução especial da Lei 15.270/2025
- Não é isenção total — é isenção efetiva por dedução complementar

MULTA POR ATRASO:
- Mínimo: R$ 165,74
- Ou 1% ao mês sobre imposto devido (o maior), limitado a 20%

FONTE: gov.br/receitafederal — Instrução Normativa RFB nº 2.255/2025
`;
```

Injetar esse contexto no início de cada chamada de geração:

```javascript
// No gerador de posts, antes de montar o prompt:
const promptComContexto = `
${IRPF_DATA_CONTEXT}

---
Use APENAS os dados acima como referência para valores, datas e percentuais.
Não use outros números além dos listados acima.

TEMA DO POST: ${tema}
`;
```

---

### 3.5 — Filtro de Temas Fora do Escopo

Antes de iniciar a geração, validar se o tema está dentro do escopo do site:

```javascript
const TEMAS_BLOQUEADOS = [
  'inss', 'aposentadoria', 'previdência', 'previdencia',
  'fgts', 'clt', 'trabalhista', 'benefício previdenciário',
  'bpc', 'loas', 'auxílio', 'seguro desemprego'
];

function temaEstaNoEscopo(tema) {
  const temaLower = tema.toLowerCase();
  return !TEMAS_BLOQUEADOS.some(bloqueado => temaLower.includes(bloqueado));
}

// No gerador:
if (!temaEstaNoEscopo(tema)) {
  throw new Error(`Tema "${tema}" está fora do escopo do blog IRPF. Não publicado.`);
}
```

---

## 📊 PARTE 4 — RESUMO EXECUTIVO DAS AÇÕES

### Para o dono do site (você) — fazer agora:
| Prioridade | Post | Ação |
|---|---|---|
| 🔴 URGENTE | `/blog/aposentadoria-inss-regras-pontuacao-2026` | **EXCLUIR** — fórmula e tabela inventadas |
| 🔴 URGENTE | `/blog/prazo-declaracao-irpf-2026-ano-base-2025` | **EDITAR** — 3 dados errados incluindo R$ 28.123,91 inexistente |
| 🟡 ALTA | `/blog/irpf-2026-o-que-muda-no-imposto-de-renda-em-2026` | **EDITAR** — afirmação errada sobre obrigatoriedade |
| 🟡 ALTA | `/blog/erros-declaracao-irpf-2026-receita-federal` | **EDITAR** — data errada (18/03 → 16/03) |
| 🟢 MÉDIA | `/blog/isencao-imposto-de-renda-2026` | **EDITAR** — exemplo de cálculo enganoso |

### Para o Copilot implementar no código:
| # | Mudança | Arquivo provável | Impacto |
|---|---|---|---|
| 1 | Substituir system prompt | `/lib/ai.ts` ou `/api/generate-post` | Elimina invenção de dados |
| 2 | Adicionar verificador pós-geração | mesmo arquivo do gerador | Detecta erros antes de publicar |
| 3 | Lógica de publicação condicional | mesmo arquivo do gerador | Posts com risco vão para fila ADM |
| 4 | Criar `IRPF_DATA_CONTEXT` com dados fixos | `/lib/irpf-context.ts` (novo) | Ancora a IA em dados reais |
| 5 | Filtro de temas fora do escopo | antes da chamada de geração | Bloqueia posts sobre INSS, FGTS etc. |

---

## 📎 PARTE 5 — REFERÊNCIAS OFICIAIS PARA O COPILOT USAR NOS TESTES

- Receita Federal IRPF: https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda
- Lei 15.270/2025 (tabela IRPF): https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm
- Instrução Normativa 2.255/2025: https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/dirpf
- Calendário restituições 2026: https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/restituicao

---

*Relatório gerado em 15/03/2026 — irpf.qaplay.com.br*
