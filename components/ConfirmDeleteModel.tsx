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
      <div className="absolute inset-0 bg-[#1d2b36]/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-6">
        <div className="w-10 h-10 rounded-full bg-[#dc2626]/10 flex items-center justify-center mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#dc2626]">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-[#1d2b36]">Delete user</h2>
        <p className="text-sm text-[#64748b] mt-1.5">
          Are you sure you want to delete <span className="font-medium text-[#1d2b36]">{userName}</span>?
          This action can&apos;t be undone.
        </p>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2.5 text-sm font-medium border border-[#e2e8f0] text-[#1d2b36] hover:bg-[#f4f7fb] transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="rounded-lg px-4 py-2.5 text-sm font-medium bg-[#dc2626] text-white hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting ? "Deleting…" : "Delete user"}
          </button>
        </div>
      </div>
    </div>
  );
}