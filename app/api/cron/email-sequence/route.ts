import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CRON_SECRET = "xP9aKm2wR4nQ7vL3hT8uY6sZ";
const WA_LINK = "https://wa.me/5511940825120?text=Ol%C3%A1%20Nilson%21%20Quero%20declarar%20meu%20IRPF%202026.";
const FROM = "Nilson Brites — IRPF <noreply@irpf.qaplay.com.br>";
const SITE_URL = "https://irpf.qaplay.com.br";

/* ── Email Templates ──────────────────────────────────────── */

function emailBase(title: string, preheader: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;color:#0A0A0A;">${preheader}</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border:1px solid #222222;">
          <!-- Header -->
          <tr>
            <td style="background:#C6FF00;padding:16px 32px;">
              <p style="margin:0;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:3px;color:#000000;">Consultoria IRPF NSB — Nilson Brites</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;color:#F5F5F2;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #222222;">
              <p style="margin:0;font-size:10px;color:#555555;line-height:1.6;">
                Você recebe este email por ter solicitado atendimento em <a href="${SITE_URL}" style="color:#C6FF00;">${SITE_URL}</a>.<br/>
                Nilson Brites | Analista Financeiro — IRPF | irpf.qaplay.com.br
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

function ctaButton(text: string, href: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td style="background:#C6FF00;">
        <a href="${href}" style="display:inline-block;padding:16px 32px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#000000;text-decoration:none;">${text}</a>
      </td>
    </tr>
  </table>`;
}

/* Email 2 — day 2 */
function email2(nome: string): string {
  return emailBase(
    "Documentos para sua declaração IRPF 2026",
    "Tudo que você precisa separar para declarar seu IRPF 2026 sem estresse",
    `<h2 style="font-size:24px;font-weight:900;text-transform:uppercase;color:#FFFFFF;margin:0 0 16px 0;">Olá, ${nome}!</h2>
    <p style="font-size:14px;color:#AAAAAA;line-height:1.7;margin:0 0 16px 0;">Para agilizarmos sua declaração de IRPF 2026, preparei a lista completa de documentos que você precisa ter em mãos.</p>
    <h3 style="font-size:13px;color:#C6FF00;text-transform:uppercase;letter-spacing:2px;margin:24px 0 12px 0;">Documentos obrigatórios:</h3>
    <ul style="padding-left:16px;margin:0 0 16px 0;color:#AAAAAA;font-size:13px;line-height:2;">
      <li>CPF e dados pessoais (nome completo, data de nascimento, título de eleitor)</li>
      <li>Informes de rendimentos do empregador (Informe de Rendimentos)</li>
      <li>Extrato de rendimentos bancários (conta corrente, poupança, CDB)</li>
      <li>Informes de rendimentos de previdência privada (PGBL/VGBL)</li>
      <li>Comprovantes de pagamento de plano de saúde</li>
      <li>Recibos de consultas médicas, exames e tratamentos</li>
      <li>Comprovante de pagamento de escola, faculdade ou pós-graduação (você e dependentes)</li>
      <li>Dados dos dependentes: CPF, nome completo, data de nascimento</li>
      <li>Escrituras de imóveis, veículos e outros bens</li>
      <li>Extrato de operações em bolsa de valores (Nota de Corretagem)</li>
    </ul>
    <p style="font-size:13px;color:#AAAAAA;line-height:1.7;margin:0 0 8px 0;"><strong style="color:#FFFFFF;">Lembrete importante:</strong> O prazo do IRPF 2026 é <strong style="color:#C6FF00;">29 de maio</strong>. Já temos apenas poucos dias disponíveis. Quanto antes você enviar, melhor.</p>
    ${ctaButton("Enviar Meus Documentos — WhatsApp →", WA_LINK)}
    <p style="font-size:12px;color:#555555;margin:16px 0 0 0;">Qualquer dúvida sobre os documentos, é só responder este email ou me chamar no WhatsApp.</p>`
  );
}

/* Email 3 — day 4 */
function email3(nome: string): string {
  return emailBase(
    "Como Marcos economizou R$ 1.247 e saiu da malha fina",
    "Esse caso real pode se aplicar à sua situação também",
    `<h2 style="font-size:24px;font-weight:900;text-transform:uppercase;color:#FFFFFF;margin:0 0 16px 0;">${nome}, veja esse caso real:</h2>
    <p style="font-size:14px;color:#AAAAAA;line-height:1.7;margin:0 0 16px 0;">Marcos Almeida, engenheiro de 42 anos em São Paulo, descobriu que havia caído na malha fina por um erro na declaração do ano anterior. O IRPF estava retido, a restituição bloqueada — e ele nem sabia.</p>
    <div style="background:#1A1A1A;border-left:3px solid #C6FF00;padding:16px 20px;margin:24px 0;">
      <p style="font-size:13px;color:#AAAAAA;line-height:1.7;margin:0 0 8px 0;"><em>"Fui entrar em contato com o Nilson achando que o problema seria enorme. Em 48 horas ele identificou o erro, fez a retificação e minha restituição de R$ 1.247 foi liberada. Foi mais simples do que eu pensava."</em></p>
      <p style="font-size:11px;color:#666666;margin:0;">— Marcos A., São Paulo, SP</p>
    </div>
    <p style="font-size:14px;color:#AAAAAA;line-height:1.7;margin:16px 0;">Erros comuns que colocam contribuintes na malha fina:</p>
    <ul style="padding-left:16px;margin:0 0 16px 0;color:#AAAAAA;font-size:13px;line-height:2;">
      <li>Divergência entre o que você declarou e o que o empregador informou</li>
      <li>Deduções médicas sem comprovante ou com CPF incorreto do médico</li>
      <li>Dependentes declarados por mais de uma pessoa</li>
      <li>Rendimentos de aluguéis não declarados ou declarados errado</li>
      <li>Omissão de rendimentos de trabalho autônomo (RPA, notas fiscais)</li>
    </ul>
    <p style="font-size:14px;color:#FFFFFF;margin:16px 0;font-weight:bold;">Se você suspeita de algum erro ou está com a restituição retida, posso analisar sem custo adicional.</p>
    ${ctaButton("Quero Verificar Minha Situação — WhatsApp →", WA_LINK)}`
  );
}

/* Email 4 — day 7 */
function email4(nome: string, diasRestantes: number): string {
  return emailBase(
    `${diasRestantes} dias para o prazo — ${nome}, você já declarou?`,
    "O relógio está correndo. Veja o que pode acontecer se você não declarar",
    `<div style="background:#C6FF00;padding:16px 20px;margin:0 0 24px 0;text-align:center;">
      <p style="margin:0;font-size:28px;font-weight:900;color:#000000;">${diasRestantes}</p>
      <p style="margin:4px 0 0 0;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#000000;">dias restantes para o prazo IRPF 2026</p>
    </div>
    <h2 style="font-size:22px;font-weight:900;text-transform:uppercase;color:#FFFFFF;margin:0 0 16px 0;">Olá, ${nome}. O tempo está acabando.</h2>
    <p style="font-size:14px;color:#AAAAAA;line-height:1.7;margin:0 0 16px 0;">O prazo do IRPF 2026 é <strong style="color:#C6FF00;">29 de maio de 2026</strong>. Se você ainda não declarou, este é o momento ideal para agir — antes que a demanda aumente e os prazos fiquem ainda mais apertados.</p>
    <h3 style="font-size:13px;color:#FF4444;text-transform:uppercase;letter-spacing:2px;margin:24px 0 12px 0;">O que acontece se você não declarar:</h3>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 16px 0;">
      <tr>
        <td style="padding:10px 12px;background:#1A0000;border-bottom:1px solid #330000;color:#FF6666;font-size:12px;">⚠️ Multa mínima de <strong>R$ 165,74</strong></td>
      </tr>
      <tr>
        <td style="padding:10px 12px;background:#1A0000;border-bottom:1px solid #330000;color:#FF6666;font-size:12px;">⚠️ Juros de <strong>1% ao mês</strong> sobre o imposto devido (máx. 20%)</td>
      </tr>
      <tr>
        <td style="padding:10px 12px;background:#1A0000;border-bottom:1px solid #330000;color:#FF6666;font-size:12px;">⚠️ <strong>CPF irregular</strong> — impossibilidade de financiamentos, aprovação de crédito, passaporte</td>
      </tr>
      <tr>
        <td style="padding:10px 12px;background:#1A0000;color:#FF6666;font-size:12px;">⚠️ Risco de <strong>ação de cobrança</strong> pela Receita Federal</td>
      </tr>
    </table>
    <p style="font-size:14px;color:#FFFFFF;margin:16px 0;font-weight:bold;">Ainda dá tempo de regularizar. Me chame agora no WhatsApp e declaramos juntos antes do prazo.</p>
    ${ctaButton("Declarar Agora — WhatsApp →", WA_LINK)}`
  );
}

/* Email 5 — day 10, final */
function email5(nome: string, diasRestantes: number): string {
  return emailBase(
    `ÚLTIMO AVISO: ${diasRestantes} dias para o prazo — ${nome}`,
    "Esse é o último lembrete antes do prazo fatal IRPF 2026",
    `<div style="text-align:center;padding:24px 0 32px 0;">
      <p style="font-size:60px;font-weight:900;color:#C6FF00;margin:0;line-height:1;">${diasRestantes}</p>
      <p style="font-size:12px;text-transform:uppercase;letter-spacing:3px;color:#555555;margin:8px 0 0 0;">dias restantes</p>
    </div>
    <h2 style="font-size:22px;font-weight:900;text-transform:uppercase;color:#FFFFFF;margin:0 0 16px 0;text-align:center;">Este é meu último lembrete para você, ${nome}.</h2>
    <p style="font-size:14px;color:#AAAAAA;line-height:1.7;margin:0 0 16px 0;">Se você ainda não declarou o IRPF 2026, este é <strong style="color:#FFFFFF;">o momento crítico para agir</strong>. Com ${diasRestantes} dias restantes, ainda há tempo — mas a janela está se fechando.</p>
    <p style="font-size:14px;color:#AAAAAA;line-height:1.7;margin:0 0 24px 0;">Os últimos dias antes do prazo costumam ter alta demanda. Para garantir que sua declaração seja transmitida dentro do prazo, <strong style="color:#C6FF00;">me chame agora</strong> e priorizamos o seu atendimento.</p>
    <div style="background:#1A1A1A;padding:20px 24px;margin:0 0 24px 0;border:1px solid #C6FF00;">
      <p style="margin:0 0 8px 0;font-size:13px;color:#C6FF00;font-weight:900;text-transform:uppercase;letter-spacing:1px;">O que você recebe:</p>
      <ul style="padding-left:16px;margin:0;color:#AAAAAA;font-size:13px;line-height:2;">
        <li>Declaração completa transmitida à Receita Federal</li>
        <li>Recibo oficial de entrega da declaração</li>
        <li>Suporte gratuito por 12 meses</li>
        <li>Análise de todas as deduções legais aplicáveis</li>
      </ul>
    </div>
    ${ctaButton("Falar com Nilson Agora — WhatsApp →", WA_LINK)}
    <p style="font-size:12px;color:#555555;margin:16px 0 0 0;text-align:center;">Após 29 de maio, o serviço continua disponível para declarações atrasadas — mas as multas e juros aumentam a cada dia.</p>`
  );
}

/* ── Cron Handler ───────────────────────────────────────────── */

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const now = new Date();
    const prazo = new Date("2026-05-29T23:59:59-03:00");
    const diasRestantes = Math.max(
      0,
      Math.ceil((prazo.getTime() - now.getTime()) / 86400000)
    );

    const leads = await prisma.lead.findMany({
      where: { emailSeqStep: { lt: 5 }, email: { not: "" } },
      select: { id: true, nome: true, email: true, emailSeqStep: true, createdAt: true },
    });

    const results = { sent: 0, skipped: 0, errors: 0 };

    for (const lead of leads) {
      const daysSinceCreation = Math.floor(
        (now.getTime() - lead.createdAt.getTime()) / 86400000
      );

      // Step rules: step 0 is sent at creation; cron handles steps 1-4
      // step 1 → send email #2 at day 2
      // step 2 → send email #3 at day 4
      // step 3 → send email #4 at day 7
      // step 4 → send email #5 at day 10
      const stepThresholds: Record<number, number> = { 1: 2, 2: 4, 3: 7, 4: 10 };
      const threshold = stepThresholds[lead.emailSeqStep];

      if (!threshold || daysSinceCreation < threshold) {
        results.skipped++;
        continue;
      }

      let subject = "";
      let html = "";

      if (lead.emailSeqStep === 1) {
        subject = "Documentos necessários para declarar seu IRPF 2026";
        html = email2(lead.nome.split(" ")[0]);
      } else if (lead.emailSeqStep === 2) {
        subject = "Case real: como Marcos economizou R$ 1.247 com IRPF";
        html = email3(lead.nome.split(" ")[0]);
      } else if (lead.emailSeqStep === 3) {
        subject = `${diasRestantes} dias para o prazo do IRPF 2026 — você já declarou?`;
        html = email4(lead.nome.split(" ")[0], diasRestantes);
      } else if (lead.emailSeqStep === 4) {
        subject = `ÚLTIMO AVISO: faltam ${diasRestantes} dias para o prazo — ${lead.nome.split(" ")[0]}`;
        html = email5(lead.nome.split(" ")[0], diasRestantes);
      }

      if (!subject) {
        results.skipped++;
        continue;
      }

      try {
        await resend.emails.send({ from: FROM, to: lead.email, subject, html });
        await prisma.lead.update({
          where: { id: lead.id },
          data: { emailSeqStep: lead.emailSeqStep + 1, emailSeqAt: now },
        });
        results.sent++;
      } catch (emailErr) {
        console.error(`[email-sequence] Erro ao enviar para ${lead.email}:`, emailErr);
        results.errors++;
      }
    }

    console.log(`[email-sequence] Resultado: ${JSON.stringify(results)}`);
    return NextResponse.json({ success: true, ...results });
  } catch (err) {
    console.error("[email-sequence] Erro geral:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
