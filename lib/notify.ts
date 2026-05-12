type NotifyEntity = {
  nome: string;
  email: string;
  telefone?: string | null;
  origem?: string | null;
  servico?: string | null;
  mensagem?: string | null;
};

type NotifyResult = {
  channel: "telegram" | "slack";
  success: boolean;
  skipped: boolean;
  error: string | null;
};

async function notifyTelegram(message: string): Promise<NotifyResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      channel: "telegram",
      success: false,
      skipped: true,
      error: "TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID nao configurados",
    };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    if (!response.ok) {
      const body = await response.text();
      return {
        channel: "telegram",
        success: false,
        skipped: false,
        error: `HTTP ${response.status}: ${body}`,
      };
    }

    return { channel: "telegram", success: true, skipped: false, error: null };
  } catch (error) {
    return {
      channel: "telegram",
      success: false,
      skipped: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

async function notifySlack(message: string): Promise<NotifyResult> {
  const webhook = process.env.SLACK_WEBHOOK_URL;

  if (!webhook) {
    return {
      channel: "slack",
      success: false,
      skipped: true,
      error: "SLACK_WEBHOOK_URL nao configurada",
    };
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });

    if (!response.ok) {
      const body = await response.text();
      return {
        channel: "slack",
        success: false,
        skipped: false,
        error: `HTTP ${response.status}: ${body}`,
      };
    }

    return { channel: "slack", success: true, skipped: false, error: null };
  } catch (error) {
    return {
      channel: "slack",
      success: false,
      skipped: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

function formatLeadMessage(entity: NotifyEntity, entityType: "lead" | "contato") {
  return [
    `Novo ${entityType} recebido`,
    `Nome: ${entity.nome}`,
    `Email: ${entity.email}`,
    `Telefone: ${entity.telefone || "Nao informado"}`,
    `Origem: ${entity.origem || "site"}`,
    `Servico: ${entity.servico || "IRPF"}`,
    entity.mensagem ? `Mensagem: ${entity.mensagem}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

async function notifyChannels(message: string) {
  const results = await Promise.allSettled([notifyTelegram(message), notifySlack(message)]);

  return results.map((result, index) => {
    const channel = index === 0 ? "telegram" : "slack";
    if (result.status === "fulfilled") return result.value;

    return {
      channel,
      success: false,
      skipped: false,
      error: result.reason instanceof Error ? result.reason.message : "Erro desconhecido",
    } satisfies NotifyResult;
  });
}

export async function notifyNewLead(lead: NotifyEntity) {
  const message = formatLeadMessage(lead, "lead");
  return notifyChannels(message);
}

export async function notifyNewContato(contato: NotifyEntity) {
  const message = formatLeadMessage(contato, "contato");
  return notifyChannels(message);
}
