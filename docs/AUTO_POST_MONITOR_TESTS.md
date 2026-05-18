# AUTO POST MONITOR TESTS

## TESTE 1 - Cron de Trends
Passos:
1. Chamar `GET /api/cron/trend-research?secret=<CRON_SECRET>`.

Esperado:
- HTTP 200.
- `ok=true`.
- `fromCache` true ou false.
- `modes` contem `IRPF_URGENT` e/ou `DASN_URGENT` quando aplicavel.
- `trend_keywords` populada ou cache retornado.
- `api_quotas` respeitando limite 8/dia e 250/mes.

## TESTE 2 - Supabase Trends
SQL:
```sql
SELECT keyword, source, category, trend_score, cached_until, created_at
FROM trend_keywords
ORDER BY created_at DESC
LIMIT 20;
```

Esperado:
- keywords recentes;
- `source` preenchido;
- `category` preenchida;
- `cached_until` preenchido.

## TESTE 3 - Supabase Quota
SQL:
```sql
SELECT api_name, date, calls_used, calls_limit, month_calls_used, month_calls_limit
FROM api_quotas
ORDER BY date DESC
LIMIT 10;
```

Esperado:
- `api_name = serpapi`;
- `calls_used` nunca maior que `calls_limit`;
- `month_calls_used` nunca maior que `month_calls_limit`.

## TESTE 4 - Gerar post IRPF controlado
Passos:
1. Chamar `GET /api/cron/blog-auto?secret=<CRON_SECRET>`.

Esperado:
- post criado;
- `aiModel` preenchido;
- categoria `IRPF`;
- `needsReview` coerente;
- `factScore`/`riskScore` quando aplicavel;
- se houver risco, `published=false`.

## TESTE 5 - Gerar post MEI controlado
Passos:
1. Chamar `GET /api/cron/blog-mei?secret=<CRON_SECRET>`.

Esperado:
- post criado;
- `aiModel` preenchido;
- categoria `MEI`;
- `published` conforme regra atual;
- fallback antigo permanece funcional.

## TESTE 6 - Monitor principal simplificado
Passos:
1. Abrir `/painel-nb-2025/blog`.

Esperado:
- pagina mais limpa;
- resumo curto do Auto Post;
- botao/link para monitoramento completo;
- lista de posts continua funcional.

## TESTE 7 - Pagina de monitoramento completo
Passos:
1. Abrir `/painel-nb-2025/blog/monitoramento`.

Esperado:
- metricas completas visiveis;
- labels claros;
- `STARTED` antigo exibido como `TIMEOUT/STALE`;
- posts antigos sem rastreio nao tratados como erro critico;
- alertas compreensiveis.

## TESTE 8 - Acoes do blog continuam funcionando
Passos:
1. Editar post.
2. Publicar/despublicar.
3. Deletar.
4. Ver post.
5. GPT-img.
6. Flux.

Esperado:
- nenhuma acao quebrada pela separacao do monitor.
