const BRAND = {
  siteUrl: "https://irpf.qaplay.com.br",
  adminLeadsUrl: "https://irpf.qaplay.com.br/painel-nb-2025/leads",
  whatsappUrl:
    "https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson%21%20Quero%20ajuda%20com%20meu%20IRPF%202026.",
};

type EmailButton = {
  label: string;
  href: string;
  tone?: "primary" | "secondary" | "whatsapp";
};

type EmailLayoutParams = {
  preheader: string;
  eyebrow: string;
  title: string;
  intro: string;
  bodyHtml: string;
  buttons?: EmailButton[];
  footerNote?: string;
};

type AdminNotificationParams = {
  kind: "lead" | "contato";
  nome: string;
  email: string;
  telefone?: string | null;
  origem?: string | null;
  servico?: string | null;
  mensagem?: string | null;
  whatsappUrl?: string | null;
};

type LeadWelcomeParams = {
  primeiroNome: string;
  diasRestantes: number;
};

type ContactConfirmationParams = {
  nome: string;
  servico?: string | null;
};

function escapeHtml(value?: string | null) {
  if (!value) return "";

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatServiceLabel(value?: string | null) {
  if (!value) return "Consultoria IRPF";

  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function renderButtons(buttons: EmailButton[] = []) {
  if (buttons.length === 0) return "";

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 12px 0;">
      <tr>
        ${buttons
          .map((button) => {
            const tone = button.tone ?? "primary";
            const styles = {
              primary:
                "background:#C6FF00;color:#050505;border:1px solid #C6FF00;",
              secondary:
                "background:transparent;color:#F5F5F2;border:1px solid #353535;",
              whatsapp:
                "background:#25D366;color:#04170B;border:1px solid #25D366;",
            } as const;

            return `
              <td style="padding:0 12px 12px 0;">
                <a href="${button.href}" style="display:inline-block;padding:14px 22px;font-size:12px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;text-decoration:none;${styles[tone]}">
                  ${escapeHtml(button.label)}
                </a>
              </td>
            `;
          })
          .join("")}
      </tr>
    </table>
  `;
}

function renderEmailLayout({
  preheader,
  eyebrow,
  title,
  intro,
  bodyHtml,
  buttons = [],
  footerNote,
}: EmailLayoutParams) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#050505;font-family:Arial,Helvetica,sans-serif;color:#F5F5F2;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050505;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#111111;border:1px solid #232323;">
            <tr>
              <td style="padding:18px 28px;background:#C6FF00;">
                <div style="font-size:11px;font-weight:900;letter-spacing:0.28em;text-transform:uppercase;color:#050505;">${escapeHtml(eyebrow)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 28px 28px 28px;">
                <h1 style="margin:0 0 14px 0;font-size:30px;line-height:1.12;color:#FFFFFF;">${escapeHtml(title)}</h1>
                <p style="margin:0 0 20px 0;font-size:15px;line-height:1.7;color:#CFCFCB;">${intro}</p>
                ${renderButtons(buttons)}
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px;border-top:1px solid #232323;">
                <p style="margin:0 0 10px 0;font-size:12px;line-height:1.7;color:#7E7E78;">
                  Nilson Brites • Analista Financeiro • Atendimento 100% online para todo o Brasil.
                </p>
                <p style="margin:0;font-size:11px;line-height:1.7;color:#5B5B56;">
                  ${footerNote || `Acesse <a href="${BRAND.siteUrl}" style="color:#C6FF00;text-decoration:none;">irpf.qaplay.com.br</a> para acompanhar os servicos e materiais atualizados.`}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderInfoTable(rows: Array<{ label: string; value: string }>) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:8px 0 0 0;">
      ${rows
        .map(
          (row) => `
            <tr>
              <td style="width:160px;padding:10px 0;border-bottom:1px solid #242424;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#76766F;vertical-align:top;">
                ${escapeHtml(row.label)}
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #242424;font-size:14px;line-height:1.6;color:#F5F5F2;vertical-align:top;">
                ${row.value}
              </td>
            </tr>
          `,
        )
        .join("")}
    </table>
  `;
}

export function buildLeadWelcomeEmail({
  primeiroNome,
  diasRestantes,
}: LeadWelcomeParams) {
  const urgencyBlock = `
    <div style="margin:26px 0;padding:18px 20px;background:#171717;border-left:4px solid #C6FF00;">
      <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#C6FF00;font-weight:800;">Prazo IRPF 2026</p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#D5D5D0;">Faltam <strong style="color:#FFFFFF;">${diasRestantes} dias</strong> para o prazo final de envio. Quanto antes organizarmos sua declaracao, maior a chance de aproveitar deducoes e evitar correria.</p>
    </div>
  `;

  const bodyHtml = `
    ${urgencyBlock}
    <div style="margin-top:24px;">
      <p style="margin:0 0 14px 0;font-size:14px;line-height:1.75;color:#CFCFCB;">Ja podemos acelerar seu atendimento por WhatsApp. Assim eu reviso seu caso, informo os documentos necessarios e te passo o melhor caminho para envio da declaracao.</p>
      <p style="margin:0 0 14px 0;font-size:14px;line-height:1.75;color:#CFCFCB;">Voce tera apoio para identificar pendencias, organizar comprovantes, transmitir a declaracao e acompanhar qualquer ajuste posterior.</p>
    </div>
    <div style="margin-top:24px;padding:18px 20px;border:1px solid #272727;">
      <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#C6FF00;font-weight:800;">Proximos passos</p>
      <ul style="margin:0;padding-left:18px;color:#E5E5E0;font-size:14px;line-height:1.9;">
        <li>Me envie uma mensagem com sua principal duvida ou situacao.</li>
        <li>Eu retorno com a orientacao inicial e a lista de documentos.</li>
        <li>Seguimos com a declaracao e transmissao oficial para a Receita.</li>
      </ul>
    </div>
  `;

  return renderEmailLayout({
    preheader: `${primeiroNome}, seu atendimento IRPF ja pode comecar no WhatsApp.`,
    eyebrow: "Consultoria IRPF NSB",
    title: `${primeiroNome}, recebemos seu contato.`,
    intro:
      "Seu atendimento foi registrado com sucesso. Se quiser ganhar tempo, o caminho mais rapido agora e falar comigo pelo WhatsApp para eu analisar seu caso e orientar os documentos necessarios.",
    bodyHtml,
    buttons: [
      {
        label: "Falar agora no WhatsApp",
        href: BRAND.whatsappUrl,
        tone: "whatsapp",
      },
      { label: "Ver o site", href: BRAND.siteUrl, tone: "secondary" },
    ],
  });
}

export function buildContactConfirmationEmail({
  nome,
  servico,
}: ContactConfirmationParams) {
  const primeiroNome = escapeHtml(nome.split(" ")[0] || nome);
  const serviceLabel = escapeHtml(formatServiceLabel(servico));

  const bodyHtml = `
    <div style="padding:18px 20px;background:#171717;border-left:4px solid #25D366;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;line-height:1.75;color:#D5D5D0;">Sua solicitacao sobre <strong style="color:#FFFFFF;">${serviceLabel}</strong> foi recebida. Se quiser acelerar o retorno, me chame no WhatsApp e eu priorizo a avaliacao do seu caso.</p>
    </div>
    <div style="padding:18px 20px;border:1px solid #272727;">
      <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#C6FF00;font-weight:800;">O que acontece agora</p>
      <ul style="margin:0;padding-left:18px;color:#E5E5E0;font-size:14px;line-height:1.9;">
        <li>Eu reviso sua mensagem e identifico o melhor atendimento.</li>
        <li>Voce recebe o retorno com orientacao inicial e proximo passo.</li>
        <li>Se preferir, seguimos tudo pelo WhatsApp com atendimento mais rapido.</li>
      </ul>
    </div>
    <p style="margin:22px 0 0 0;font-size:14px;line-height:1.75;color:#CFCFCB;">${primeiroNome}, o WhatsApp costuma ser o canal mais rapido para destravar duvidas sobre prazo, retificacao, atraso e malha fina.</p>
  `;

  return renderEmailLayout({
    preheader: `${nome}, sua mensagem foi recebida e pode continuar pelo WhatsApp.`,
    eyebrow: "Atendimento Nilson Brites",
    title: "Recebemos sua mensagem.",
    intro:
      "Seu contato entrou na fila de atendimento. Se quiser adiantar sua analise, me acione agora no WhatsApp para eu te responder com mais velocidade.",
    bodyHtml,
    buttons: [
      {
        label: "Continuar no WhatsApp",
        href: BRAND.whatsappUrl,
        tone: "whatsapp",
      },
      { label: "Abrir o site", href: BRAND.siteUrl, tone: "secondary" },
    ],
  });
}

export function buildAdminNotificationEmail({
  kind,
  nome,
  email,
  telefone,
  origem,
  servico,
  mensagem,
  whatsappUrl,
}: AdminNotificationParams) {
  const kindLabel = kind === "lead" ? "Novo lead" : "Novo contato";
  const rows = [
    { label: "Nome", value: escapeHtml(nome) || "Nao informado" },
    {
      label: "Email",
      value: `<a href="mailto:${escapeHtml(email)}" style="color:#C6FF00;text-decoration:none;">${escapeHtml(email)}</a>`,
    },
    { label: "Telefone", value: escapeHtml(telefone) || "Nao informado" },
    { label: "Origem", value: escapeHtml(origem) || "site" },
    { label: "Servico", value: escapeHtml(formatServiceLabel(servico)) },
    { label: "Mensagem", value: escapeHtml(mensagem) || "Sem mensagem" },
  ];

  return renderEmailLayout({
    preheader: `${kindLabel}: ${nome}`,
    eyebrow: "Painel Comercial IRPF",
    title: `${kindLabel} recebido no site`,
    intro:
      "O painel ja recebeu este registro. Abaixo esta o resumo completo para resposta rapida e contato imediato.",
    bodyHtml: renderInfoTable(rows),
    buttons: [
      ...(whatsappUrl
        ? [
            {
              label: "Abrir WhatsApp",
              href: whatsappUrl,
              tone: "whatsapp" as const,
            },
          ]
        : []),
      { label: "Abrir painel", href: BRAND.adminLeadsUrl, tone: "primary" },
    ],
    footerNote:
      "Este email foi enviado automaticamente pelo site. O painel do admin concentra o historico consolidado de leads e contatos.",
  });
}

// ─── Versões text/plain ───────────────────────────────────────────────────────

export function buildLeadWelcomeEmailText({
  primeiroNome,
  diasRestantes,
}: LeadWelcomeParams): string {
  return [
    `Olá, ${primeiroNome}.`,
    ``,
    `Seu atendimento foi registrado com sucesso na Consultoria IRPF NSB.`,
    ``,
    `Faltam ${diasRestantes} dias para o prazo final do IRPF 2026 (29 de maio de 2026).`,
    `Quanto antes organizarmos sua declaração, maior a chance de aproveitar deduções e evitar correria.`,
    ``,
    `Próximos passos:`,
    `1. Me envie uma mensagem com sua principal dúvida ou situação.`,
    `2. Eu retorno com orientação inicial e lista de documentos necessários.`,
    `3. Seguimos com a declaração e transmissão oficial para a Receita Federal.`,
    ``,
    `Falar pelo WhatsApp: https://wa.me/5511940825120`,
    ``,
    `—`,
    `Nilson Brites | Analista Financeiro`,
    `Consultoria IRPF NSB`,
    `${BRAND.siteUrl}`,
    ``,
    `Você recebe este email por ter solicitado atendimento em irpf.qaplay.com.br.`,
  ].join("\n");
}

export function buildContactConfirmationEmailText({
  nome,
  servico,
}: ContactConfirmationParams): string {
  const primeiroNome = nome.split(" ")[0] || nome;
  const serviceLabel = formatServiceLabel(servico);
  return [
    `Olá, ${primeiroNome}.`,
    ``,
    `Recebemos sua mensagem sobre ${serviceLabel}.`,
    ``,
    `O que acontece agora:`,
    `- Eu reviso sua mensagem e identifico o melhor atendimento.`,
    `- Você recebe o retorno com orientação inicial e próximo passo.`,
    `- Se preferir, seguimos pelo WhatsApp com atendimento mais rápido.`,
    ``,
    `Continuar no WhatsApp: https://wa.me/5511940825120`,
    ``,
    `—`,
    `Nilson Brites | Analista Financeiro`,
    `Consultoria IRPF NSB`,
    `${BRAND.siteUrl}`,
    ``,
    `Você recebe este email por ter entrado em contato em irpf.qaplay.com.br.`,
  ].join("\n");
}

export function buildAdminNotificationEmailText({
  kind,
  nome,
  email,
  telefone,
  origem,
  servico,
  mensagem,
  whatsappUrl,
}: AdminNotificationParams): string {
  const kindLabel = kind === "lead" ? "Novo lead" : "Novo contato";
  return [
    `${kindLabel}: ${nome}`,
    ``,
    `Email: ${email}`,
    `Telefone: ${telefone || "Não informado"}`,
    `Origem: ${origem || "site"}`,
    `Serviço: ${formatServiceLabel(servico)}`,
    `Mensagem: ${mensagem || "Sem mensagem"}`,
    ``,
    ...(whatsappUrl ? [`Abrir WhatsApp: ${whatsappUrl}`, ``] : []),
    `Painel admin: ${BRAND.adminLeadsUrl}`,
  ].join("\n");
}

// ─── Template de Ebook ────────────────────────────────────────────────────────

export function buildEbookEmailHtml(nome: string): string {
  const primeiroNome = escapeHtml(nome.split(" ")[0] || nome);

  const bodyHtml = `
    <div style="margin:0 0 22px 0;padding:18px 20px;background:#171717;border-left:4px solid #C6FF00;">
      <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#C6FF00;font-weight:800;">Seu material chegou</p>
      <p style="margin:0;font-size:14px;line-height:1.75;color:#D5D5D0;">O link de acesso ao Guia Completo do IRPF esta disponivel abaixo. Este material reune as principais regras, prazos e dicas praticas para sua declaracao 2026.</p>
    </div>
    <div style="margin:0 0 24px 0;padding:18px 20px;border:1px solid #272727;">
      <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#C6FF00;font-weight:800;">O que voce encontra no guia</p>
      <ul style="margin:0;padding-left:18px;color:#E5E5E0;font-size:14px;line-height:1.9;">
        <li>Quem e obrigado a declarar em 2026</li>
        <li>Documentos necessarios e prazo de entrega</li>
        <li>Principais deducoes permitidas por lei</li>
        <li>Como evitar cair na malha fina</li>
        <li>O que fazer se voce tiver pendencias</li>
      </ul>
    </div>
    <p style="margin:0 0 14px 0;font-size:14px;line-height:1.75;color:#CFCFCB;">Se tiver duvidas ou quiser ajuda com a declaracao, me chame pelo WhatsApp. Atendimento 100% online para todo o Brasil.</p>
  `;

  return renderEmailLayout({
    preheader: `${primeiroNome}, seu Guia IRPF 2026 esta disponivel.`,
    eyebrow: "Consultoria IRPF NSB",
    title: `${primeiroNome}, seu guia chegou.`,
    intro:
      "Obrigado pelo interesse. Seu Guia Completo do IRPF 2026 esta pronto para acesso. Qualquer duvida sobre sua situacao fiscal, estamos a disposicao.",
    bodyHtml,
    buttons: [
      {
        label: "Falar com Nilson no WhatsApp",
        href: BRAND.whatsappUrl,
        tone: "whatsapp",
      },
      { label: "Acessar o site", href: BRAND.siteUrl, tone: "secondary" },
    ],
  });
}

export function buildEbookEmailText(nome: string): string {
  const primeiroNome = nome.split(" ")[0] || nome;
  return [
    `Olá, ${primeiroNome}.`,
    ``,
    `Obrigado pelo interesse no Guia Completo do IRPF 2026.`,
    ``,
    `O que você encontra no guia:`,
    `- Quem é obrigado a declarar em 2026`,
    `- Documentos necessários e prazo de entrega`,
    `- Principais deduções permitidas por lei`,
    `- Como evitar cair na malha fina`,
    `- O que fazer se você tiver pendências`,
    ``,
    `Se tiver dúvidas ou quiser ajuda com a declaração, me chame pelo WhatsApp.`,
    `Atendimento 100% online para todo o Brasil.`,
    ``,
    `WhatsApp: https://wa.me/5511940825120`,
    ``,
    `—`,
    `Nilson Brites | Analista Financeiro`,
    `Consultoria IRPF NSB`,
    `${BRAND.siteUrl}`,
    ``,
    `Você recebe este email por ter solicitado o material em irpf.qaplay.com.br.`,
  ].join("\n");
}
