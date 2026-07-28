"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "@/app/(auth)/_components/AppShell";
import { handleListPayments, handleCreatePayment } from "@/lib/actions/payment-action";
import { handleCreateAppointment } from "@/lib/actions/appointment-action";
import { Payment } from "@/lib/api/payments";
import BookingSuccessModal, { BookingSuccessDetails } from "@/components/BookingSuccessModal";
import GatewayCheckoutModal, { PaymentMethod } from "./_components/GatewayCheckoutModal";

function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const doctorId = searchParams.get("doctorId") || "";
  const doctorName = searchParams.get("doctorName") || "Doctor";
  const specialty = searchParams.get("specialty") || "Specialist";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const timeValue = searchParams.get("timeValue") || "";
  const fee = Number(searchParams.get("fee") || 1500);
  const notes = searchParams.get("notes") || "";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState<{ open: boolean; details: BookingSuccessDetails | null }>({
    open: false,
    details: null,
  });
  const [gatewayOpen, setGatewayOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");
  const [declined, setDeclined] = useState(false);

  const serviceFee = 2.0;
  const total = fee + serviceFee;

  const handlePayNow = () => {
    setError(null);
    setDeclined(false);
    setGatewayOpen(true);
  };

  const finalizeBooking = async (paymentMethodLabel: string) => {
    setSubmitting(true);
    setError(null);

    // Compute end time (30 minutes after start)
    const computeEndTime = (start: string): string => {
      if (!start) return "";
      const [h, m] = start.split(":").map(Number);
      const endMinutes = h * 60 + m + 30;
      const eh = Math.floor(endMinutes / 60).toString().padStart(2, "0");
      const em = (endMinutes % 60).toString().padStart(2, "0");
      return `${eh}:${em}`;
    };

    const startTimeValue = timeValue || "09:00";
    const endTimeValue = computeEndTime(startTimeValue);

    const appointmentResult = await handleCreateAppointment({
      doctorId,
      doctorName: doctorName,
      specialty: specialty,
      appointmentDate: date,
      appointmentTime: time,
      startTime: startTimeValue,
      endTime: endTimeValue,
      notes,
      amount: total,
      status: "confirmed",
      paymentMethod: paymentMethodLabel,
    });

    if (!appointmentResult.success || !appointmentResult.data?.id) {
      setSubmitting(false);
      setError(appointmentResult.message || "Could not book the appointment. Please try again.");
      return;
    }

    const appointmentId = appointmentResult.data.id;

    const paymentResult = await handleCreatePayment({
      appointmentId,
      doctorId,
      amount: total,
      paymentMethod: paymentMethodLabel,
      status: "paid",
    });

    setSubmitting(false);

    if (!paymentResult.success) {
      setError(
        paymentResult.message || "Your appointment was booked, but the payment could not be recorded. Please contact support."
      );
      return;
    }

    setSuccessModal({
      open: true,
      details: {
        bookingId: appointmentId,
        doctorName,
        specialty,
        hospital: "",
        date,
        time,
        fee: total,
        paymentMethod: paymentMethodLabel,
      },
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              borderRadius: "8px",
              padding: "24px 32px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--fg)" }}>Choose Payment Method</h2>
            <p style={{ marginTop: "4px", fontSize: "13px", color: "var(--fg-secondary)" }}>
              Select a trusted payment option to secure your appointment.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMethod("esewa")}
                style={{
                  borderRadius: "8px",
                  border: `1px solid ${selectedMethod === "esewa" ? "var(--brand)" : "var(--border-light)"}`,
                  background: selectedMethod === "esewa" ? "var(--brand-light)" : "var(--bg-surface)",
                  padding: "16px",
                  textAlign: "center",
                  transition: "all 0.15s ease",
                  boxShadow: selectedMethod === "esewa" ? "var(--shadow-sm)" : "none",
                }}
              >
                <svg viewBox="0 0 120 120" style={{ display: "block", margin: "0 auto", height: "48px", width: "48px" }}>
                  <rect x="16" y="16" width="88" height="88" rx="20" fill="#0F3C5D" />
                  <text x="60" y="72" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="22" fill="#fff">
                    eSewa
                  </text>
                  <circle cx="90" cy="32" r="6" fill="#86CE36" />
                </svg>
                <p style={{ marginTop: "8px", fontSize: "13px", fontWeight: 600, color: "var(--fg)" }}>eSewa</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("khalti")}
                style={{
                  borderRadius: "8px",
                  border: `1px solid ${selectedMethod === "khalti" ? "var(--brand)" : "var(--border-light)"}`,
                  background: selectedMethod === "khalti" ? "var(--brand-light)" : "var(--bg-surface)",
                  padding: "16px",
                  textAlign: "center",
                  transition: "all 0.15s ease",
                  boxShadow: selectedMethod === "khalti" ? "var(--shadow-sm)" : "none",
                }}
              >
                <svg viewBox="0 0 120 120" style={{ display: "block", margin: "0 auto", height: "48px", width: "48px" }}>
                  <rect x="16" y="16" width="88" height="88" rx="20" fill="#4C25B0" />
                  <text x="60" y="68" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="20" fill="#fff">
                    Khalti
                  </text>
                  <rect x="40" y="78" width="40" height="3" rx="1.5" fill="#E8A53E" />
                </svg>
                <p style={{ marginTop: "8px", fontSize: "13px", fontWeight: 600, color: "var(--fg)" }}>Khalti</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("card")}
                style={{
                  borderRadius: "8px",
                  border: `1px solid ${selectedMethod === "card" ? "var(--brand)" : "var(--border-light)"}`,
                  background: selectedMethod === "card" ? "var(--brand-light)" : "var(--bg-surface)",
                  padding: "16px",
                  textAlign: "center",
                  transition: "all 0.15s ease",
                  boxShadow: selectedMethod === "card" ? "var(--shadow-sm)" : "none",
                }}
              >
                <svg viewBox="0 0 120 120" style={{ display: "block", margin: "0 auto", height: "48px", width: "48px" }}>
                  <rect x="16" y="28" width="88" height="64" rx="10" fill="#2f6f7e" />
                  <rect x="16" y="42" width="88" height="14" fill="#1d4e5a" />
                  <rect x="28" y="68" width="30" height="6" rx="3" fill="rgba(255,255,255,0.4)" />
                  <rect x="28" y="80" width="18" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
                </svg>
                <p style={{ marginTop: "8px", fontSize: "13px", fontWeight: 600, color: "var(--fg)" }}>Card</p>
              </button>
            </div>

            {declined && (
              <div
                style={{
                  marginTop: "16px",
                  borderRadius: "6px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  padding: "12px 16px",
                  fontSize: "13px",
                  color: "#dc2626",
                }}
              >
                Payment was declined due to incorrect OTP. Please try again.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              borderRadius: "8px",
              padding: "24px 32px",
              boxShadow: "var(--shadow-sm)",
              position: "sticky",
              top: "24px",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--fg)" }}>Booking Summary</h2>

            <div style={{ marginTop: "20px", borderBottom: "1px solid var(--border-light)", paddingBottom: "20px" }}>
              <p style={{ fontWeight: 600, color: "var(--fg)" }}>{doctorName}</p>
              <p style={{ marginTop: "2px", fontSize: "12px", fontWeight: 600, color: "var(--brand)" }}>{specialty}</p>
            </div>

            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--fg-secondary)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Date</span>
                <span style={{ fontWeight: 600, color: "var(--fg)" }}>{date || "Not selected"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Time</span>
                <span style={{ fontWeight: 600, color: "var(--fg)" }}>{time || "Not selected"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Consultation Fee</span>
                <span style={{ fontWeight: 600, color: "var(--fg)" }}>Rs. {fee.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Service Fee</span>
                <span style={{ fontWeight: 600, color: "var(--fg)" }}>Rs. {serviceFee.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-light)", paddingTop: "12px" }}>
                <span style={{ fontWeight: 600, color: "var(--fg)" }}>Total Amount</span>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--fg)" }}>Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div
                style={{
                  marginTop: "16px",
                  borderRadius: "6px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  padding: "12px 16px",
                  fontSize: "13px",
                  color: "#dc2626",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handlePayNow}
              disabled={submitting}
              style={{
                width: "100%",
                marginTop: "20px",
                borderRadius: "8px",
                background: "var(--brand)",
                color: "#fff",
                padding: "14px 16px",
                fontSize: "14px",
                fontWeight: 600,
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.6 : 1,
                transition: "opacity 0.15s ease",
              }}
            >
              {submitting ? "Processing..." : `Pay Rs. ${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>

      <GatewayCheckoutModal
        isOpen={gatewayOpen}
        amount={total}
        method={selectedMethod}
        onCancel={() => setGatewayOpen(false)}
        onSuccess={() => {
          setGatewayOpen(false);
          finalizeBooking(selectedMethod === "card" ? "Card" : selectedMethod === "esewa" ? "eSewa" : "Khalti");
        }}
        onFailed={() => {
          setGatewayOpen(false);
          setDeclined(true);
        }}
      />

      <BookingSuccessModal
        isOpen={successModal.open}
        onClose={() => {
          setSuccessModal({ open: false, details: null });
          router.push("/appointments");
        }}
        details={successModal.details}
      />
    </>
  );
}

function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await handleListPayments({ page: 1, limit: 50 });
      setLoading(false);
      if (!result.success) {
        setError(result.message || "Failed to load payments");
        return;
      }
      setPayments(result.data || []);
    };
    load();
  }, []);

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-light)",
        borderRadius: "8px",
        padding: "24px 32px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--fg)" }}>Payment History</h2>
      <p style={{ fontSize: "13px", color: "var(--fg-secondary)", marginTop: "4px" }}>
        Track your payment methods and transaction status.
      </p>

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", color: "var(--fg-tertiary)" }}>
          <span
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "3px solid var(--border-light)",
              borderTopColor: "var(--brand)",
              animation: "spin 0.8s linear infinite",
              marginBottom: "12px",
            }}
          />
          <p style={{ fontSize: "13px", fontWeight: 500 }}>Loading payments...</p>
        </div>
      )}
      {error && <p style={{ marginTop: "16px", fontSize: "13px", color: "#dc2626" }}>{error}</p>}

      {!loading && !error && payments.length === 0 && (
        <div
          style={{
            marginTop: "24px",
            borderRadius: "8px",
            border: "1px dashed var(--border)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "48px 24px",
            color: "var(--fg-tertiary)",
          }}
        >
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              height: "56px",
              width: "56px",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: "var(--bg-surface-raised)",
            }}
          >
            <svg style={{ height: "24px", width: "24px", color: "var(--fg-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <rect x="3" y="6" width="18" height="12" rx="2" />
              <path d="M3 10h18" strokeLinecap="round" />
              <path d="M16 10h4" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg)" }}>No payments yet</p>
          <p style={{ fontSize: "13px", marginTop: "4px" }}>Once you book and pay for an appointment, it will show up here.</p>
        </div>
      )}

      <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {payments.map((payment) => (
          <div
            key={payment.id}
            style={{
              borderRadius: "8px",
              border: "1px solid var(--border-light)",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--bg-surface)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "var(--brand-light)",
                  color: "var(--brand)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {(payment.paymentMethod || "C")[0].toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--fg)" }}>{payment.paymentMethod ? payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1) : "Cash"}</p>
                <p style={{ fontSize: "11px", color: "var(--fg-tertiary)" }}>Ref: {payment.reference || payment.id}</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--fg)" }}>Rs. {payment.amount || 0}</p>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  fontWeight: 600,
                  borderRadius: "9999px",
                  padding: "4px 12px",
                  marginTop: "4px",
                  background: payment.status === "paid" ? "color-mix(in srgb, var(--success) 12%, transparent)" : "color-mix(in srgb, var(--accent) 12%, transparent)",
                  color: payment.status === "paid" ? "var(--success)" : "var(--accent)",
                }}
              >
                {payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : "Pending"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsContent() {
  const searchParams = useSearchParams();
  const isCheckout = Boolean(searchParams.get("doctorId"));
  return isCheckout ? <Checkout /> : <PaymentHistory />;
}

export default function PaymentsPage() {
  return (
    <AppShell title="Payment">
      <Suspense
        fallback={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 0", color: "var(--fg-tertiary)" }}>
            <span
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "3px solid var(--border-light)",
                borderTopColor: "var(--brand)",
                animation: "spin 0.8s linear infinite",
                marginBottom: "12px",
              }}
            />
            <p style={{ fontSize: "13px", fontWeight: 500 }}>Loading...</p>
          </div>
        }
      >
        <PaymentsContent />
      </Suspense>
    </AppShell>
  );
}
