// Dados oficiais IRPF 2026 — atualização publicada em 16/03/2026
// Fontes: Receita Federal (DOU) + cobertura jornalística econômica (G1)
// Este arquivo é injetado como contexto fixo nos prompts de geração do blog.

export const IRPF_DATA_CONTEXT = `
====================================================
DADOS OFICIAIS IRPF 2026 — USO OBRIGATÓRIO EXCLUSIVO
(Atualizado em 16/03/2026 com publicação no DOU)
====================================================

PRAZOS IRPF 2026 (OFICIAL — Receita Federal / DOU em 16/03/2026):
- Início da declaração: 23 de março de 2026
- Fim da declaração: 29 de maio de 2026
- Lote 1 de restituições: junho de 2026
- Último lote de restituições: 30 de setembro de 2026
- Multa mínima por atraso: R$ 165,74 ou 1% ao mês sobre o imposto devido, limitado a 20%

OBRIGATORIEDADE — quem DEVE declarar em 2026 (ano-base 2025):
- Rendimentos tributáveis acima de R$ 35.584,00 em 2025
- Rendimentos isentos/não tributáveis/exclusivos na fonte acima de R$ 200.000,00
- Ganhos de capital na alienação de bens
- Operações em bolsa (salvo isenção ≤ R$ 20.000/mês no mercado à vista)
- Bens e direitos acima de R$ 800.000,00 em 31/12/2025
- Atividade rural com receita bruta acima de R$ 177.920,00
- Passou à condição de residente no Brasil em qualquer mês de 2025

TABELA PROGRESSIVA IRPF 2026 — mensal (Lei 15.270/2025):
- Até R$ 2.428,80/mês:              isento
- R$ 2.428,81 a R$ 2.826,65:        7,5%  (dedução: R$ 182,16)
- R$ 2.826,66 a R$ 3.751,05:        15%   (dedução: R$ 394,16)
- R$ 3.751,06 a R$ 4.664,68:        22,5% (dedução: R$ 675,49)
- Acima de R$ 4.664,68:             27,5% (dedução: R$ 908,73)

ISENÇÃO EFETIVA ATÉ R$ 5.000 — mecânica CORRETA (Lei 15.270/2025):
- NÃO é isenção total automática para quem ganha até R$ 5.000
- É isenção EFETIVA via dedução especial/complementar de R$ 1.571,19
- Quem usa o desconto simplificado com rendimento mensal até R$ 5.000 tem imposto zero na prática
- Quem declara pelo modelo completo calcula conforme a tabela progressiva acima
- PROIBIDO dizer "quem ganha até R$ 5.000 não paga imposto" sem explicar a mecânica da dedução especial

DEDUÇÕES PERMITIDAS (IRPF 2026):
- Saúde: sem limite (com comprovante — médico, dentista, plano de saúde, hospital)
- Educação: até R$ 3.561,50 por dependente (própria ou dependente)
- Dependente: R$ 2.275,08/ano por dependente cadastrado
- Pensão alimentícia: valor integral (somente com decisão judicial ou acordo homologado)
- Previdência oficial (INSS): valor integral das contribuições
- Previdência privada PGBL: até 12% da renda bruta tributável
- Contribuição patronal do MEI: dedutível

FONTES OFICIAIS (ÚNICAS ACEITAS PARA CITAR VALORES E PRAZOS):
- Receita Federal: https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda
- Lei 15.270/2025: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm
- IN RFB 2.255/2025: https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/dirpf
- G1 Economia (síntese jornalística da publicação no DOU em 16/03/2026): https://g1.globo.com/economia/imposto-de-renda/noticia/2026/03/16/imposto-de-renda-2026-prazo-comeca-em-23-marco-e-se-estende-ate-29-de-maio-veja-quem-deve-declarar.ghtml
====================================================
`.trim();
