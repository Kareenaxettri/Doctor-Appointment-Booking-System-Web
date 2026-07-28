"use client";

import React from "react";
import Link from "next/link";
import AppointmentPrepAssistant from "@/components/AppointmentPrepAssistant";

export type BookingSuccessDetails = {
  bookingId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  fee: number | string;
  paymentMethod: string;
};

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: BookingSuccessDetails | null;
}

export default function BookingSuccessModal({ isOpen, onClose, details }: BookingSuccessModalProps) {
  if (!isOpen || !details) return null;

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
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          overflow: "hidden",
          borderRadius: "8px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-light)",
          padding: "32px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        {/* Checkmark Header */}
        <div
          style={{
            margin: "0 auto 24px",
            display: "flex",
            height: "72px",
            width: "72px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: "color-mix(in srgb, var(--success) 12%, transparent)",
          }}
        >
          <div
            style={{
              display: "flex",
              height: "48px",
              width: "48px",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: "var(--success)",
              color: "#fff",
            }}
          >
            <svg viewBox="0 0 24 24" style={{ height: "24px", width: "24px", fill: "none", stroke: "currentColor" }} strokeWidth="3">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--fg)" }}>Appointment Confirmed!</h2>
          <p style={{ marginTop: "6px", fontSize: "13px", color: "var(--fg-secondary)" }}>
            Your appointment has been successfully scheduled and recorded.
          </p>
        </div>

        {/* Details Card */}
        <div
          style={{
            marginTop: "24px",
            borderRadius: "8px",
            border: "1px solid var(--border-light)",
            background: "var(--bg-surface-raised)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontSize: "13px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "12px" }}>
            <div>
              <p style={{ fontWeight: 700, color: "var(--fg)" }}>{details.doctorName}</p>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--brand)" }}>{details.specialty}</p>
            </div>
            <span
              style={{
                borderRadius: "9999px",
                background: "color-mix(in srgb, var(--success) 12%, transparent)",
                padding: "4px 12px",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--success)",
              }}
            >
              Confirmed
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", color: "var(--fg-secondary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--fg-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, fontSize: "11px" }}>Booking ID</span>
              <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--fg)" }}>{details.bookingId}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--fg-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, fontSize: "11px" }}>Hospital / Clinic</span>
              <span style={{ fontWeight: 700, color: "var(--fg)" }}>{details.hospital || "Nepal Mediciti Hospital"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--fg-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, fontSize: "11px" }}>Date & Time</span>
              <span style={{ fontWeight: 700, color: "var(--fg)" }}>{details.date} at {details.time}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-light)", paddingTop: "8px" }}>
              <span style={{ color: "var(--fg-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, fontSize: "11px" }}>Payment Method</span>
              <span style={{ fontWeight: 700, textTransform: "capitalize", color: "var(--fg)" }}>{details.paymentMethod}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--fg-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, fontSize: "11px" }}>Total Paid</span>
              <span style={{ fontWeight: 700, color: "var(--brand)", fontSize: "13px" }}>Rs. {details.fee}</span>
            </div>
          </div>
        </div>

        <AppointmentPrepAssistant specialty={details.specialty} />

        {/* Action Buttons */}
        <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            href="/appointments"
            onClick={onClose}
            style={{
              flex: 1,
              display: "block",
              textAlign: "center",
              borderRadius: "8px",
              background: "var(--brand)",
              color: "#fff",
              padding: "14px 16px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "opacity 0.15s ease",
            }}
          >
            View Appointments
          </Link>
          <Link
            href="/dashboard"
            onClick={onClose}
            style={{
              flex: 1,
              display: "block",
              textAlign: "center",
              borderRadius: "8px",
              border: "1px solid var(--border-light)",
              background: "var(--bg-surface)",
              color: "var(--fg)",
              padding: "14px 16px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "background 0.15s ease",
            }}
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
