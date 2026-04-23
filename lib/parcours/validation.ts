export const CONTRACT_REGEX = /^AV\s?\d{4,6}$/i;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/;
export const IBAN_FR_REGEX = /^FR\d{2}(\s?\d{4}){5}\s?\d{3}$/;

export function isValidContract(v: string): boolean {
  return CONTRACT_REGEX.test(v.trim());
}

export function isValidEmail(v: string): boolean {
  return EMAIL_REGEX.test(v.trim());
}

export function isValidPhone(v: string): boolean {
  if (!v.trim()) return true; // optionnel
  return PHONE_REGEX.test(v.trim());
}

export function isValidIban(v: string): boolean {
  return IBAN_FR_REGEX.test(v.trim().toUpperCase());
}

export function isValidAmount(v: string): boolean {
  const n = Number(v);
  return Number.isFinite(n) && n > 0;
}
