export type BrPhoneValidationResult = {
  valid: boolean;
  normalized: string;
  reason?: string;
};

function onlyDigits(value: string): string {
  return (value || "").replace(/\D/g, "");
}

function isRepeatedDigits(value: string): boolean {
  return /^(\d)\1+$/.test(value);
}

export function normalizeBrPhone(raw: string): string {
  let digits = onlyDigits(raw);

  // Remove código do país quando informado (55 + DDD + número).
  if (digits.length === 13 && digits.startsWith("55")) {
    digits = digits.slice(2);
  }

  return digits;
}

export function isValidBrWhatsApp(raw: string): BrPhoneValidationResult {
  const normalized = normalizeBrPhone(raw);

  if (normalized.length !== 11) {
    return {
      valid: false,
      normalized,
      reason: "WhatsApp deve ter 11 dígitos (DDD + 9 dígitos).",
    };
  }

  const ddd = normalized.slice(0, 2);
  const firstSubscriberDigit = normalized[2];

  if (!/^[1-9][0-9]$/.test(ddd) || ddd === "00") {
    return {
      valid: false,
      normalized,
      reason: "DDD inválido.",
    };
  }

  if (firstSubscriberDigit !== "9") {
    return {
      valid: false,
      normalized,
      reason: "WhatsApp móvel deve começar com 9 após o DDD.",
    };
  }

  if (isRepeatedDigits(normalized)) {
    return {
      valid: false,
      normalized,
      reason: "Número inválido (sequência repetida).",
    };
  }

  return { valid: true, normalized };
}

export function formatBrWhatsApp(raw: string): string {
  const normalized = normalizeBrPhone(raw).slice(0, 11);
  if (normalized.length <= 2) return normalized;
  if (normalized.length <= 7) {
    return `(${normalized.slice(0, 2)}) ${normalized.slice(2)}`;
  }
  return `(${normalized.slice(0, 2)}) ${normalized.slice(2, 7)}-${normalized.slice(7)}`;
}

export function buildWhatsAppWaMeUrl(raw: string): string {
  const result = isValidBrWhatsApp(raw);
  if (!result.valid) return "";
  return `https://wa.me/55${result.normalized}`;
}
