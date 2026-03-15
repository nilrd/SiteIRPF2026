import { Resend } from "resend";

// Usa factory function — nunca lanca erro em build time (sem RESEND_API_KEY)
// Compativel com o padrao resend.emails.send() ja usado no codigo
export const resend = {
  emails: {
    send: async (params: Parameters<InstanceType<typeof Resend>["emails"]["send"]>[0]) => {
      const key = process.env.RESEND_API_KEY;
      if (!key) {
        console.warn("[resend] RESEND_API_KEY nao configurada — email nao enviado.");
        return { data: null, error: null };
      }
      const client = new Resend(key);
      return client.emails.send(params);
    },
  },
};
