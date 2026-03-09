import { Resend } from "resend";

// Instanciação lazy: evita erro de build quando RESEND_API_KEY não está disponível
let _resend: Resend | null = null;

function getInstance(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? "");
  }
  return _resend;
}

export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    const instance = getInstance();
    const value = (instance as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") return value.bind(instance);
    return value;
  },
});
