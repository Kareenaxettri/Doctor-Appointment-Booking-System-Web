"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AppShell from "@/app/(auth)/_components/AppShell";

function ConfirmationDetails() {
  const searchParams = useSearchParams();

  const doctorName = searchParams.get("doctorName") || "Doctor";
  const specialty = searchParams.get("specialty") || "Specialist";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const fee = searchParams.get("fee") || "0";
  const method = searchParams.get("method") || "Payment";
  const appointmentId = searchParams.get("appointmentId") || "";

  return (
    <div style={{ maxWidth: "36rem", margin: "0 auto" }}>
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "2.5rem 2rem", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
        {/* Success Icon */}
        <div style={{ width: "4.5rem", height: "4.5rem", borderRadius: "50%", background: "var(--brand-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" style={{ width: "1.5rem", height: "1.5rem", fill: "none", stroke: "#fff" }} strokeWidth="3">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--fg)" }}>Appointment Booked!</h2>
        <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)", marginTop: "0.5rem" }}>
          Your appointment has been successfully scheduled. A confirmation has also been sent to your email.
        </p>

        {/* Summary Card */}
        <div style={{ marginTop: "2rem", borderRadius: "8px", background: "var(--bg)", border: "1px solid var(--border-light)", padding: "1.25rem", textAlign: "left", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontWeight: 700, color: "var(--fg)" }}>{doctorName}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--brand)", fontWeight: 600 }}>{specialty}</p>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, borderRadius: "6px", background: "var(--success)", color: "#fff", padding: "0.25rem 0.625rem" }}>
              Confirmed
            </span>
          </div>
          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "0.75rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.875rem" }}>
            <span style={{ color: "var(--fg-secondary)" }}>Booking ID</span>
            <span style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: "var(--fg)" }}>{appointmentId || "N/A"}</span>
            <span style={{ color: "var(--fg-secondary)" }}>Date</span>
            <span style={{ textAlign: "right", fontWeight: 600, color: "var(--fg)" }}>{date || "TBD"}</span>
            <span style={{ color: "var(--fg-secondary)" }}>Time</span>
            <span style={{ textAlign: "right", fontWeight: 600, color: "var(--fg)" }}>{time || "TBD"}</span>
            <span style={{ color: "var(--fg-secondary)" }}>Paid via</span>
            <span style={{ textAlign: "right", fontWeight: 600, color: "var(--fg)", textTransform: "capitalize" }}>{method}</span>
            <span style={{ color: "var(--fg-secondary)" }}>Amount</span>
            <span style={{ textAlign: "right", fontWeight: 700, color: "var(--brand)" }}>Rs. {fee}</span>
          </div>
        </div>

        <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Link
            href="/appointments"
            style={{
              display: "block",
              width: "100%",
              background: "var(--brand)",
              color: "#fff",
              fontSize: "0.9375rem",
              fontWeight: 700,
              borderRadius: "6px",
              padding: "0.875rem",
              textDecoration: "none",
              boxShadow: "var(--shadow-sm)",
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            View My Appointments
          </Link>
          <Link
            href="/dashboard"
            style={{
              display: "block",
              width: "100%",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--fg)",
              fontSize: "0.9375rem",
              fontWeight: 700,
              borderRadius: "6px",
              padding: "0.875rem",
              textDecoration: "none",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-surface-raised)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg)"; }}
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentConfirmationPage() {
  return (
    <AppShell title="Appointment Confirmation">
      <Suspense
        fallback={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 0", color: "var(--fg-secondary)" }}>
            <span style={{ marginBottom: "0.75rem", height: "2rem", width: "2rem", animation: "spin 1s linear infinite", borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--brand)" }} />
            <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>Loading confirmation...</p>
          </div>
        }
      >
        <ConfirmationDetails />
      </Suspense>
    </AppShell>
  );
}
