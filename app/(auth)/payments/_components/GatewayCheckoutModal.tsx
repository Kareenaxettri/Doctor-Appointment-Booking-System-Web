"use client";

import { useEffect, useState } from "react";

export type PaymentMethod = "esewa" | "khalti" | "card";

type Props = {
  isOpen: boolean;
  amount: number;
  method: PaymentMethod;
  onCancel: () => void;
  onSuccess: () => void;
  onFailed: () => void;
};

type Step = "redirecting" | "email" | "credentials" | "sending" | "otp" | "verifying" | "done" | "failed";

const METHOD_META: Record<PaymentMethod, { label: string; color: string }> = {
  esewa: { label: "eSewa", color: "#0F3C5D" },
  khalti: { label: "Khalti", color: "#4C25B0" },
  card: { label: "Card", color: "#2f6f7e" },
};

export default function GatewayCheckoutModal({ isOpen, amount, method, onCancel, onSuccess, onFailed }: Props) {
  const meta = METHOD_META[method];
  const [step, setStep] = useState<Step>("redirecting");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [sendError, setSendError] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setStep("redirecting");
    setEmail("");
    setPassword("");
    setOtp(["", "", "", "", "", ""]);
    setResendTimer(30);
    setSendError(null);
    setVerifyError(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || step !== "redirecting") return;
    const t = setTimeout(() => setStep(method === "card" ? "email" : "credentials"), 1100);
    return () => clearTimeout(t);
  }, [isOpen, step, method]);

  useEffect(() => {
    if (step !== "otp" || resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const otpComplete = otp.every((d) => d.length === 1);

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < otp.length - 1) {
      const el = document.getElementById(`otp-input-${index + 1}`);
      (el as HTMLInputElement | null)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const el = document.getElementById(`otp-input-${index - 1}`);
      (el as HTMLInputElement | null)?.focus();
    }
  };

  const handleSendOtp = async () => {
    setSendError(null);
    setStep("sending");
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSendError(data.error || "Failed to send OTP. Try again.");
        setStep(method === "card" ? "email" : "credentials");
        return;
      }
      setStep("otp");
      setResendTimer(30);
    } catch {
      setSendError("Network error. Please try again.");
      setStep(method === "card" ? "email" : "credentials");
    }
  };

  const handleVerifyPassword = async () => {
    setSendError(null);
    setStep("sending");
    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSendError(data.error || "Invalid email or password.");
        setStep("credentials");
        return;
      }
      const otpRes = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!otpRes.ok) {
        setSendError("Password verified but failed to send OTP. Try again.");
        setStep("credentials");
        return;
      }
      setStep("otp");
      setResendTimer(30);
    } catch {
      setSendError("Network error. Please try again.");
      setStep("credentials");
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp(["", "", "", "", "", ""]);
    setSendError(null);
    setVerifyError(null);
    await handleSendOtp();
  };

  const handleVerify = async () => {
    setVerifyError(null);
    setStep("verifying");
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join("") }),
      });
      if (!res.ok) {
        setStep("failed");
        return;
      }
      setStep("done");
      onSuccess();
    } catch {
      setStep("failed");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: "8px",
    border: "1px solid var(--border-light)",
    background: "var(--bg)",
    padding: "12px 16px",
    fontSize: "13px",
    outline: "none",
    color: "var(--fg)",
    transition: "border-color 0.15s ease",
  };

  const btnPrimary: React.CSSProperties = {
    width: "100%",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#fff",
    border: "none",
    background: meta.color,
    cursor: "pointer",
    transition: "opacity 0.15s ease",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          overflow: "hidden",
          borderRadius: "8px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-light)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            background: meta.color,
            color: "#fff",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 600 }}>{meta.label} Checkout</span>
        </div>

        <div style={{ padding: "24px" }}>
          {step === "redirecting" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 0", textAlign: "center" }}>
              <span
                style={{
                  marginBottom: "16px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "3px solid var(--border-light)",
                  borderTopColor: meta.color,
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)" }}>Redirecting to {meta.label}&hellip;</p>
              <p style={{ marginTop: "4px", fontSize: "12px", color: "var(--fg-tertiary)" }}>Do not close this window.</p>
            </div>
          )}

          {step === "credentials" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim() && password.trim()) handleVerifyPassword();
              }}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    margin: "0 auto 12px",
                    display: "flex",
                    height: "48px",
                    width: "48px",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    background: "var(--bg-surface-raised)",
                  }}
                >
                  <svg style={{ height: "24px", width: "24px", color: meta.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg)" }}>Log in to {meta.label}</p>
                <p style={{ marginTop: "4px", fontSize: "12px", color: "var(--fg-tertiary)" }}>
                  Verify your account to pay{" "}
                  <span style={{ fontWeight: 600, color: "var(--fg-secondary)" }}>Rs. {amount.toFixed(2)}</span>
                </p>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fg-secondary)" }}>
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = meta.color; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-light)"; }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fg-secondary)" }}>
                  Password
                </label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = meta.color; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-light)"; }}
                />
              </div>
              {sendError && (
                <p style={{ borderRadius: "6px", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 12px", fontSize: "12px", color: "#dc2626" }}>{sendError}</p>
              )}
              <button
                type="submit"
                disabled={!email.trim() || !password.trim()}
                style={{ ...btnPrimary, opacity: !email.trim() || !password.trim() ? 0.5 : 1, cursor: !email.trim() || !password.trim() ? "not-allowed" : "pointer" }}
              >
                Continue
              </button>
              <button type="button" onClick={onCancel} style={{ width: "100%", textAlign: "center", fontSize: "12px", fontWeight: 500, color: "var(--fg-tertiary)", background: "none", border: "none", cursor: "pointer" }}>
                Cancel payment
              </button>
            </form>
          )}

          {step === "email" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) handleSendOtp();
              }}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    margin: "0 auto 12px",
                    display: "flex",
                    height: "48px",
                    width: "48px",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    background: "var(--bg-surface-raised)",
                  }}
                >
                  <svg style={{ height: "24px", width: "24px", color: meta.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg)" }}>Enter your email to pay</p>
                <p style={{ marginTop: "4px", fontSize: "12px", color: "var(--fg-tertiary)" }}>
                  We&apos;ll send a one-time password to verify your payment of{" "}
                  <span style={{ fontWeight: 600, color: "var(--fg-secondary)" }}>Rs. {amount.toFixed(2)}</span>
                </p>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fg-secondary)" }}>
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = meta.color; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-light)"; }}
                />
              </div>
              {sendError && (
                <p style={{ borderRadius: "6px", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 12px", fontSize: "12px", color: "#dc2626" }}>{sendError}</p>
              )}
              <button
                type="submit"
                disabled={!email.trim()}
                style={{ ...btnPrimary, opacity: !email.trim() ? 0.5 : 1, cursor: !email.trim() ? "not-allowed" : "pointer" }}
              >
                Send OTP
              </button>
              <button type="button" onClick={onCancel} style={{ width: "100%", textAlign: "center", fontSize: "12px", fontWeight: 500, color: "var(--fg-tertiary)", background: "none", border: "none", cursor: "pointer" }}>
                Cancel payment
              </button>
            </form>
          )}

          {step === "sending" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 0", textAlign: "center" }}>
              <span
                style={{
                  marginBottom: "16px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "3px solid var(--border-light)",
                  borderTopColor: meta.color,
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)" }}>Sending OTP to {email}&hellip;</p>
              <p style={{ marginTop: "4px", fontSize: "12px", color: "var(--fg-tertiary)" }}>Check your inbox.</p>
            </div>
          )}

          {step === "otp" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    margin: "0 auto 12px",
                    display: "flex",
                    height: "48px",
                    width: "48px",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    background: "var(--bg-surface-raised)",
                  }}
                >
                  <svg style={{ height: "24px", width: "24px", color: meta.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg)" }}>Enter verification code</p>
                <p style={{ marginTop: "4px", fontSize: "12px", color: "var(--fg-tertiary)" }}>
                  We sent a 6-digit code to <span style={{ fontWeight: 500, color: "var(--fg-secondary)" }}>{email}</span>
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    inputMode="numeric"
                    maxLength={1}
                    style={{
                      height: "48px",
                      width: "44px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-light)",
                      background: "var(--bg)",
                      textAlign: "center",
                      fontSize: "18px",
                      fontWeight: 700,
                      outline: "none",
                      color: "var(--fg)",
                      transition: "border-color 0.15s ease",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = meta.color; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-light)"; }}
                  />
                ))}
              </div>

              {verifyError && (
                <p style={{ borderRadius: "6px", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 12px", fontSize: "12px", color: "#dc2626", textAlign: "center" }}>{verifyError}</p>
              )}

              <button
                type="button"
                disabled={!otpComplete}
                onClick={handleVerify}
                style={{ ...btnPrimary, opacity: !otpComplete ? 0.5 : 1, cursor: !otpComplete ? "not-allowed" : "pointer" }}
              >
                Verify & Pay Rs. {amount.toFixed(2)}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0}
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: 500,
                  background: "none",
                  border: "none",
                  cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                  color: resendTimer > 0 ? "var(--fg-tertiary)" : meta.color,
                  opacity: resendTimer > 0 ? 0.5 : 1,
                }}
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
              </button>

              <button type="button" onClick={onCancel} style={{ width: "100%", textAlign: "center", fontSize: "12px", fontWeight: 500, color: "var(--fg-tertiary)", background: "none", border: "none", cursor: "pointer" }}>
                Cancel payment
              </button>
            </div>
          )}

          {step === "verifying" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 0", textAlign: "center" }}>
              <span
                style={{
                  marginBottom: "16px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "3px solid var(--border-light)",
                  borderTopColor: meta.color,
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg)" }}>Verifying your payment&hellip;</p>
              <p style={{ marginTop: "4px", fontSize: "12px", color: "var(--fg-tertiary)" }}>This usually takes a few seconds.</p>
            </div>
          )}

          {step === "done" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 0", textAlign: "center" }}>
              <div
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  height: "56px",
                  width: "56px",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "color-mix(in srgb, var(--success) 12%, transparent)",
                }}
              >
                <svg style={{ height: "28px", width: "28px", color: "var(--success)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--fg)" }}>Payment Successful!</p>
              <p style={{ marginTop: "4px", fontSize: "13px", color: "var(--fg-secondary)" }}>Rs. {amount.toFixed(2)} has been processed.</p>
            </div>
          )}

          {step === "failed" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", textAlign: "center" }}>
                <div
                  style={{
                    marginBottom: "16px",
                    display: "flex",
                    height: "56px",
                    width: "56px",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    background: "#fef2f2",
                  }}
                >
                  <svg style={{ height: "28px", width: "28px", color: "#dc2626" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--fg)" }}>Payment Declined</p>
                <p style={{ marginTop: "4px", fontSize: "13px", color: "var(--fg-secondary)" }}>The OTP you entered is incorrect. Please try again.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOtp(["", "", "", "", "", ""]);
                  setVerifyError(null);
                  setStep("sending");
                }}
                style={btnPrimary}
              >
                Try Again
              </button>
              <button type="button" onClick={onFailed} style={{ width: "100%", textAlign: "center", fontSize: "12px", fontWeight: 500, color: "var(--fg-tertiary)", background: "none", border: "none", cursor: "pointer" }}>
                Cancel payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
