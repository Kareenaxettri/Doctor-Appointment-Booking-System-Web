"use client";

import { use, useEffect, useState, startTransition } from "react";
import Link from "next/link";
import AppShell from "@/app/(auth)/_components/AppShell";
import { handleGetDoctor } from "@/lib/actions/doctor-action";
import { Doctor } from "@/lib/api/doctors";
import { dispatchFavoritesUpdated, getFavoriteDoctorIds, getProfileImageUrl, DOCTOR_PLACEHOLDER_URL } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? "var(--accent)" : "none"}
      stroke={filled ? "var(--accent)" : "var(--border)"}
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function DoctorProfilePage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [placeholderError, setPlaceholderError] = useState(false);

  const heroReveal = useScrollReveal({ delay: 0 });
  const specsReveal = useScrollReveal({ delay: 80 });
  const reviewsReveal = useScrollReveal({ delay: 120 });
  const bookingReveal = useScrollReveal({ delay: 60 });

  useEffect(() => {
    const loadDoctor = async () => {
      setLoading(true);
      setError(null);
      const result = await handleGetDoctor(params.id);

      if (result.success && result.data) {
        setDoctor(result.data);
      } else {
        setError(result.message || "Doctor not found");
      }
      setLoading(false);
    };

    loadDoctor();
    startTransition(() => {
      setIsFavorite(getFavoriteDoctorIds().includes(params.id));
    });
  }, [params.id]);

  const toggleFavorite = () => {
    if (typeof window === "undefined") return;

    const favorites = getFavoriteDoctorIds();
    const next = favorites.includes(params.id)
      ? favorites.filter((id) => id !== params.id)
      : [...favorites, params.id];

    localStorage.setItem("fav_doctors", JSON.stringify(next));
    setIsFavorite(!favorites.includes(params.id));
    dispatchFavoritesUpdated();
  };

  if (loading) {
    return (
      <AppShell title="Doctor Profile">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "5rem 0",
            color: "var(--fg-secondary)",
          }}
        >
          <span
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              border: "4px solid var(--border)",
              borderTopColor: "var(--brand)",
              animation: "spin 0.8s linear infinite",
              marginBottom: "1rem",
            }}
          />
          <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>Loading specialist profile...</p>
        </div>
      </AppShell>
    );
  }

  if (error || !doctor) {
    return (
      <AppShell title="Doctor Profile">
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-light)",
            borderRadius: "8px",
            padding: "2rem",
            textAlign: "center",
            color: "var(--fg-secondary)",
          }}
        >
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              height: "3.5rem",
              width: "3.5rem",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: "var(--bg-surface-raised)",
              marginInline: "auto",
            }}
          >
            <svg
              style={{ height: "1.5rem", width: "1.5rem", color: "var(--fg-tertiary)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--fg)" }}>Error loading doctor profile</p>
          <p style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>{error || "Doctor details could not be retrieved."}</p>
          <Link
            href="/dashboard"
            style={{
              display: "inline-block",
              marginTop: "1rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--brand)",
              textDecoration: "none",
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  const name = doctor.fullName || doctor.name || "Doctor";
  const specialty = doctor.specialty || doctor.specialization || "Specialist";
  const photo = getProfileImageUrl(doctor.photo || doctor.profileImage);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AppShell title="Doctor Profile">
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}
        className="lg:!grid-cols-3"
      >
        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="lg:!col-span-2">
          {/* MAIN INFO CARD */}
          <div
            ref={heroReveal.ref}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              borderRadius: "8px",
              padding: "1.5rem 2rem",
              position: "relative",
              opacity: heroReveal.isVisible ? 1 : 0,
              transform: heroReveal.isVisible ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.45s ease, transform 0.45s ease, box-shadow 0.2s ease",
              boxShadow: "var(--shadow-sm)",
            }}
            className="hover-lift-card"
          >
            <style>{`
              .hover-lift-card:hover {
                box-shadow: var(--shadow-md) !important;
                transform: translateY(-2px) !important;
              }
            `}</style>
            <button
              onClick={toggleFavorite}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "6px",
                background: "var(--bg-surface-raised)",
                border: "1px solid var(--border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.2s, border-color 0.2s, transform 0.2s",
              }}
              className="fav-btn"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <style>{`
                .fav-btn:hover {
                  background: var(--border-light);
                  border-color: var(--border);
                  transform: scale(1.1);
                }
                .fav-btn:active {
                  transform: scale(0.95);
                }
              `}</style>
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  transition: "fill 0.25s ease, stroke 0.25s ease, transform 0.25s ease",
                  fill: isFavorite ? "var(--accent)" : "none",
                  stroke: isFavorite ? "var(--accent)" : "var(--fg-tertiary)",
                  transform: isFavorite ? "scale(1.1)" : "scale(1)",
                }}
                strokeWidth="2"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            <div
              style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}
              className="flex-col sm:!flex-row"
            >
              <div
                style={{
                  width: "7.5rem",
                  height: "7.5rem",
                  borderRadius: "8px",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: "2.5px solid var(--brand)",
                  position: "relative",
                }}
                className="sm:!w-40 sm:!h-40"
              >
                {photo && !imgError ? (
                  <>
                    <img
                      src={photo}
                      alt={name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", position: "relative", zIndex: 1 }}
                      onError={() => setImgError(true)}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.08) 100%)",
                        zIndex: 2,
                        pointerEvents: "none",
                      }}
                    />
                  </>
                ) : !placeholderError ? (
                  <img
                    src={DOCTOR_PLACEHOLDER_URL}
                    alt={name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={() => setPlaceholderError(true)}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, var(--brand-light), var(--bg-surface-raised))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--brand)",
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {initials || "DR"}
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--fg)", letterSpacing: "-0.01em" }}>
                  {name}
                </h1>
                <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--brand)", marginTop: "0.25rem" }}>
                  {specialty}
                </p>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--fg-tertiary)",
                    marginTop: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  <svg
                    style={{ width: "1rem", height: "1rem" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {doctor.clinic || "Mediciti Hospital, Lalitpur"}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "0.5rem",
                    marginTop: "1.5rem",
                    background: "var(--bg-surface-raised)",
                    borderRadius: "8px",
                    padding: "1rem",
                    textAlign: "center",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "0.6875rem", color: "var(--fg-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Rating
                    </p>
                    <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--fg)", marginTop: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem" }}>
                      <StarIcon filled={true} /> {(doctor.rating || 4.8).toFixed(1)}
                    </p>
                  </div>
                  <div style={{ borderLeft: "1px solid var(--border-light)", borderRight: "1px solid var(--border-light)" }}>
                    <p style={{ fontSize: "0.6875rem", color: "var(--fg-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Experience
                    </p>
                    <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--fg)", marginTop: "0.25rem" }}>
                      {doctor.experienceYears || 10}+ Yrs
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.6875rem", color: "var(--fg-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Fee
                    </p>
                    <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--brand)", marginTop: "0.25rem" }}>
                      Rs. {doctor.consultationFee || 1500}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "2rem", borderTop: "1px solid var(--border-light)", paddingTop: "1.5rem" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--fg)", marginBottom: "0.75rem" }}>
                About Doctor
              </h2>
              <p style={{ fontSize: "0.8125rem", color: "var(--fg-secondary)", lineHeight: 1.7 }}>
                {doctor.bio ||
                  `${name} is a certified medical practitioner specialized in ${specialty}. With over ${doctor.experienceYears || 10} years of dedicated practice, they provide exceptional healthcare services at ${doctor.clinic || "the clinic"}.`}
              </p>
            </div>
          </div>

          {/* SPECIALIZATIONS CARD */}
          <div
            ref={specsReveal.ref}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              borderRadius: "8px",
              padding: "1.5rem 2rem",
              opacity: specsReveal.isVisible ? 1 : 0,
              transform: specsReveal.isVisible ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.45s ease, transform 0.45s ease",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--fg)", marginBottom: "1rem" }}>
              Specializations
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {[specialty, "General Consultation", "Patient Diagnosis", "Preventive Care", "Chronic Conditions Management"].map(
                (spec) => (
                  <span
                    key={spec}
                    style={{
                      background: "var(--bg-surface-raised)",
                      border: "1px solid var(--border-light)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      color: "var(--fg-secondary)",
                      transition: "background 0.15s ease, color 0.15s ease, border-color 0.15s ease",
                      cursor: "default",
                    }}
                    className="spec-tag"
                  >
                    {spec}
                  </span>
                )
              )}
              <style>{`
                .spec-tag:hover {
                  background: var(--brand-light) !important;
                  color: var(--brand) !important;
                  border-color: var(--brand) !important;
                }
              `}</style>
            </div>
          </div>

          {/* REVIEWS CARD */}
          <div
            ref={reviewsReveal.ref}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              borderRadius: "8px",
              padding: "1.5rem 2rem",
              opacity: reviewsReveal.isVisible ? 1 : 0,
              transform: reviewsReveal.isVisible ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.45s ease, transform 0.45s ease",
              boxShadow: "var(--shadow-sm)",
            }}
            className="hover-lift-card"
          >
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--fg)", marginBottom: "1.5rem" }}>
              Patient Reviews
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                {
                  name: "Aarav Sharma",
                  date: "July 12, 2026",
                  rating: 5,
                  comment: `Excellent experience with ${name}. Very thorough and professional. Highly recommended for anyone seeking quality healthcare.`,
                },
                {
                  name: "Sita Tamang",
                  date: "June 28, 2026",
                  rating: 4,
                  comment: "Very professional and comforting. The clinic staff was also very welcoming. Would definitely recommend.",
                },
              ].map((rev, idx) => (
                <div
                  key={idx}
                  style={{
                    borderBottom: idx < 1 ? "1px solid var(--border-light)" : "none",
                    paddingBottom: idx < 1 ? "1.5rem" : 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.8125rem", color: "var(--fg)" }}>{rev.name}</p>
                    <span style={{ fontSize: "0.75rem", color: "var(--fg-tertiary)" }}>{rev.date}</span>
                  </div>
                  <div style={{ display: "flex", gap: "2px", marginBottom: "0.5rem" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} filled={i < rev.rating} />
                    ))}
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--fg-secondary)", lineHeight: 1.7 }}>{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:!col-span-1">
          <div
            ref={bookingReveal.ref}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              borderRadius: "8px",
              padding: "1.5rem 2rem",
              position: "sticky",
              top: "1.5rem",
              opacity: bookingReveal.isVisible ? 1 : 0,
              transform: bookingReveal.isVisible ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.45s ease, transform 0.45s ease",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--fg)", marginBottom: "1.5rem" }}>
              Book Appointment
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--bg-surface-raised)",
                  borderRadius: "8px",
                  padding: "1rem",
                  border: "1px solid var(--border-light)",
                }}
              >
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--fg-secondary)" }}>
                  Consultation Fee
                </span>
                <span style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--brand)" }}>
                  Rs. {doctor.consultationFee || 1500}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.8125rem", color: "var(--fg-secondary)" }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "6px",
                      background: "var(--bg-surface-raised)",
                      flexShrink: 0,
                    }}
                  >
                    <svg style={{ width: "1rem", height: "1rem", color: "var(--brand)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--fg)" }}>Availability</p>
                    <p style={{ fontSize: "0.75rem" }}>{doctor.availability || "Mon - Fri (09:00 AM - 05:00 PM)"}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.8125rem", color: "var(--fg-secondary)" }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "6px",
                      background: "var(--bg-surface-raised)",
                      flexShrink: 0,
                    }}
                  >
                    <svg style={{ width: "1rem", height: "1rem", color: "var(--brand)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: "var(--fg)" }}>Clinic Location</p>
                    <p style={{ fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {doctor.clinic || "Mediciti Hospital"}
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderRadius: "6px",
                  background: "var(--bg-surface-raised)",
                  border: "1px solid var(--border-light)",
                  padding: "0.75rem",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--success)" }}>
                  {doctor.availability || "Available today"}
                </p>
              </div>

              <Link
                href={`/appointments/booking?doctorId=${doctor.id}&doctorName=${encodeURIComponent(name)}&fee=${doctor.consultationFee || 1500}`}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  background: "var(--brand)",
                  color: "#fff",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  borderRadius: "8px",
                  padding: "0.875rem",
                  marginTop: "0.5rem",
                  textDecoration: "none",
                  transition: "opacity 0.15s, box-shadow 0.2s ease, transform 0.15s ease",
                  boxShadow: "none",
                }}
                className="book-btn-glow"
              >
                Book Appointment
              </Link>
              <style>{`
                .book-btn-glow:hover {
                  opacity: 0.92;
                  box-shadow: 0 0 0 3px var(--brand-light), var(--shadow-md);
                  transform: translateY(-1px);
                }
                .book-btn-glow:active {
                  transform: translateY(0);
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
