"use client";

import { useState } from "react";
import {
  handleAppointmentPrep,
  type AppointmentPrepResult,
} from "@/lib/actions/ai/appointment-prep-action";

interface AppointmentPrepAssistantProps {
  specialty: string;
  reasonForVisit?: string;
}

export default function AppointmentPrepAssistant({ specialty, reasonForVisit }: AppointmentPrepAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tips, setTips] = useState<AppointmentPrepResult | null>(null);

  const loadTips = async () => {
    if (loading || tips) return;
    setLoading(true);
    setError(null);
    const result = await handleAppointmentPrep(specialty, reasonForVisit);
    if (result.success && result.data) {
      setTips(result.data);
    } else {
      setError(result.message || "Could not load preparation tips.");
    }
    setLoading(false);
  };

  return (
    <div
      className="mt-4 rounded-lg border p-4"
      style={{ borderColor: "var(--border-light)", background: "var(--bg-surface-raised)" }}
    >
      {!tips && !loading && (
        <button
          type="button"
          onClick={loadTips}
          className="flex w-full items-center justify-between text-sm font-semibold"
          style={{ color: "var(--brand)" }}
        >
          <span className="flex items-center gap-2">
            <SparkleIcon />
            How should I prepare for this appointment?
          </span>
          <span aria-hidden="true">→</span>
        </button>
      )}

      {loading && (
        <p className="text-sm" style={{ color: "var(--fg-secondary)" }}>
          Generating your preparation checklist…
        </p>
      )}

      {error && (
        <div>
          <p className="text-sm" style={{ color: "#dc2626" }}>{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              loadTips();
            }}
            className="mt-2 text-xs underline"
            style={{ color: "var(--brand)" }}
          >
            Try again
          </button>
        </div>
      )}

      {tips && (
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--fg)" }}>
            <SparkleIcon />
            How to prepare for your {specialty} appointment
          </p>

          <ul className="mb-3 space-y-1.5 text-sm" style={{ color: "var(--fg-secondary)" }}>
            {tips.generalTips.map((tip, i) => (
              <li key={`general-${i}`} className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {tips.specialtyTips.length > 0 && (
            <>
              <p
                className="mb-1.5 text-xs font-semibold uppercase"
                style={{ color: "var(--fg-tertiary)", letterSpacing: "0.05em" }}
              >
                Specific to {specialty}
              </p>
              <ul className="space-y-1.5 text-sm" style={{ color: "var(--fg-secondary)" }}>
                {tips.specialtyTips.map((tip, i) => (
                  <li key={`specialty-${i}`} className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}