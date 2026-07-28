"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/app/(auth)/_components/AppShell";
import { handleListAppointments, handleUpdateAppointment } from "@/lib/actions/appointment-action";
import { Appointment } from "@/lib/api/appointments";
import AppointmentPrepAssistant from "@/components/AppointmentPrepAssistant";

const statusTabs = ["All", "Upcoming", "Completed", "Cancelled"] as const;
type StatusTab = (typeof statusTabs)[number];

const statusStyles: Record<string, { bg: string; fg: string; border: string }> = {
  upcoming: { bg: "var(--brand-light)", fg: "var(--brand)", border: "var(--brand)" },
  pending: { bg: "var(--accent)", fg: "var(--brand)", border: "var(--accent)" },
  completed: { bg: "var(--success)", fg: "#166534", border: "var(--success)" },
  cancelled: { bg: "#fee2e2", fg: "#991b1b", border: "#fecaca" },
  confirmed: { bg: "var(--success)", fg: "#166534", border: "var(--success)" },
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StatusTab>("All");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await handleListAppointments({ page: 1, limit: 50 });
      setLoading(false);
      if (!result.success) {
        setError(result.message || "Failed to load appointments");
        return;
      }
      setAppointments(result.data || []);
    };

    load();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const filteredAppointments = appointments.filter((appt) => {
    const status = (appt.status || "pending").toLowerCase();
    switch (activeTab) {
      case "Upcoming":
        return status === "upcoming" || status === "pending" || status === "confirmed";
      case "Completed":
        return status === "completed";
      case "Cancelled":
        return status === "cancelled";
      default:
        return true;
    }
  });

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    const result = await handleUpdateAppointment(id, { status: "cancelled" });
    setCancellingId(null);
    if (result.success) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
      );
      setToast("Appointment cancelled successfully");
    } else {
      setToast(result.message || "Failed to cancel appointment");
    }
  };

  return (
    <AppShell title="My Appointments">
      <div
        className="rounded-lg p-6 md:p-8"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2
              className="text-base font-bold"
              style={{ color: "var(--fg)" }}
            >
              Appointment History
            </h2>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--fg-tertiary)" }}
            >
              Stay on top of upcoming visits and recent care sessions.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-md px-4 py-2 text-sm font-semibold text-white transition"
            style={{ background: "var(--brand)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand)")}
          >
            + Book Appointment
          </Link>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="whitespace-nowrap rounded-md border px-4 py-2 text-sm font-medium transition"
              style={
                activeTab === tab
                  ? { background: "var(--brand)", borderColor: "var(--brand)", color: "#fff" }
                  : { background: "transparent", borderColor: "var(--border)", color: "var(--fg-secondary)" }
              }
            >
              {tab}
              {tab !== "All" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({appointments.filter((a) => {
                    const s = (a.status || "pending").toLowerCase();
                    if (tab === "Upcoming") return s === "upcoming" || s === "pending" || s === "confirmed";
                    if (tab === "Completed") return s === "completed";
                    if (tab === "Cancelled") return s === "cancelled";
                    return true;
                  }).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading && (
          <div
            className="flex flex-col items-center justify-center py-12"
            style={{ color: "var(--fg-tertiary)" }}
          >
            <span
              className="mb-3 h-8 w-8 animate-spin rounded-full border-4"
              style={{ borderColor: "var(--border-light)", borderTopColor: "var(--brand)" }}
            />
            <p className="text-sm font-medium">Loading appointments...</p>
          </div>
        )}
        {error && <p className="text-sm" style={{ color: "#991b1b" }}>{error}</p>}

        {!loading && !error && filteredAppointments.length === 0 && (
          <div
            className="rounded-lg border border-dashed p-10 text-center"
            style={{ borderColor: "var(--border)", color: "var(--fg-tertiary)" }}
          >
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-full mx-auto"
              style={{ background: "var(--bg)" }}
            >
              <svg
                className="h-6 w-6"
                style={{ color: "var(--fg-tertiary)" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
              </svg>
            </div>
            <p
              className="text-base font-semibold"
              style={{ color: "var(--fg)" }}
            >
              No {activeTab.toLowerCase()} appointments
            </p>
            <p className="mt-1 text-sm">
              {activeTab === "All"
                ? "Your upcoming care plans will appear here once you confirm a visit."
                : `No ${activeTab.toLowerCase()} appointments found.`}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {filteredAppointments.map((appointment) => {
            const status = (appointment.status || "pending").toLowerCase();
            const isActive = status !== "cancelled" && status !== "completed";
            const style = statusStyles[status] || { bg: "var(--bg)", fg: "var(--fg-secondary)", border: "var(--border)" };
            return (
              <div
                key={appointment.id}
                className="rounded-lg p-4 md:p-5 transition"
                style={{
                  background: "var(--bg-surface-raised)",
                  border: "1px solid var(--border-light)",
                  boxShadow: "var(--shadow-sm)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--fg)" }}
                    >
                      {appointment.doctorName || appointment.doctor || "Doctor"}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--fg-tertiary)" }}
                    >
                      {appointment.specialty || "Specialty"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-md border px-3 py-1 text-xs font-semibold"
                      style={{ background: style.bg, color: style.fg, borderColor: style.border }}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    {isActive && (
                      <button
                        type="button"
                        onClick={() => handleCancel(appointment.id)}
                        disabled={cancellingId === appointment.id}
                        className="rounded-md border px-3 py-1 text-xs font-semibold transition disabled:opacity-50"
                        style={{
                          borderColor: "#fecaca",
                          color: "#991b1b",
                          background: "transparent",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {cancellingId === appointment.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p
                      className="text-xs font-semibold uppercase"
                      style={{ color: "var(--fg-tertiary)" }}
                    >
                      Date
                    </p>
                    <p
                      className="font-medium"
                      style={{ color: "var(--fg)" }}
                    >
                      {appointment.appointmentDate || "TBD"}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase"
                      style={{ color: "var(--fg-tertiary)" }}
                    >
                      Time
                    </p>
                    <p
                      className="font-medium"
                      style={{ color: "var(--fg)" }}
                    >
                      {appointment.startTime || appointment.appointmentTime || "TBD"}{appointment.endTime ? ` - ${appointment.endTime}` : ""}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase"
                      style={{ color: "var(--fg-tertiary)" }}
                    >
                      Payment
                    </p>
                    <p
                      className="font-medium"
                      style={{ color: "var(--fg)" }}
                    >
                      {appointment.paymentMethod || "Pending"}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase"
                      style={{ color: "var(--fg-tertiary)" }}
                    >
                      Amount
                    </p>
                    <p
                      className="font-medium"
                      style={{ color: "var(--brand)" }}
                    >
                      Rs. {appointment.amount || "N/A"}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <AppointmentPrepAssistant
                    specialty={appointment.specialty || "General Medicine"}
                    reasonForVisit={appointment.notes}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 animate-slide-up rounded-lg text-sm px-5 py-3"
          style={{
            background: "var(--fg)",
            color: "#fff",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {toast}
        </div>
      )}
    </AppShell>
  );
}
