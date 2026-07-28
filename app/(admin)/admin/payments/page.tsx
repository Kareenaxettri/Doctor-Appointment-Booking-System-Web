"use client";

import { useCallback, useEffect, useState } from "react";
import {
  handleListPayments,
  handleUpdatePayment,
  handleDeletePayment,
} from "@/lib/actions/payment-action";
import { Payment } from "@/lib/api/payments";

const LIMIT = 10;
const STATUS_OPTIONS = ["pending", "paid", "failed", "refunded"] as const;

function statusBadgeStyle(status?: string): React.CSSProperties {
  switch (status) {
    case "paid":
      return { background: "color-mix(in srgb, var(--success) 12%, transparent)", color: "var(--success)" };
    case "refunded":
      return { background: "color-mix(in srgb, var(--info) 12%, transparent)", color: "var(--info)" };
    case "failed":
      return { background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)" };
    default:
      return { background: "color-mix(in srgb, var(--warning) 12%, transparent)", color: "var(--warning)" };
  }
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [meta, setMeta] = useState<{ page: number; totalPages: number; total: number } | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await handleListPayments({ page, limit: LIMIT, status: status || undefined });
    setLoading(false);
    if (!result.success) {
      setError(result.message || "Failed to load payments");
      return;
    }
    setPayments(result.data || []);
    setMeta(result.meta ? { page: result.meta.page, totalPages: result.meta.totalPages, total: result.meta.total } : null);
  }, [page, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const changeStatus = async (payment: Payment, next: string) => {
    if (payment.status === next) return;
    setBusyId(payment.id);
    const result = await handleUpdatePayment(payment.id, { status: next });
    setBusyId(null);
    if (!result.success) {
      setToast(result.message || "Could not update payment");
      return;
    }
    setToast(`Payment marked ${next}`);
    load();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await handleDeletePayment(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    if (!result.success) {
      setToast(result.message || "Failed to delete payment");
      return;
    }
    setToast("Payment deleted");
    if (payments.length === 1 && page > 1) {
      setPage((p) => p - 1);
    } else {
      load();
    }
  };

  const totalPages = meta?.totalPages ?? 1;
  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="px-8 py-8 max-w-6xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--fg)" }}>Payments</h1>
          <p className="text-sm mt-1" style={{ color: "var(--fg-secondary)" }}>
            Every transaction across eSewa, Khalti, Fonepay and card, in one place.
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs uppercase tracking-wide" style={{ color: "var(--fg-tertiary)" }}>This page&apos;s paid total</p>
          <p className="text-xl font-semibold" style={{ color: "var(--fg)" }}>Rs. {totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-5">
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

      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 10 }} className="overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide" style={{ borderBottom: "1px solid var(--border)", color: "var(--fg-secondary)" }}>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Doctor</th>
              <th className="px-5 py-3 font-medium">Method</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Reference</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center" style={{ color: "var(--fg-secondary)" }}>
                  <div className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full animate-spin" style={{ border: "2px solid color-mix(in srgb, var(--brand) 30%, transparent)", borderTopColor: "var(--brand)" }} />
                    Loading payments…
                  </div>
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>{error}</p>
                  <button onClick={() => load()} className="mt-3 text-sm underline underline-offset-2" style={{ color: "var(--brand)" }}>
                    Try again
                  </button>
                </td>
              </tr>
            )}

            {!loading && !error && payments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center" style={{ color: "var(--fg-secondary)" }}>
                  No payments match these filters.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              payments.map((payment) => (
                <tr key={payment.id} className="transition" style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="px-5 py-3.5">
                    <p className="font-medium" style={{ color: "var(--fg)" }}>{payment.patientName || "—"}</p>
                    <p className="text-xs" style={{ color: "var(--fg-secondary)" }}>{payment.patientEmail}</p>
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "var(--fg)" }}>{payment.doctorName || "—"}</td>
                  <td className="px-5 py-3.5 capitalize" style={{ color: "var(--fg-secondary)" }}>{payment.paymentMethod || "cash"}</td>
                  <td className="px-5 py-3.5 font-medium" style={{ color: "var(--fg)" }}>Rs. {(payment.amount || 0).toFixed(2)}</td>
                  <td className="px-5 py-3.5" style={{ color: "var(--fg-secondary)" }}>
                    <span className="font-mono text-xs">{payment.reference || payment.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={payment.status}
                      disabled={busyId === payment.id}
                      onChange={(e) => changeStatus(payment, e.target.value)}
                      className="rounded-full px-2.5 py-1 text-xs font-medium border-0 outline-none capitalize"
                      style={statusBadgeStyle(payment.status)}
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
                        onClick={() => setDeleteTarget(payment)}
                        className="rounded-md px-2.5 py-1.5 text-xs font-medium transition"
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
            <span className="font-medium" style={{ color: "var(--fg)" }}>{totalPages}</span> &middot; {meta.total} total payment
            {meta.total === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderRadius: 8, border: "1px solid var(--border)", color: "var(--fg)" }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
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
          <div className="relative w-full max-w-sm p-6" style={{ background: "var(--bg-surface)", borderRadius: 10, border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <h2 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>Delete payment</h2>
            <p className="text-sm mt-1.5" style={{ color: "var(--fg-secondary)" }}>
              Are you sure you want to delete this Rs. {(deleteTarget.amount || 0).toFixed(2)} payment from{" "}
              <span className="font-medium" style={{ color: "var(--fg)" }}>{deleteTarget.patientName || "this patient"}</span>? This can&apos;t be undone.
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
                {deleting ? "Deleting…" : "Delete payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-6 right-6 text-sm px-4 py-2.5 shadow-lg" style={{ background: "var(--fg)", color: "var(--fg-inverse)", borderRadius: 8 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
