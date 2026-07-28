"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "@/app/(auth)/_components/AppShell";
import { handleGetDoctor } from "@/lib/actions/doctor-action";
import { Doctor } from "@/lib/api/doctors";
import { getProfileImageUrl, DOCTOR_PLACEHOLDER_URL } from "@/lib/utils";

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId") || "";
  const doctorNameParam = searchParams.get("doctorName") || "";
  const feeParam = searchParams.get("fee") || "1500";

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!doctorId) return;
    let cancelled = false;
    const fetchDoc = async () => {
      const result = await handleGetDoctor(doctorId);
      if (cancelled) return;
      if (result.success && result.data) {
        setDoctor(result.data);
      }
      if (!cancelled) setLoading(false);
    };
    fetchDoc();
    return () => { cancelled = true; };
  }, [doctorId, feeParam]);

  const isReady = doctorId ? !loading : true;

  const name = doctor?.fullName || doctor?.name || doctorNameParam || "Doctor";
  const specialty = doctor?.specialty || "Specialist";
  const photo = doctor ? getProfileImageUrl(doctor.photo || doctor.profileImage) : null;

  const timeSlots = [
    { label: "09:00 AM", value: "09:00" },
    { label: "10:00 AM", value: "10:00" },
    { label: "11:00 AM", value: "11:00" },
    { label: "01:00 PM", value: "13:00" },
    { label: "02:00 PM", value: "14:00" },
    { label: "03:00 PM", value: "15:00" },
    { label: "04:00 PM", value: "16:00" },
  ];

  const minDate = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return "Not selected";
    const parsed = new Date(`${selectedDate}T00:00:00`);
    return parsed.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
  }, [selectedDate]);

  const handleConfirm = () => {
    setValidationError(null);

    if (!selectedDate) {
      setValidationError("Please select a date first.");
      return;
    }
    if (!selectedSlot) {
      setValidationError("Please select a time slot first.");
      return;
    }

    const selectedSlotObj = timeSlots.find((s) => s.label === selectedSlot);
    const timeValue = selectedSlotObj?.value || "09:00";

    router.push(
      `/payments?doctorId=${doctorId}&doctorName=${encodeURIComponent(name)}&specialty=${encodeURIComponent(specialty)}&date=${selectedDate}&time=${encodeURIComponent(selectedSlot)}&timeValue=${encodeURIComponent(timeValue)}&fee=${feeParam}&notes=${encodeURIComponent(notes)}`
    );
  };

  if (!isReady) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 0", color: "var(--fg-secondary)" }}>
        <span style={{ marginBottom: "0.75rem", height: "2rem", width: "2rem", animation: "spin 1s linear infinite", borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--brand)" }} />
        <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>Loading booking form...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }} className="lg:grid-cols-3">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="lg:col-span-2">
        {/* Date Selection */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ marginBottom: "1.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
            <div>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--fg)" }}>Select Date</h2>
              <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "var(--fg-secondary)" }}>Choose a future date to view available times.</p>
            </div>
            <span style={{ borderRadius: "6px", background: "var(--brand-light)", color: "var(--brand)", padding: "0.375rem 0.75rem", fontSize: "0.8125rem", fontWeight: 600 }}>
              Flexible scheduling
            </span>
          </div>

          <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-secondary)" }} htmlFor="appointment-date">
            Appointment Date
          </label>
          <input
            id="appointment-date"
            type="date"
            min={minDate}
            value={selectedDate ?? ""}
            onChange={(event) => {
              setSelectedDate(event.target.value);
              setSelectedSlot(null);
              setValidationError(null);
            }}
            style={{
              width: "100%",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              color: "var(--fg)",
              outline: "none",
              transition: "border-color 0.15s ease",
              boxSizing: "border-box",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--brand)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />

          <div style={{ marginTop: "1rem", borderRadius: "6px", border: "1px solid var(--border-light)", background: "var(--bg)", padding: "1rem", fontSize: "0.8125rem", color: "var(--fg-secondary)" }}>
            <p style={{ fontWeight: 600, color: "var(--fg)", marginBottom: "0.25rem" }}>Availability note</p>
            <p>Appointments are available Monday through Friday from 09:00 AM to 05:00 PM, and select slots remain open on weekends.</p>
          </div>
        </div>

        {/* Time Slots */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ marginBottom: "1.25rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
            <div>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--fg)" }}>Available Time Slots</h2>
              <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "var(--fg-secondary)" }}>Choose the time that best fits your schedule.</p>
            </div>
            <span style={{ borderRadius: "6px", background: "var(--success)", color: "#fff", padding: "0.25rem 0.625rem", fontSize: "0.75rem", fontWeight: 600 }}>
              {selectedDate ? "Slots ready" : "Select a date first"}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }} className="sm:grid-cols-3 lg:grid-cols-4">
            {timeSlots.map((slot) => {
              const isSelected = selectedSlot === slot.label;
              return (
                <button
                  key={slot.label}
                  type="button"
                  onClick={() => { setSelectedSlot(slot.label); setValidationError(null); }}
                  disabled={!selectedDate}
                  style={{
                    borderRadius: "6px",
                    border: `1px solid ${isSelected ? "var(--brand)" : "var(--border)"}`,
                    background: isSelected ? "var(--brand)" : "var(--bg)",
                    color: isSelected ? "#fff" : "var(--fg-secondary)",
                    padding: "0.875rem 0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: !selectedDate ? "not-allowed" : "pointer",
                    opacity: !selectedDate ? 0.6 : 1,
                    transition: "all 0.15s ease",
                    textAlign: "center",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && selectedDate) {
                      e.currentTarget.style.borderColor = "var(--brand)";
                      e.currentTarget.style.color = "var(--brand)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected && selectedDate) {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--fg-secondary)";
                    }
                  }}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ marginBottom: "1rem", fontSize: "1.125rem", fontWeight: 700, color: "var(--fg)" }}>Clinic Notes (Optional)</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe your symptoms or add notes for the doctor..."
            rows={4}
            maxLength={500}
            style={{
              width: "100%",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              color: "var(--fg)",
              outline: "none",
              transition: "border-color 0.15s ease",
              resize: "vertical",
              boxSizing: "border-box",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--brand)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />
          <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--fg-tertiary)", textAlign: "right" }}>{notes.length}/500 characters</p>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="lg:col-span-1">
        <div style={{ position: "sticky", top: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--fg)" }}>Booking Summary</h2>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "1.5rem" }}>
            <div style={{ height: "3.5rem", width: "3.5rem", flexShrink: 0, overflow: "hidden", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
              {photo ? (
                <img src={photo} alt={name} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
              ) : (
                <img src={DOCTOR_PLACEHOLDER_URL} alt={name} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
              )}
            </div>
            <div>
              <p style={{ fontWeight: 700, color: "var(--fg)" }}>{name}</p>
              <p style={{ marginTop: "0.125rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--brand)" }}>{specialty}</p>
              <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "var(--fg-secondary)" }}>{doctor?.clinic || "Mediciti Hospital"}</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Date</span>
              <span style={{ fontWeight: 600, color: "var(--fg)" }}>{formattedSelectedDate}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Time Slot</span>
              <span style={{ fontWeight: 600, color: "var(--fg)" }}>{selectedSlot || "Not selected"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-light)", paddingTop: "1rem" }}>
              <span style={{ fontWeight: 600, color: "var(--fg)" }}>Consultation Fee</span>
              <span style={{ fontWeight: 800, color: "var(--fg)" }}>Rs. {feeParam}</span>
            </div>
          </div>

          {validationError && (
            <div style={{ borderRadius: "6px", background: "var(--bg)", border: "1px solid var(--accent)", padding: "0.75rem", fontSize: "0.875rem", color: "var(--accent)" }}>
              {validationError}
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            style={{
              width: "100%",
              borderRadius: "6px",
              background: "var(--brand)",
              color: "#fff",
              padding: "0.875rem",
              fontSize: "0.9375rem",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.15s ease",
              boxShadow: "var(--shadow-sm)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            Confirm Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <AppShell title="Book Your Appointment">
      <Suspense fallback={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 0", color: "var(--fg-secondary)" }}>
          <span style={{ marginBottom: "0.75rem", height: "2rem", width: "2rem", animation: "spin 1s linear infinite", borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--brand)" }} />
          <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>Loading booking form...</p>
        </div>
      }>
        <BookingForm />
      </Suspense>
    </AppShell>
  );
}
