/**
 * notification-hub.ts
 * Ponto único de despacho de notificações: email (Resend) + webhook (Telegram/Slack).
 *
 * Exports públicos:
 *   notifyLead(data)     — welcome email ao lead + notificação admin + webhook
 *   notifyContato(data)  — confirmação ao usuário + notificação admin + webhook
 *   notifySystemAlert(message) — re-exportado de lib/notify para alertas operacionais
 */

import {
  buildAdminNotificationEmail,
  buildAdminNotificationEmailText,
  buildContactConfirmationEmail,
  buildContactConfirmationEmailText,
  buildLeadWelcomeEmail,
  buildLeadWelcomeEmailText,
} from "@/lib/email-templates";
import {
  notifyNewContato,
  notifyNewLead,
  notifySystemAlert as _notifySystemAlert,
} from "@/lib/notify";
import { resend } from "@/lib/resend";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type EmailResult = {
  success: boolean;
  skipped: boolean;
  id: string | null;
  error: string | null;
};

export type WebhookResult = Array<{
  channel: string;
  success: boolean;
  skipped: boolean;
  error: string | null;
}>;

export type HubResult = {
  emailToUser: EmailResult;
  emailToAdmin: EmailResult;
  webhook: WebhookResult;
};

export type LeadPayload = {
  nome: string;
  email: string;
  telefone?: string | null;
  origem?: string | null;
  servico?: string | null;
  mensagem?: string | null;
  diasRestantes: number;
  whatsappUrl?: string | null;
};

export type ContatoPayload = {
  nome: string;
  email: string;
  telefone?: string | null;
  origem?: string | null;
  servico?: string | null;
  mensagem?: string | null;
  whatsappUrl?: string | null;
};

// ─── Email interno (único safeSendEmail no projeto) ───────────────────────────

async function safeSendEmail(
  params: Parameters<typeof resend.emails.send>[0],
): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send(params);
    if (error) {
      return {
        success: false,
        skipped: false,
        id: null,
        error: typeof error === "string" ? error : JSON.stringify(error),
      };
    }
    return { success: true, skipped: false, id: data?.id ?? null, error: null };
  } catch (err) {
    return {
      success: false,
      skipped: false,
      id: null,
      error:
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao enviar email",
    };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveFrom(label: string): string {
  const from = process.env.FROM_EMAIL;
  if (!from)
    console.warn(
      `[notification-hub] FROM_EMAIL não configurado. Usando fallback para "${label}".`,
    );
  return from || "Nilson Brites | Consultoria IRPF <noreply@irpf.qaplay.com.br>";
}

function resolveAdminEmail(): string {
  const admin = process.env.ADMIN_EMAIL;
  if (!admin)
    console.warn(
      "[notification-hub] ADMIN_EMAIL não configurado. Usando fallback nilson.brites@gmail.com.",
    );
  return admin || "nilson.brites@gmail.com";
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Notificações para novo Lead:
 *  1. Email de boas-vindas com urgência (prazo + WhatsApp) → lead
 *  2. Email de alerta com detalhes + link WhatsApp → admin
 *  3. Webhook Telegram/Slack → admin
 */
export async function notifyLead(data: LeadPayload): Promise<HubResult> {
  const from = resolveFrom("lead");
  const adminEmail = resolveAdminEmail();
  const primeiroNome = data.nome.split(" ")[0];

  const leadWelcomeParams = { primeiroNome, diasRestantes: data.diasRestantes };
  const adminLeadParams = {
    kind: "lead" as const,
    nome: data.nome,
    email: data.email,
    telefone: data.telefone,
    origem: data.origem || "site",
    servico: data.servico || "IRPF",
    mensagem: data.mensagem,
    whatsappUrl: data.whatsappUrl,
  };

  const [emailToUser, emailToAdmin, webhook] = await Promise.all([
    safeSendEmail({
      from,
      to: data.email,
      subject: `Recebemos sua solicitação — Consultoria IRPF NSB`,
      html: buildLeadWelcomeEmail(leadWelcomeParams),
      text: buildLeadWelcomeEmailText(leadWelcomeParams),
    }),
    safeSendEmail({
      from,
      to: adminEmail,
      subject: `[Lead] ${data.nome} — ${data.servico || "IRPF"}`,
      html: buildAdminNotificationEmail(adminLeadParams),
      text: buildAdminNotificationEmailText(adminLeadParams),
    }),
    notifyNewLead({
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      origem: data.origem || "site",
      servico: data.servico || "IRPF",
      mensagem: data.mensagem,
    }),
  ]);

  if (!emailToUser.success)
    console.error("[notification-hub] Email lead falhou:", emailToUser.error);
  if (!emailToAdmin.success)
    console.error(
      "[notification-hub] Email admin (lead) falhou:",
      emailToAdmin.error,
    );

  return { emailToUser, emailToAdmin, webhook };
}

/**
 * Notificações para novo Contato:
 *  1. Email de confirmação → usuário
 *  2. Email de alerta com detalhes + link WhatsApp → admin
 *  3. Webhook Telegram/Slack → admin
 */
export async function notifyContato(data: ContatoPayload): Promise<HubResult> {
  const from = resolveFrom("contato");
  const adminEmail = resolveAdminEmail();

  const contactConfirmParams = { nome: data.nome, servico: data.servico };
  const adminContatoParams = {
    kind: "contato" as const,
    nome: data.nome,
    email: data.email,
    telefone: data.telefone,
    origem: data.origem || "site",
    servico: data.servico,
    mensagem: data.mensagem,
    whatsappUrl: data.whatsappUrl,
  };

  const [emailToUser, emailToAdmin, webhook] = await Promise.all([
    safeSendEmail({
      from,
      to: data.email,
      subject: `Recebemos sua mensagem — Consultoria IRPF NSB`,
      html: buildContactConfirmationEmail(contactConfirmParams),
      text: buildContactConfirmationEmailText(contactConfirmParams),
    }),
    safeSendEmail({
      from,
      to: adminEmail,
      subject: `[Contato] ${data.nome}`,
      html: buildAdminNotificationEmail(adminContatoParams),
      text: buildAdminNotificationEmailText(adminContatoParams),
    }),
    notifyNewContato({
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      origem: data.origem || "site",
      servico: data.servico,
      mensagem: data.mensagem,
    }),
  ]);

  if (!emailToUser.success)
    console.error(
      "[notification-hub] Email confirmação falhou:",
      emailToUser.error,
    );
  if (!emailToAdmin.success)
    console.error(
      "[notification-hub] Email admin (contato) falhou:",
      emailToAdmin.error,
    );

  return { emailToUser, emailToAdmin, webhook };
}

/**
 * Alerta operacional (cron, erros críticos, blog automation).
 * Só envia via webhook — sem email.
 */
export { _notifySystemAlert as notifySystemAlert };
