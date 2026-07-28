const OTP_TTL_MS = 5 * 60 * 1000;

interface OtpEntry {
  otp: string;
  expiresAt: number;
}

const store = new Map<string, OtpEntry>();

export function saveOtp(email: string, otp: string): void {
  store.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
  });
}

export function verifyOtp(email: string, otp: string): boolean {
  const entry = store.get(email.toLowerCase());
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    store.delete(email.toLowerCase());
    return false;
  }
  const ok = entry.otp === otp;
  if (ok) store.delete(email.toLowerCase());
  return ok;
}
