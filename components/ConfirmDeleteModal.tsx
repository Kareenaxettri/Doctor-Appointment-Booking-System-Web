"use client";

interface Props {
  userName: string;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({ userName, submitting, onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.4)" }}
        onClick={onCancel}
      />
      <div
        className="relative w-full max-w-sm rounded-lg p-6"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ background: "var(--accent)", opacity: 0.15 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>Delete user</h2>
        <p className="text-sm mt-1.5" style={{ color: "var(--fg-secondary)" }}>
          Are you sure you want to delete <span className="font-medium" style={{ color: "var(--fg)" }}>{userName}</span>?
          This action can&apos;t be undone.
        </p>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="rounded-md px-4 py-2.5 text-sm font-medium transition"
            style={{ border: "1px solid var(--border)", background: "var(--bg-surface)", color: "var(--fg)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="rounded-md px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-60"
            style={{ background: "var(--accent)" }}
          >
            {submitting ? "Deleting\u2026" : "Delete user"}
          </button>
        </div>
      </div>
    </div>
  );
}
