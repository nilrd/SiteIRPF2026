# EMAIL_DELIVERABILITY_CHECKLIST.md
**Site:** irpf.qaplay.com.br | **Provedor:** Resend | **Atualizado:** 2026-05-18

---

## 1. Domínio e DNS

### Pré-requisito: qual domínio está verificado no Resend?
- Acesse [resend.com/domains](https://resend.com/domains)
- Confirme se o domínio está com status **Verified** (ícone verde)
- **Domínio verificado atual:** `qaplay.com.br`
- **O `FROM_EMAIL` no Vercel deve usar EXATAMENTE o domínio verificado**
- `irpf.qaplay.com.br` só deve ser usado no FROM após ser verificado separadamente no Resend

> **FROM_EMAIL recomendado:** `Consultoria IRPF NSB <noreply@qaplay.com.br>`
> Todos os emails transacionais usam `FROM_EMAIL` (env). O fallback do código também aponta para `qaplay.com.br`.

---

### 1.1 SPF (Sender Policy Framework)
- [ ] O registro SPF do domínio inclui o servidor do Resend
- [ ] Verificar com: `nslookup -type=TXT qaplay.com.br` ou [MXToolbox SPF](https://mxtoolbox.com/spf.aspx)
- Formato esperado (genérico):
  ```
  v=spf1 include:_spf.resend.com ~all
  ```
- O `~all` (softfail) é mais seguro para começar; migrar para `-all` após validar

### 1.2 DKIM (DomainKeys Identified Mail)
- [ ] Registro DKIM adicionado no DNS conforme fornecido pelo Resend
- [ ] Painel Resend → Domains → seu domínio → status "Verified" para DKIM
- [ ] Verificar com: [MXToolbox DKIM](https://mxtoolbox.com/dkim.aspx)
- O valor exato do registro DKIM deve ser copiado do painel Resend (não inventar)

### 1.3 DMARC
- [ ] Registro DMARC adicionado no DNS
- Política recomendada para início (monitoramento):
  ```
  v=DMARC1; p=none; rua=mailto:nilson.brites@gmail.com
  ```
- Após confirmar que SPF e DKIM passam, evoluir para `p=quarantine` e depois `p=reject`
- Verificar com: `nslookup -type=TXT _dmarc.qaplay.com.br`

### 1.4 MX Record (apenas para domínio raiz, se aplicável)
- Se o domínio recebe emails: confirmar MX configurado
- Se for apenas para envio transacional: não é obrigatório, mas recomendado ter pelo menos um

---

## 2. Configuração no Resend

- [ ] API Key ativa (`RESEND_API_KEY` no Vercel → Environment Variables)
- [ ] Domínio verificado com status "Verified" no painel
- [ ] `FROM_EMAIL` no Vercel usa o mesmo domínio verificado
- [ ] `ADMIN_EMAIL` no Vercel configurado com email real de destino
- [ ] Resend Webhooks (opcional): configurar para receber bounces e reclamações

---

## 3. Variáveis de Ambiente no Vercel

Confirmar no painel Vercel → Settings → Environment Variables:

| Variável | Valor esperado |
|---|---|
| `RESEND_API_KEY` | `re_...` (nunca expor em logs) |
| `FROM_EMAIL` | `Nilson Brites \| Consultoria IRPF <noreply@DOMÍNIO_VERIFICADO>` |
| `ADMIN_EMAIL` | `nilson.brites@gmail.com` |

---

## 4. Conteúdo dos Emails — Checklist Anti-SPAM

### Assuntos ✅ (após esta sprint)
- `Recebemos sua solicitação — Consultoria IRPF NSB`
- `Recebemos sua mensagem — Consultoria IRPF NSB`
- `Documentos necessários para declarar seu IRPF 2026`
- `Caso real: como Marcos regularizou e recebeu a restituição retida`
- `Antes do prazo: ainda dá tempo para o IRPF 2026, {nome}`
- `Seu Guia IRPF chegou — acesse o material completo`

### Evitar nos assuntos
- Maiúsculas excessivas: URGENTE, ÚLTIMO, BLOQUEADO
- Promessas: "garantido", "grátis" no início
- Pontuação excessiva: `!!!`, `???`

### Corpo do email
- [ ] Todo email tem `html` + `text` (text/plain) — ✅ após esta sprint
- [ ] HTML usa tabelas (não divs) para compatibilidade com Outlook
- [ ] Sem imagens inline em base64 — usar links de CDN se necessário
- [ ] Máximo 2–3 links por email
- [ ] Remetente consistente (mesmo domínio em todos os emails)
- [ ] Preheader configurado (texto oculto após o assunto no preview)
- [ ] Rodapé informa por que o usuário recebe o email

---

## 5. Testes de Entregabilidade

### Ferramentas recomendadas
1. **[mail-tester.com](https://www.mail-tester.com)** — Score de 0-10, identifica problemas de SPF/DKIM/conteúdo
2. **[MXToolbox Email Health](https://mxtoolbox.com/emailhealth.aspx)** — Verifica SPF, DKIM, DMARC, blacklists
3. **[Google Postmaster Tools](https://postmaster.google.com)** — Reputação do domínio para Gmail
4. **[Resend Logs](https://resend.com/emails)** — Histórico de envios, bounces, cliques

### Checklist de teste
- [ ] Enviar email de teste para Gmail pessoal
- [ ] Verificar se caiu em Inbox, Promoções ou Spam
- [ ] Abrir "Mostrar original" no Gmail → confirmar `dkim=pass` e `spf=pass`
- [ ] Testar com mail-tester.com → meta: score ≥ 8/10
- [ ] Testar abertura no mobile (Gmail app, Outlook mobile)

---

## 6. Reputação e Aquecimento

- [ ] Domínio novo (<3 meses) precisa de aquecimento gradual (10→50→200 emails/dia)
- [ ] Nunca enviar para listas compradas ou não confirmadas
- [ ] Implementar link de descadastro (unsubscribe) nas sequências de email
- [ ] Monitorar bounce rate — manter abaixo de 2%
- [ ] Monitorar spam complaints — manter abaixo de 0,1%

---

## 7. Próximos Passos Prioritários

1. **Confirmar domínio verificado** no painel Resend
2. **Atualizar `FROM_EMAIL`** no Vercel para usar o domínio verificado
3. **Verificar SPF** com nslookup ou MXToolbox
4. **Adicionar DMARC** `p=none` para começar monitoramento
5. **Testar envio** com mail-tester.com e verificar score
6. **Adicionar link de descadastro** na sequência de emails (melhoria futura)
7. **Integrar Google Postmaster Tools** para monitorar reputação com Gmail
