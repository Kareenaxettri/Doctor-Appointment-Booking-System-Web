"use client";

import { useCallback, useEffect, useState } from "react";
import {
  handleListAppointments,
  handleUpdateAppointment,
  handleDeleteAppointment,
} from "@/lib/actions/appointment-action";
import { Appointment } from "@/lib/api/appointments";

const LIMIT = 10;
const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"] as const;

function statusBadgeStyle(status?: string): React.CSSProperties {
  switch (status) {
    case "completed":
      return { background: "color-mix(in srgb, var(--success) 12%, transparent)", color: "var(--success)" };
    case "confirmed":
      return { background: "var(--brand-light)", color: "var(--brand)" };
    case "cancelled":
      return { background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)" };
    default:
      return { background: "color-mix(in srgb, var(--warning) 12%, transparent)", color: "var(--warning)" };
  }
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [meta, setMeta] = useState<{ page: number; totalPages: number; total: number } | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await handleListAppointments({ page, limit: LIMIT, search, status: status || undefined });
    setLoading(false);
    if (!result.success) {
      setError(result.message || "Failed to load appointments");
      return;
    }
    setAppointments(result.data || []);
    setMeta(result.meta ? { page: result.meta.page, totalPages: result.meta.totalPages, total: result.meta.total } : null);
  }, [page, search, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const changeStatus = async (appointment: Appointment, next: string) => {
    if (appointment.status === next) return;
    setBusyId(appointment.id);
    const result = await handleUpdateAppointment(appointment.id, { status: next });
    setBusyId(null);
    if (!result.success) {
      setToast(result.message || "Could not update appointment");
      return;
    }
    setToast(`Appointment marked ${next}`);
    load();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await handleDeleteAppointment(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    if (!result.success) {
      setToast(result.message || "Failed to delete appointment");
      return;
    }
    setToast("Appointment deleted");
    if (appointments.length === 1 && page > 1) {
      setPage((p) => p - 1);
    } else {
      load();
    }
  };

  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="px-8 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--fg)" }}>Appointments</h1>
        <p className="text-sm mt-1" style={{ color: "var(--fg-secondary)" }}>
          Review every booking, update its status, or remove it entirely.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <form onSubmit={onSearchSubmit} className="flex gap-2 max-w-md flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--fg-tertiary)" }}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by doctor or symptoms…"
              className="w-full pl-9 pr-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand)]/30 focus:border-[color:var(--brand)]"
              style={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-surface)", color: "var(--fg)" }}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 text-sm font-medium transition hover:opacity-90"
            style={{ borderRadius: 8, border: "1px solid var(--border)", color: "var(--fg)" }}
          >
            Search
          </button>
        </form>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2.5 text-sm outline-none"
          style={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-surface)", color: "var(--fg)" }}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: 10 }} className="overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide" style={{ borderBottom: "1px solid var(--border-light)", color: "var(--fg-tertiary)" }}>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Doctor</th>
              <th className="px-5 py-3 font-medium">Date &amp; time</th>
              <th className="px-5 py-3 font-medium">Payment</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center" style={{ color: "var(--fg-secondary)" }}>
                  <div className="inline-flex items-center gap-2">
                    <span
                      className="h-4 w-4 rounded-full border-2 animate-spin"
                      style={{ borderColor: "var(--border-light)", borderTopColor: "var(--brand)" }}
                    />
                    Loading appointments…
                  </div>
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>{error}</p>
                  <button onClick={() => load()} className="mt-3 text-sm underline underline-offset-2" style={{ color: "var(--brand)" }}>
                    Try again
                  </button>
                </td>
              </tr>
            )}

            {!loading && !error && appointments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center" style={{ color: "var(--fg-secondary)" }}>
                  No appointments match these filters.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              appointments.map((appt) => (
                <tr
                  key={appt.id}
                  className="last:border-0 transition"
                  style={{ borderBottom: "1px solid var(--border-light)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium" style={{ color: "var(--fg)" }}>{appt.patientName || "—"}</p>
                    <p className="text-xs" style={{ color: "var(--fg-secondary)" }}>{appt.patientEmail}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium" style={{ color: "var(--fg)" }}>{appt.doctorName || "—"}</p>
                    <p className="text-xs" style={{ color: "var(--fg-secondary)" }}>{appt.specialty}</p>
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "var(--fg-secondary)" }}>
                    {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : "—"}
                    {appt.appointmentTime ? ` · ${appt.appointmentTime}` : ""}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "var(--fg-secondary)" }}>
                    <p>Rs. {appt.amount ?? 0}</p>
                    <p className="text-xs capitalize">{appt.paymentMethod || "—"} · {appt.paymentStatus || "pending"}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={appt.status}
                      disabled={busyId === appt.id}
                      onChange={(e) => changeStatus(appt, e.target.value)}
                      className="rounded-full px-2.5 py-1 text-xs font-medium border-0 outline-none capitalize"
                      style={statusBadgeStyle(appt.status)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setDeleteTarget(appt)}
                        className="rounded-md px-2.5 py-1.5 text-xs font-medium transition hover:opacity-90"
                        style={{ border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)", color: "var(--accent)" }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!loading && !error && meta && meta.total > 0 && (
        <div className="flex items-center justify-between mt-5 text-sm" style={{ color: "var(--fg-secondary)" }}>
          <p>
            Showing page <span className="font-medium" style={{ color: "var(--fg)" }}>{meta.page}</span> of{" "}
            <span className="font-medium" style={{ color: "var(--fg)" }}>{totalPages}</span> · {meta.total} total appointment
            {meta.total === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
              style={{ borderRadius: 8, border: "1px solid var(--border)", color: "var(--fg)" }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
              style={{ borderRadius: 8, border: "1px solid var(--border)", color: "var(--fg)" }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm p-6" style={{ background: "var(--bg-surface)", borderRadius: 10, border: "1px solid var(--border-light)", boxShadow: "var(--shadow-lg)" }}>
            <h2 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>Delete appointment</h2>
            <p className="text-sm mt-1.5" style={{ color: "var(--fg-secondary)" }}>
              Are you sure you want to delete the appointment for{" "}
              <span className="font-medium" style={{ color: "var(--fg)" }}>{deleteTarget.patientName || "this patient"}</span> with{" "}
              <span className="font-medium" style={{ color: "var(--fg)" }}>{deleteTarget.doctorName}</span>? This can&apos;t be undone.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 text-sm font-medium transition"
                style={{ borderRadius: 8, border: "1px solid var(--border)", color: "var(--fg)" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2.5 text-sm font-medium transition disabled:opacity-60"
                style={{ borderRadius: 8, background: "var(--accent)", color: "var(--fg-inverse)" }}
              >
                {deleting ? "Deleting…" : "Delete appointment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-6 right-6 text-sm px-4 py-2.5 shadow-lg" style={{ borderRadius: 8, background: "var(--fg)", color: "var(--fg-inverse)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
