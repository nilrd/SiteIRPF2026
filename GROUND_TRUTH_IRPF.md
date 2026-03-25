# GROUND_TRUTH_IRPF.md
# BASE DE CONHECIMENTO VERIFICADA — CONSULTORIA IRPF NSB
# VERSÃO 2.0 — REESCRITA COMPLETA COM BASE NOS DOCUMENTOS OFICIAIS
#
# FONTES PRIMÁRIAS LIDAS NA ÍNTEGRA:
#   - Tributação de 2025.MD                               → gov.br/receitafederal
#   - Tributação 2026.md                                  → gov.br/receitafederal
#   - LEI N 15 270 DE 26 DE NOVEMBRO DE 2025.MD           → texto integral da lei
#   - Exemplos de Aplicação da Lei 152702025.MD           → exemplos oficiais RF
#   - FAQAmpliaodaIsenodoImpostodeRenda.docx.pdf          → FAQ oficial RF
#   - nova tabela ir.md                                   → secom.gov.br 06/01/2026
#   - Quem deve declarar.md                               → gov.br/receitafederal
#   - Manual da Malha Fina.MD                             → gov.br/receitafederal
#   - Instituicional IRPF2026.MD + REGRASIRPF2026.MD      → aviso de pauta RF 04/03/2026
#   - PENSAMENTO IRPF.MD                                  → briefing interno do negócio
#   - URLs verificadas: gov.br/receitafederal/dez-2025, secom.gov.br/jan-2026, oglobo
#
# Verificado em: 08/03/2026 | Substitui versão 1.0 integralmente

---

## ⚠️ AVISO CRÍTICO — LER ANTES DE QUALQUER RESPOSTA SOBRE IRPF

**As regras específicas do IRPF 2026 serão anunciadas em 16/03/2026.**
A Receita Federal convocou coletiva de imprensa em 16/03/2026 às 10h (Ministério da Fazenda).
Serão confirmados: prazo de entrega, limites de obrigatoriedade e demais regras da declaração.

**Enquanto isso:**
- NÃO afirmar data de prazo do IRPF 2026 com certeza
- NÃO afirmar o limite de obrigatoriedade do IRPF 2026 com certeza
- INFORMAR que as regras serão anunciadas em breve (16/03/2026)

---

## ⚠️ ERROS CRÍTICOS CORRIGIDOS — versão 1.0 tinha dados errados

| # | Campo | ERRADO (v1.0) | CORRETO (v2.0) | Fonte |
|---|---|---|---|---|
| 1 | Tabela anual exercício 2026 — isenção | R$ 24.511,92 | **R$ 28.467,20** | Tributação de 2025.MD |
| 2 | Tabela anual exercício 2026 — parcelas a deduzir | valores de 2024 | **valores novos abaixo** | Tributação de 2025.MD |
| 3 | Desconto simplificado — IRPF 2026 (ano-base 2025) | R$ 17.640,00 | **R$ 16.754,34** | Lei 15.270 art.2 inc.IX |
| 4 | Redução R$5.000 — quando entra na declaração | "declaração 2026" | **declaração 2027** (ano-base 2026) | Lei 15.270 art.11-A |
| 5 | Multa máxima | "R$ 6.275,00" | **20% do IR devido — sem teto fixo** | RF/malha |
| 6 | Prazo IRPF 2025 | "31 de maio" | **30 de maio de 2025** | balanço RF |

---

## REGRA ABSOLUTA DE USO PARA TODA IA DESTE PROJETO

```
Hierarquia de autoridade:
1º  Este arquivo (GROUND_TRUTH_IRPF.md)
2º  Pasta /documentos IRPF/ (fontes primárias anexadas)
3º  gov.br/receitafederal (fonte oficial)
4º  Conhecimento interno do modelo → PROIBIDO para qualquer dado numérico de IRPF

NUNCA usar valores de memória quando o dado estiver neste arquivo.
NUNCA inventar valores, parcelas, percentuais ou prazos.
EM DÚVIDA: "não tenho certeza — consulte gov.br/receitafederal"
```

---

## PARTE 1 — IRPF 2025 (ENCERRADO)
### Exercício 2025 | Ano-calendário 2024 | Prazo encerrado em 30/05/2025

Use para: retificação, cálculo de multa por atraso, referência histórica.

### 1.1 Prazo
- Início: 17/03/2025
- Encerramento: **30 de maio de 2025** (não foi 31 — quem entregou no dia 31 está em atraso)

### 1.2 Obrigatoriedade — exercício 2025 (ano-base 2024)
Base legal: **IN RFB nº 2.255/2025**

| Motivo | Limite |
|---|---|
| Rendimentos tributáveis | **R$ 33.888,00** |
| Rendimentos isentos/não tributáveis/exclusivos na fonte | R$ 200.000,00 |
| Receita bruta atividade rural | R$ 169.440,00 |
| Bens e direitos em 31/12/2024 | R$ 800.000,00 |
| Operações em bolsa | R$ 40.000,00 |

Também obrigado: ganho de capital, venda de imóvel com isenção, passou a ser residente em 2024,
bens em controladas no exterior (Lei 14.754/2023), trust, atualização de imóvel (Lei 14.973/2024).

### 1.3 Tabela Progressiva Mensal vigente em 2024 (Lei nº 14.848/2024)

| Base de cálculo mensal | Alíquota | Parcela a deduzir |
|---|---|---|
| Até R$ 2.259,20 | 0% | — |
| R$ 2.259,21 a R$ 2.826,65 | 7,5% | R$ 169,44 |
| R$ 2.826,66 a R$ 3.751,05 | 15% | R$ 381,44 |
| R$ 3.751,06 a R$ 4.664,68 | 22,5% | R$ 662,77 |
| Acima de R$ 4.664,68 | 27,5% | R$ 896,00 |

### 1.4 Tabela Progressiva Anual — exercício 2025 (ano-base 2024)
Fonte: Tributação de 2025.MD — seção "A partir do exercício 2025 (ano-calendário 2024)"
(Nota: esta tabela está na seção "Exercício 2025" do doc — verifique antes de usar)

| Base de cálculo anual | Alíquota | Parcela a deduzir |
|---|---|---|
| Até R$ 24.511,92 | 0% | — |
| R$ 24.511,93 a R$ 33.919,80 | 7,5% | R$ 1.838,39 |
| R$ 33.919,81 a R$ 45.012,60 | 15% | R$ 4.382,38 |
| R$ 45.012,61 a R$ 55.976,16 | 22,5% | R$ 7.758,57 |
| Acima de R$ 55.976,16 | 27,5% | R$ 10.557,65 |

### 1.5 Deduções — exercício 2025

| Dedução | Valor |
|---|---|
| Por dependente (anual) | R$ 2.275,08 |
| Educação por pessoa/ano | R$ 3.561,50 |
| Desconto simplificado (máx.) | R$ 16.754,34 (20% dos rendimentos) |
| Isenção previdenciária ≥65 anos (por fonte/mês) | R$ 1.903,98 |


---

## PARTE 2 — IRPF 2026 (EM ANDAMENTO)
### Exercício 2026 | Ano-calendário 2025 | Regras completas: anúncio em 16/03/2026

### ⚠️ STATUS: REGRAS AINDA NÃO ANUNCIADAS OFICIALMENTE

As tabelas já estão publicadas (abaixo). Prazo e limites de obrigatoriedade: aguardar 16/03/2026.

### 2.1 Tabela Progressiva Mensal durante 2025 — DOIS PERÍODOS

Houve mudança de tabela durante 2025. Isso afeta o cálculo do ajuste anual.

**Janeiro a Abril/2025** (Lei nº 14.848/2024):

| Base de cálculo mensal | Alíquota | Parcela a deduzir |
|---|---|---|
| Até R$ 2.259,20 | 0% | — |
| R$ 2.259,21 a R$ 2.826,65 | 7,5% | R$ 169,44 |
| R$ 2.826,66 a R$ 3.751,05 | 15% | R$ 381,44 |
| R$ 3.751,06 a R$ 4.664,68 | 22,5% | R$ 662,77 |
| Acima de R$ 4.664,68 | 27,5% | R$ 896,00 |

Dedução mensal por dependente: R$ 189,59
Desconto simplificado mensal: R$ 564,80

**Maio a Dezembro/2025** (Lei nº 15.191, de 11 de agosto de 2025):

| Base de cálculo mensal | Alíquota | Parcela a deduzir |
|---|---|---|
| Até R$ 2.428,80 | 0% | — |
| R$ 2.428,81 a R$ 2.826,65 | 7,5% | R$ 182,16 |
| R$ 2.826,66 a R$ 3.751,05 | 15% | R$ 394,16 |
| R$ 3.751,06 a R$ 4.664,68 | 22,5% | R$ 675,49 |
| Acima de R$ 4.664,68 | 27,5% | R$ 908,73 |

Dedução mensal por dependente: R$ 189,59
Desconto simplificado mensal: **R$ 607,20** (25% de R$ 2.428,80)
Isenção previdenciária ≥65 anos (por fonte/mês): R$ 1.903,98

### 2.2 Tabela Progressiva Anual — exercício 2026 (ano-base 2025)
Fonte: **Tributação de 2025.MD** — seção "A partir do exercício 2026 (ano-calendário 2025)"

| Base de cálculo anual | Alíquota | Parcela a deduzir |
|---|---|---|
| Até R$ 28.467,20 | 0% | — |
| R$ 28.467,21 a R$ 33.919,80 | 7,5% | R$ 2.135,04 |
| R$ 33.919,81 a R$ 45.012,60 | 15% | R$ 4.679,03 |
| R$ 45.012,61 a R$ 55.976,16 | 22,5% | R$ 8.054,97 |
| Acima de R$ 55.976,16 | 27,5% | R$ 10.853,78 |

⚠️ O limite de isenção MUDOU: passou de R$ 24.511,92 (exercício 2025) para R$ 28.467,20 (exercício 2026).
Isso reflete o aumento da tabela mensal que entrou em vigor em maio/2025.

### 2.3 Deduções — exercício 2026 (ano-base 2025)

| Dedução | Valor |
|---|---|
| Por dependente (anual) | R$ 2.275,08 |
| Educação por pessoa/ano | R$ 3.561,50 |
| **Desconto simplificado (máx.)** | **R$ 16.754,34** (20% dos rendimentos) |

⚠️ O desconto simplificado de R$ 17.640,00 aplica-se ao **ano-calendário 2026** (declaração 2027).
Para a declaração 2026 (ano-base 2025), o limite é R$ 16.754,34.
Fonte: Lei 15.270/2025, Art.2 — "R$ 16.754,34 até ano-calendário 2025; R$ 17.640,00 a partir de 2026."

### 2.4 O que a Lei 15.270/2025 NÃO muda para o IRPF 2026

As seguintes novidades da Lei 15.270/2025 **NÃO afetam a declaração IRPF 2026** (ano-base 2025):

- Isenção para renda até R$ 5.000/mês → aplica-se à **retenção mensal a partir de jan/2026**
  e à **declaração de 2027** (ano-base 2026) — NÃO à declaração 2026
- Tabela de Redução Anual (Art. 11-A): texto da lei diz explicitamente
  "A partir do exercício de **2027**, ano-calendário de **2026**..." → somente IRPF 2027
- Tributação Mínima (Art. 16-A): idem — "A partir do exercício de **2027**..." → somente IRPF 2027
- Tributação de dividendos na fonte (Art. 6-A): vigente desde jan/2026 para recebimentos mensais
  acima de R$ 50.000 de uma mesma PJ — afeta CLT de alta renda? Não. Afeta sócios recebendo
  dividendos altos? Sim — mas tributação de PJ está fora do escopo da Consultoria NSB.

### 2.5 Obrigatoriedade — exercício 2026 (aguardar IN oficial pós 16/03/2026)

O que já se sabe (critérios gerais sempre presentes):
- Ganho de capital na alienação de bens
- Operações em bolsa acima do limite
- Atividade rural acima do limite
- Passou à condição de residente em 2025
- Patrimônio acima do limite em 31/12/2025
- Controladas no exterior, trust (Lei 14.754/2023)

Limites de valor específicos: aguardar publicação da IN RFB específica do IRPF 2026.
Referência para o chatbot: "As regras completas do IRPF 2026 serão anunciadas em 16/03/2026."


---

## PARTE 3 — IRPF 2027 (REFERÊNCIA FUTURA — LEI 15.270/2025 EM PLENO EFEITO)
### Exercício 2027 | Ano-calendário 2026 | Declaração a entregar em 2027

Esta seção é para o chatbot explicar a isenção de R$ 5.000 quando perguntado.

### 3.1 Tabela Progressiva Mensal em 2026 (vigente agora — jan/2026 em diante)

**Tabela base** (Lei 15.191/2025 — igual a partir de mai/2025):

| Base de cálculo mensal | Alíquota | Parcela a deduzir |
|---|---|---|
| Até R$ 2.428,80 | 0% | — |
| R$ 2.428,81 a R$ 2.826,65 | 7,5% | R$ 182,16 |
| R$ 2.826,66 a R$ 3.751,05 | 15% | R$ 394,16 |
| R$ 3.751,06 a R$ 4.664,68 | 22,5% | R$ 675,49 |
| Acima de R$ 4.664,68 | 27,5% | R$ 908,73 |

**Tabela de Redução Mensal — NOVA (Lei 15.270/2025, Art. 3-A)**
Aplicada DEPOIS do cálculo pela tabela progressiva acima:

| Rendimentos tributáveis mensais | Redução do imposto |
|---|---|
| Até R$ 5.000,00 | Até R$ 312,89 — zerando o imposto |
| R$ 5.000,01 a R$ 7.350,00 | R$ 978,62 − (0,133145 × rendimentos mensais) |
| Acima de R$ 7.350,00 | Sem redução |

⚠️ REGRA FUNDAMENTAL: A tabela progressiva NÃO foi alterada. O benefício é um REDUTOR adicional.
Quem ganha acima de R$ 7.350,00/mês NÃO tem redução e paga normalmente pela tabela progressiva.
(Fonte: FAQ oficial RF, FAQ sobre a tabela do IR; Lei 15.270 §2º)

⚠️ MÚLTIPLAS FONTES DE RENDA: Quem recebe de mais de uma fonte, cada rendimento pode ser inferior
a R$ 5.000, mas o total pode gerar imposto a pagar na declaração anual.
(Fonte: nova tabela ir.md — secom.gov.br)

**Exemplos OFICIAIS (Exemplos de Aplicação da Lei 152702025.MD — Receita Federal):**

Exemplo 1 — Salário R$ 3.036,00:
- Desconto simplificado: R$ 607,20 → Base = R$ 2.428,00 → Tabela: 0% → IR = R$ 0,00
- Redução: não se aplica (IR já zero)

Exemplo 2 — Salário R$ 4.000,00:
- Desconto simplificado: R$ 607,20 → Base = R$ 3.392,80 → Tabela: 15% − R$394,16 = R$ 114,76
- Redução: até R$ 312,89 (1ª faixa) → reduz R$ 114,76 → **IR final = R$ 0,00**

Exemplo 3 — Salário R$ 5.000,00:
- Desconto simplificado: R$ 607,20 → Base = R$ 4.392,80 → Tabela: 22,5% − R$675,49 = R$ 312,89
- Redução: exatamente R$ 312,89 → **IR final = R$ 0,00**

Exemplo 4 — Salário R$ 6.000,00 (com INSS R$ 649,60):
- Deduções legais (INSS R$649,60 > simplificado R$607,20) → Base = R$ 5.350,40
- Tabela: 27,5% − R$ 908,73 = R$ 562,63
- Redução: R$ 978,62 − (0,133145 × R$ 6.000,00) = R$ 978,62 − R$ 798,87 = **R$ 179,75**
- **IR final = R$ 562,63 − R$ 179,75 = R$ 382,88**

Exemplo 5 — Salário R$ 7.607,20 (sem deduções):
- Desconto simplificado: R$ 607,20 → Base = R$ 7.000,00
- Tabela: 27,5% − R$ 908,73 = R$ 1.016,27
- Salário bruto (R$ 7.607,20) > R$ 7.350,00 → **sem redução**
- **IR final = R$ 1.016,27**
- ⚠️ Usa-se o SALÁRIO BRUTO (R$ 7.607,20), não a base de cálculo, para verificar o limite da redução

### 3.2 Tabela Progressiva Anual — exercício 2027 (ano-base 2026)
Fonte: **Tributação 2026.md** — seção "A partir do exercício 2027 (ano-calendário 2026)"

| Base de cálculo anual | Alíquota | Parcela a deduzir |
|---|---|---|
| Até R$ 29.145,60 | 0% | — |
| R$ 29.145,61 a R$ 33.919,80 | 7,5% | R$ 2.185,92 |
| R$ 33.919,81 a R$ 45.012,60 | 15% | R$ 4.729,91 |
| R$ 45.012,61 a R$ 55.976,16 | 22,5% | R$ 8.105,85 |
| Acima de R$ 55.976,16 | 27,5% | R$ 10.904,66 |

**Tabela de Redução Anual (Lei 15.270/2025, Art. 11-A):**

| Rendimentos tributáveis anuais | Redução do imposto |
|---|---|
| Até R$ 60.000,00 | Até R$ 2.694,15 — zerando o imposto |
| R$ 60.000,01 a R$ 88.200,00 | R$ 8.429,73 − (0,095575 × rendimentos anuais) |
| Acima de R$ 88.200,00 | Sem redução |

### 3.3 Deduções — exercício 2027

| Dedução | Valor |
|---|---|
| Por dependente (anual) | R$ 2.275,08 |
| Educação por pessoa/ano | R$ 3.561,50 |
| **Desconto simplificado (máx.)** | **R$ 17.640,00** (20% dos rendimentos) |

### 3.4 Tributação mínima — altas rendas (exercício 2027, ano-base 2026)
Fonte: Lei 15.270/2025, Art. 16-A + FAQ oficial RF

Quem é afetado: **soma de todos os rendimentos acima de R$ 600.000/ano** (R$ 50.000/mês)
Estimativa RF: 141.400 contribuintes (0,13% dos declarantes)

Cálculo da alíquota: `Alíquota% = (REND / 60.000) − 10`
- Até R$ 600.000: 0% → nada adicional
- R$ 750.000: 2,5% → R$ 18.750
- R$ 900.000: 5% → R$ 45.000
- R$ 1.050.000: 7,5% → R$ 78.750
- A partir de R$ 1.200.000: 10% fixo → ex: R$ 1.200.000 → R$ 120.000

O IR já pago (IRPF normal + retenção na fonte) é deduzido → paga só a diferença.

**Excluídos da base:** poupança, LCI, LCA, FII, Fiagro, CRI, CRA, herança, doação, indenizações,
pensão por moléstia grave, ganhos de capital exceto os de bolsa, rendimentos acumulados (RRA)
se não optou por ajuste anual.

**Importante para o chatbot:** Este tema é altamente técnico. Apenas mencionar que existe.
Nunca calcular ou afirmar valores sem analisar os documentos completos do contribuinte.

### 3.5 Tributação de lucros e dividendos (Lei 15.270/2025, Art. 6-A — vigente jan/2026)

- Dividendos de **uma mesma PJ para uma mesma PF acima de R$ 50.000/mês**: 10% de IRRF na fonte
- Sem deduções da base
- Não se aplica a: lucros de resultados apurados até 31/12/2025, com distribuição aprovada
  e exigível até 31/12/2025 nos termos originais do ato de aprovação

**Escopo NSB:** Tributação de PJ está FORA do escopo. Mencionar apenas se lead perguntar
sobre dividendos pessoais recebidos como sócio — orientar que é complexo e encaminhar ao WhatsApp.


---

## PARTE 4 — MULTAS E PENALIDADES

### 4.1 Multa por Entrega em Atraso (MAED)

**Cálculo:** 1% ao mês (ou fração de mês) sobre o **imposto devido**

**Limites:**
- Mínimo: **R$ 165,74** — aplica-se mesmo se IR devido = R$ 0 (vai receber restituição)
- Máximo: **20% do imposto devido** — SEM teto fixo em reais

⚠️ ERRO A NUNCA REPETIR: não existe "multa máxima de R$ 6.275,00". O máximo é sempre percentual.

**Exemplos corretos:**
- IR devido R$ 0 → multa = **R$ 165,74** (mínimo)
- IR devido R$ 1.000, 3 meses → R$ 30,00 → aplica mínimo → **R$ 165,74**
- IR devido R$ 5.000, 5 meses → 5% × R$ 5.000 = **R$ 250,00**
- IR devido R$ 5.000, 30 meses → teto 20% → **R$ 1.000,00**
- IR devido R$ 50.000, 30 meses → teto 20% → **R$ 10.000,00**

**Pagamento:** DARF código 3340, prazo 30 dias após o recibo/notificação
**Notificação:** emitida automaticamente junto ao recibo ao transmitir em atraso

**Multa agravada (lançamento de ofício):**
Se a RF lançar ANTES de o contribuinte declarar espontaneamente: **75% a 150% do IR devido**.
Declarar voluntariamente em atraso é sempre muito melhor que aguardar a RF agir.

### 4.2 Juros sobre imposto a pagar em atraso
Taxa Selic acumulada, incidente sobre o imposto a pagar (não sobre a multa), desde o vencimento.

### 4.3 CPF irregular
- Situação: "Pendente de regularização"
- Consequências: financiamento, conta bancária, concurso público, passaporte, crédito
- Prazo após envio da declaração: **48 a 72 horas** para processamento
- Não é imediato — nunca prometer regularização instantânea

---

## PARTE 5 — MALHA FINA (fonte: Manual da Malha Fina.MD — gov.br/receitafederal)

### 5.1 O que é
RF cruza dados declarados com informações de: empregadores (DIRF), bancos, planos de saúde,
INSS, corretoras, cartórios. Divergência → retenção para análise.
"Cair na malha fina não significa que a declaração está errada." — RF

### 5.2 Causas mais comuns
- Rendimentos divergem da DIRF do empregador
- Despesas médicas sem comprovação fiscal (RF cruza com planos de saúde)
- Dependentes com rendimentos não declarados
- Omissão de rendimentos (aluguéis, aplicações financeiras)
- INSS declarado difere do informe do empregador
- Pensão alimentícia sem decisão judicial comprobatória

### 5.3 Como sair
- Acessar e-CAC (gov.br/ecac) — conta gov.br nível prata ou ouro
- Verificar "Pendências de malha"
- **Opção A:** Enviar declaração retificadora corrigindo o erro
- **Opção B:** Apresentar documentação via e-CAC ("Atender à Intimação")

### 5.4 Notificação de Lançamento
Enviada quando RF identifica infração após cruzamento:
- Pagar: gera DARF conforme notificação
- **Pagar em até 30 dias: 50% de desconto na multa**
- **Parcelar em até 30 dias: 40% de desconto na multa**
- Parcelamento: até 60 vezes (mais parcelas = mais juros)
- Não concordar: Solicitar Retificação de Lançamento OU Impugnação — prazo: 30 dias

---

## PARTE 6 — DOCUMENTOS NECESSÁRIOS

### 6.1 Identificação
- CPF e data de nascimento
- Endereço completo com CEP
- Título de eleitor
- Dados bancários para restituição (banco, agência, conta ou chave Pix)

### 6.2 Rendimentos
- Informe de Rendimentos do empregador (DIRF)
- Informe de aposentadoria (INSS via Meu INSS ou fundo de previdência)
- Informe de rendimentos bancários e de corretoras
- Carnê-leão (autônomos, profissionais liberais, aluguéis sem retenção)
- Pró-labore (sócios de empresa)

### 6.3 Saúde — sem limite de dedução
- Notas fiscais e recibos: médicos, dentistas, psicólogos, fisioterapeutas
- Hospitais, clínicas, laboratórios, exames
- Plano de saúde (titular + dependentes)

### 6.4 Educação — limite R$ 3.561,50 por pessoa
- Mensalidades: escola, faculdade, pós-graduação
- NÃO são dedutíveis: cursos livres, idiomas, cursinhos pré-vestibular

### 6.5 Dependentes
- CPF obrigatório (inclusive bebês)
- Data de nascimento
- Certidão de nascimento (filhos) ou de casamento (cônjuge)
- Rendimentos de todos os dependentes — declarar mesmo os isentos

⚠️ ALERTA BOLSA FAMÍLIA — SEMPRE MENCIONAR:
Se dependente recebe Bolsa Família, BPC/LOAS ou benefício condicionado à renda familiar,
incluí-lo na declaração pode resultar no CORTE do benefício. A RF cruza os dados e a renda
do titular passa a constar vinculada ao CPF do dependente. Este alerta é obrigatório.

### 6.6 Bens e Direitos
- Imóveis: pelo **valor de aquisição** (escritura) — NUNCA pelo valor de mercado
- Veículos: pelo valor de compra — não usar tabela FIPE
- Extratos de saldo em 31/12 (contas, poupança, investimentos)
- Participações societárias (CNPJ, percentual)

### 6.7 Pensão alimentícia
Dedutível SOMENTE com respaldo em decisão judicial. Sem decisão: não é dedutível.

---

## PARTE 7 — QUEM PODE SER DEPENDENTE
Fonte: Quem deve declarar.md — gov.br/receitafederal

- Cônjuge ou companheiro (com filho ou convivência > 5 anos)
- Filhos/enteados até 21 anos
- Filhos/enteados de qualquer idade se incapacitados física ou mentalmente
- Filhos/enteados até 24 anos cursando ensino superior ou técnico
- Irmãos/netos/bisnetos sem pais: mesmas regras de idade, exige guarda judicial
- Pais, avós, bisavós: se tiveram rendimentos até o limite de isenção
- Menor pobre até 21 anos que o contribuinte crie e eduque (com guarda judicial)
- Tutelados e curatelados incapazes

---

## PARTE 8 — VANTAGENS DE DECLARAR (mesmo sem obrigação)
Argumento comercial para o chatbot — usar naturalmente.

- **Recuperar IR retido na fonte:** assalariados com rendimento baixo têm IR descontado ao longo
  do ano e só recebem de volta declarando
- **Regularizar o CPF:** CPF "não entregou" prejudica crédito, financiamento, visto
- **Comprovar renda:** declaração é aceita para financiamento imobiliário, empréstimo, visto internacional
- **Isenção dos 65 anos:** quem completou 65 pode requerer isenção retroativa e receber restituição
  dos meses anteriores ao aniversário, no mesmo ano-calendário
- **Compensar prejuízos rurais:** registrar prejuízo para compensar nos próximos 5 anos

---

## PARTE 9 — CASOS ESPECIAIS

### 9.1 Aposentados e pensionistas
- Isenção: até **R$ 1.903,98/mês por fonte pagadora** para ≥65 anos (apenas sobre proventos)
- Outros rendimentos (aluguéis, trabalho) somam e podem obrigar a declarar
- Ter rendimento isento não dispensa automaticamente — verificar todos os critérios

### 9.2 MEI
- Declara IR como PF se lucro tributável ultrapassar limite de obrigatoriedade
- DASN-SIMEI (obrigação da empresa) é SEPARADO do IR pessoal
- NUNCA orientar sobre obrigações empresariais — fora do escopo NSB

### 9.3 Autônomos e Profissionais Liberais
- Carnê-Leão mensal: rendimentos recebidos de PF sem retenção na fonte
- Despesas de atividade: dedutíveis via Livro-Caixa
- INSS como contribuinte individual: dedutível integral

### 9.4 Imóveis
- Sempre declarar pelo valor de aquisição (escritura)
- Venda residencial + reinvestimento em outro imóvel em **180 dias**: possível isenção
- Venda única de imóvel até R$ 440.000 (sem ter vendido outro nos últimos 5 anos): isento
- Ganho de capital: 15% a 22,5% sobre o lucro

### 9.5 Rendimentos de Capital — tabela (Tributação de 2025.MD)
Fundos de longo prazo e renda fixa:

| Alíquota | Prazo |
|---|---|
| 22,5% | até 180 dias |
| 20,0% | 181 a 360 dias |
| 17,5% | 361 a 720 dias |
| 15,0% | acima de 720 dias |

---

## PARTE 10 — O QUE A IA NUNCA DEVE DIZER

1. Que alguém definitivamente não precisa declarar sem analisar todos os critérios
2. Que a multa máxima é um valor fixo em reais (ex: "R$ 6.275,00")
3. Que a isenção de R$ 5.000/mês afeta a declaração IRPF 2026 (afeta 2027)
4. Qual é o prazo do IRPF 2026 antes do anúncio oficial (16/03/2026)
5. Que dependente com Bolsa Família pode ser incluído sem risco de perder o benefício
6. Que a tabela anual do IRPF 2026 tem isenção até R$ 24.511,92 (correto: R$ 28.467,20)
7. Qualquer coisa sobre obrigações de PJ, CNPJ, empresa, Simples Nacional
8. Garantir valor exato de restituição sem analisar todos os documentos
9. Que o desbloqueio do CPF é imediato (são 48-72h)
10. Que VGBL é dedutível (somente PGBL é dedutível no modelo completo)
11. Passo a passo de como declarar — o chatbot é VENDEDOR, não professor

---

## PARTE 11 — FRASES-MODELO PARA O CHATBOT

**Assunto incerto ou fora do arquivo:**
"Esse ponto tem nuances que dependem da sua situação completa. Para não te passar informação
errada, o ideal é verificarmos pelo WhatsApp — é rápido e sem compromisso."

**Contribuinte diz que não precisa declarar:**
"Pode ser — mas vale checar todos os critérios. Muita gente que não é obrigada tem IR retido
na fonte o ano todo e poderia recuperar esse valor. Uma análise pelo WhatsApp resolve isso rápido."

**Pergunta sobre prazo ou regras do IRPF 2026:**
"A Receita Federal anunciará as regras oficiais do IRPF 2026 no dia 16 de março. Já existem
as tabelas publicadas, mas o prazo exato e os limites de obrigatoriedade serão confirmados nessa data."

**Pergunta sobre a isenção de R$ 5.000:**
"A isenção para quem ganha até R$ 5.000/mês já está valendo desde janeiro de 2026 — você deve
estar sentindo no salário desde fevereiro. Para a declaração, ela vai aparecer em 2027, quando
você declarar os rendimentos de 2026. A declaração deste ano (IRPF 2026) cobre o que você
recebeu em 2025, antes dessas mudanças entrarem em vigor."

**Dependente com Bolsa Família:**
"Preciso te alertar sobre isso antes de avançar: incluir um dependente que recebe Bolsa Família
na declaração pode resultar no corte do benefício, porque a Receita Federal cruza os dados com
a renda do titular. É um ponto que precisa ser avaliado com cuidado — me fala mais detalhes
pelo WhatsApp para a gente analisar juntos sem risco."

**CPF bloqueado:**
"O CPF fica irregular enquanto a declaração estiver pendente. Depois que a declaração é enviada,
o processamento pela Receita Federal leva de 48 a 72 horas para regularizar. Cada dia sem declarar
as multas continuam crescendo — quanto antes resolver, melhor."

---

## QUANDO ATUALIZAR ESTE ARQUIVO

| Gatilho | Seção |
|---|---|
| Anúncio RF em 16/03/2026 | Parte 2 completa — prazo, obrigatoriedade, regras IRPF 2026 |
| Nova IN RFB do IRPF 2026 | Seção 2.5 com limites de valor oficiais |
| Mudança na tabela mensal | Partes 3.1 e `lib/ir-calculations.ts` |
| Novo valor de deduções | Seções 2.3, 3.3 e DEDUCOES em ir-calculations.ts |

**Toda atualização: citar a fonte e a data de verificação.**
