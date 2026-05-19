# EMAIL_TESTS.md
**Site:** irpf.qaplay.com.br | **Atualizado:** 2026-05-18

Checklist de testes manuais para validar os emails após a sprint de entregabilidade.

---

## 1. Teste de Formulário de Lead

**Acesso:** `https://irpf.qaplay.com.br` → preencher formulário principal

- [ ] Preencher formulário com email real de teste
- [ ] Confirmar que o lead aparece no painel admin `/painel-nb-2025/leads`
- [ ] **Usuário recebe:** assunto `Recebemos sua solicitação — Consultoria IRPF NSB`
- [ ] Email do usuário: tem cabeçalho verde #C6FF00, corpo legível, botão WhatsApp
- [ ] Email do usuário: tem versão text/plain (verificar em "Mostrar original" no Gmail)
- [ ] **Admin recebe:** assunto `[Lead] Nome — IRPF`
- [ ] Email admin: lista nome, email, telefone, origem, serviço, mensagem
- [ ] Verificar remetente: deve usar domínio verificado (não `onboarding@resend.dev`)
- [ ] Verificar se caiu em Inbox, Promoções ou Spam

---

## 2. Teste de Formulário de Contato

**Acesso:** `https://irpf.qaplay.com.br/contato` ou modal de contato

- [ ] Preencher formulário de contato com email real
- [ ] **Usuário recebe:** assunto `Recebemos sua mensagem — Consultoria IRPF NSB`
- [ ] Email do usuário: layout profissional com botão WhatsApp
- [ ] Email do usuário: text/plain presente
- [ ] **Admin recebe:** assunto `[Contato] Nome`
- [ ] Email admin: tem detalhes completos do contato
- [ ] Remetente consistente com o email de lead

---

## 3. Teste de Ebook

**Acesso:** formulário de ebook no site

- [ ] Preencher nome e email para download do ebook
- [ ] **Usuário recebe:** assunto `Seu Guia IRPF chegou — acesse o material completo`
- [ ] Email tem layout profissional (não HTML simples com `<h2>` solto)
- [ ] Email tem text/plain
- [ ] Remetente usa domínio verificado (não hardcoded `irpf.qaplay.com.br` se diverge do env)

---

## 4. Teste de Sequência de Emails (email-sequence)

**Como testar:**
- Criar lead de teste no banco com `emailSeqStep: 1` e `createdAt: 2+ dias atrás`
- Chamar manualmente: `GET /api/cron/email-sequence?secret=xP9aKm2wR4nQ7vL3hT8uY6sZ`

- [ ] **Email 2 (dia 2):** assunto `Documentos necessários para declarar seu IRPF 2026`
  - [ ] Tem lista de documentos no HTML
  - [ ] Tem text/plain com a mesma lista
- [ ] **Email 3 (dia 4):** assunto `Caso real: como Marcos regularizou e recebeu a restituição retida`
  - [ ] Tem depoimento e lista de erros comuns
  - [ ] Tem text/plain
- [ ] **Email 4 (dia 7):** assunto `X dias para o prazo do IRPF 2026 — você já declarou?`
  - [ ] Mostra contagem regressiva e consequências
  - [ ] Sem linguagem agressiva
  - [ ] Tem text/plain
- [ ] **Email 5 (dia 10):** assunto `Antes do prazo: ainda dá tempo para o IRPF 2026, {nome}`
  - [ ] **Sem "ÚLTIMO AVISO:" no assunto** (era risco de spam — corrigido)
  - [ ] Tem text/plain

---

## 5. Verificações Técnicas por Email

Para cada email recebido no Gmail, verificar:

1. [ ] Clicar em "..." → "Mostrar original"
2. [ ] Confirmar `Authentication-Results: dkim=pass`
3. [ ] Confirmar `Authentication-Results: spf=pass`
4. [ ] Confirmar `from:` usa o domínio verificado
5. [ ] Verificar que não há `X-Spam-Status: Yes`

---

## 6. Teste Visual e Responsivo

- [ ] Abrir email no Gmail desktop — layout renderiza corretamente
- [ ] Abrir email no Gmail mobile (Android/iOS) — legível em tela pequena
- [ ] Abrir email no Outlook — tabelas se mantêm
- [ ] Preheader aparece na prévia da caixa de entrada (antes de abrir o email)
- [ ] Botão CTA está clicável e redireciona corretamente (WhatsApp ou site)
- [ ] Links do rodapé funcionam (site + possíveis links de suporte)

---

## 7. Teste de Entregabilidade com mail-tester.com

1. Acesse [https://www.mail-tester.com](https://www.mail-tester.com)
2. Copie o endereço temporário gerado
3. Envie um email de teste para esse endereço (acionar formulário do site)
4. Clique em "Verifique a pontuação"
5. [ ] Score esperado: ≥ 8/10
6. [ ] Verificar itens em vermelho e corrigir conforme indicado

---

## 8. Checklist Final de Aprovação

- [ ] Todos os emails chegam na Inbox (não Spam) para Gmail
- [ ] Assuntos são descritivos e não agressivos
- [ ] Remetente é consistente e profissional
- [ ] HTML renderiza corretamente em desktop e mobile
- [ ] text/plain presente em todos os emails
- [ ] DKIM e SPF passam na verificação
- [ ] Score mail-tester.com ≥ 8/10
