# Implementacao AdSense + Campanha Move Brasil

## 1) Diagnostico AdSense (causa provavel)

O script global do AdSense ja existia no layout, porem os blocos manuais dependiam de slot fixo e unico (`NEXT_PUBLIC_ADSENSE_SLOT_BLOG`).
Sem slots configurados corretamente no ambiente, os componentes retornavam vazios e pareciam "sem anuncios" mesmo com aprovacao da conta.

## 2) Arquivos ajustados

- `app/layout.tsx`
  - Conta AdSense agora usa `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` (com fallback).
  - Script global AdSense carregado uma unica vez e somente em producao (`irpf.qaplay.com.br`).
- `components/ads/AdUnit.tsx`
  - Componente resiliente com suporte a multiplos slots.
  - Suporte a `slot`, `format`, `minHeight` por instancia.
  - Warning amigavel em desenvolvimento quando env nao estiver configurada.
- `app/(site)/blog/[slug]/page.tsx`
  - Pontos de anuncio com moderacao:
    - apos imagem/introducao
    - bloco no meio/apos conteudo principal
    - sidebar
    - abaixo dos relacionados
- `.env.example`
  - Inclusao das variaveis publicas de AdSense e slots.

## 3) Variaveis de ambiente necessarias

```env
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_BLOG=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_MID_ARTICLE=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_BELOW_RELATED=1234567890
```

## 4) Como testar em producao

1. Confirmar dominio autorizado no AdSense (`irpf.qaplay.com.br`).
2. Publicar com variaveis acima no ambiente de producao.
3. Validar HTML final contendo:
   - meta `google-adsense-account`
   - script `adsbygoogle.js?client=ca-pub-...`
4. Abrir posts em aba anonima sem adblock.
5. Verificar console (sem `adsbygoogle.push` error).

## 5) Motivos externos para anuncios nao aparecerem mesmo com codigo correto

- Conta/slot ainda em fase de revisao.
- Tempo de propagacao do AdSense (pode levar horas).
- Adblock/antitracker no navegador.
- Bloqueio geografico/baixa demanda de inventario.
- Conteudo da pagina ainda insuficiente para entrega de anuncios em certos templates.

## 6) Campanha editorial manual Move Brasil (sem contaminar autopost)

Implementacao isolada em script manual:

- `scripts/seed-move-brasil-campaign.mjs`
  - Cria/atualiza 15 posts com tag `Move Brasil`.
  - Nao altera pipeline automatico de temas.
  - Posts publicados com:
    - title, slug, summary
    - content completo em HTML
    - FAQ em `faqsJson`
    - capa horizontal (>=1200)
    - alt text
    - metaTitle/metaDesc
    - interlinkagem interna
    - fontes externas oficiais
    - CTA de conversao sem promessa de aprovacao

Hub editorial criado:

- `app/(site)/blog/move-brasil/page.tsx`
  - Lista todos os posts com tag `Move Brasil`.
  - Inclui CTA e blocos de anuncio.

SEO tecnico:

- `app/sitemap.ts`
  - Inclusao da URL `/blog/move-brasil`.
- `app/(site)/blog/page.tsx`
  - Destaque visual para o hub Move Brasil.

## 7) Slugs da campanha

1. `move-brasil-como-se-cadastrar-financiar-carro-zero`
2. `saia-do-aluguel-de-carro-move-brasil-motoristas-aplicativo`
3. `move-brasil-aprova-financiamento-automaticamente`
4. `irpf-ajuda-comprovar-renda-financiamento-veiculo`
5. `como-comprovar-renda-uber-99-taxista-financiar-carro`
6. `quem-tem-direito-move-brasil-taxistas-motoristas-aplicativo`
7. `mei-motorista-aplicativo-pode-participar-move-brasil`
8. `cpf-irregular-atrapalha-financiamento-move-brasil`
9. `documentos-move-brasil-motorista-financiamento`
10. `carro-alugado-ou-financiado-motorista-aplicativo`
11. `move-brasil-chevrolet-ofertas-cuidados-analise-credito`
12. `move-brasil-bndes-juros-prazo-cadastro-cuidados`
13. `motorista-aplicativo-irpf-atrasado-comprovar-renda`
14. `checklist-motorista-financiamento-move-brasil`
15. `vale-a-pena-financiar-carro-move-brasil-ou-alugar`

## 8) URL para conferencias

- Hub: `https://irpf.qaplay.com.br/blog/move-brasil`
- Listagem blog: `https://irpf.qaplay.com.br/blog`
- Exemplo 1: `https://irpf.qaplay.com.br/blog/move-brasil-como-se-cadastrar-financiar-carro-zero`
- Exemplo 2: `https://irpf.qaplay.com.br/blog/move-brasil-aprova-financiamento-automaticamente`
- Exemplo 3: `https://irpf.qaplay.com.br/blog/irpf-ajuda-comprovar-renda-financiamento-veiculo`
