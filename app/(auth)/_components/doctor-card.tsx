"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dispatchFavoritesUpdated, getFavoriteDoctorIds, getProfileImageUrl, DOCTOR_PLACEHOLDER_URL } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export type DoctorCardItem = {
  id: string;
  name?: string;
  fullName?: string;
  specialty?: string;
  specialization?: string;
  clinic?: string;
  clinicAddress?: string;
  hospital?: string;
  photo?: string;
  profileImage?: string;
  rating?: number;
  experienceYears?: number;
  consultationFee?: number;
  availability?: string;
};

export default function DoctorCard({ doctor, index = 0 }: { doctor: DoctorCardItem; index?: number }) {
  const name = doctor.name || doctor.fullName || "Doctor";
  const specialty = doctor.specialty || doctor.specialization || "Specialist";
  const photo = getProfileImageUrl(doctor.photo || doctor.profileImage);
  const [imgError, setImgError] = useState(false);
  const [placeholderError, setPlaceholderError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => {
    if (typeof window === "undefined") return false;
    return getFavoriteDoctorIds().includes(doctor.id);
  });
  const { ref, isVisible } = useScrollReveal({ delay: index * 60 });

  useEffect(() => {
    const check = () => setIsFavorite(getFavoriteDoctorIds().includes(doctor.id));
    window.addEventListener("favorites_updated", check);
    return () => window.removeEventListener("favorites_updated", check);
  }, [doctor.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const updatedFavorites = getFavoriteDoctorIds();
    const exists = updatedFavorites.includes(doctor.id);
    const next = exists
      ? updatedFavorites.filter((id) => id !== doctor.id)
      : [...updatedFavorites, doctor.id];

    if (typeof window !== "undefined") {
      localStorage.setItem("fav_doctors", JSON.stringify(next));
      setIsFavorite(!exists);
      dispatchFavoritesUpdated();
    }
  };

  const initials = name.replace(/^Dr\.?\s*/i, "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const gradients = [
    ["#1a7a6d", "#2f6f7e"],
    ["#2f6f7e", "#1a5c6e"],
    ["#15645a", "#1a7a6d"],
    ["#1a5c6e", "#2f6f7e"],
    ["#2f6f7e", "#15645a"],
    ["#1a7a6d", "#15645a"],
    ["#15645a", "#1a5c6e"],
    ["#2f6f7e", "#1a7a6d"],
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const [gradA, gradB] = gradients[Math.abs(hash) % gradients.length];

  return (
    <div
      ref={ref}
      className="group flex h-full flex-col justify-between transition-all duration-300 hover-lift"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-light)",
        borderRadius: "10px",
        boxShadow: "var(--shadow-sm)",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.2s ease",
        transitionDelay: `${index * 60}ms`,
      }}
    >
      <div>
        {/* Image area */}
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: "10px 10px 0 0" }}
        >
          <div
            className="relative h-52 overflow-hidden"
            style={{ background: "var(--bg-surface-raised)" }}
          >
            {photo && !imgError ? (
              <img
                src={photo}
                alt={name}
                className="card-image-zoom h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : !placeholderError ? (
              <img
                src={DOCTOR_PLACEHOLDER_URL}
                alt={name}
                className="h-full w-full object-cover"
                style={{ objectPosition: "center 20%" }}
                onError={() => setPlaceholderError(true)}
              />
            ) : (
              <div
                className="flex h-full items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${gradA} 0%, ${gradB} 100%)` }}
              >
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#fff", opacity: 0.85 }}
                >
                  {initials || "DR"}
                </span>
              </div>
            )}

            {/* Gradient overlay at bottom of image */}
            <div
              className="absolute bottom-0 left-0 right-0 h-16"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={toggleFavorite}
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
            style={{
              background: isFavorite ? "var(--accent)" : "rgba(255,255,255,0.9)",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              style={{
                fill: isFavorite ? "#fff" : "none",
                stroke: isFavorite ? "#fff" : "var(--fg-tertiary)",
              }}
              strokeWidth="2"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          {/* Rating badge */}
          <div
            className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold"
            style={{
              background: "rgba(255,255,255,0.92)",
              color: "var(--fg)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              zIndex: 2,
            }}
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="var(--warning)" stroke="var(--warning)" strokeWidth="1">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>{(doctor.rating ?? 4.8).toFixed(1)}</span>
          </div>

          {/* Specialty badge */}
          <div
            className="absolute bottom-3 right-3 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
            style={{
              background: "var(--brand)",
              color: "#fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              zIndex: 2,
            }}
          >
            {specialty}
          </div>
        </div>

        {/* Info section */}
        <div className="px-3.5 pt-3.5">
          <Link href={`/doctors/${doctor.id}`} className="block transition-colors duration-200 group/link">
            <h3
              className="text-[15px] font-semibold line-clamp-1 transition-colors duration-200"
              style={{ color: "var(--fg)" }}
            >
              <span className="group-hover/link:opacity-80">{name}</span>
            </h3>
          </Link>

          <p className="mt-1.5 text-xs font-medium flex items-center gap-1.5" style={{ color: "var(--fg-secondary)" }}>
            <svg className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--brand)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="line-clamp-1">{doctor.hospital || doctor.clinic || "Kathmandu Medical Center"}</span>
          </p>

          {/* Stats row */}
          <div
            className="mt-3 flex items-center gap-3 rounded-md px-3 py-2.5 text-xs"
            style={{ background: "var(--bg)", border: "1px solid var(--border-light)" }}
          >
            <div className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" style={{ color: "var(--fg-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ color: "var(--fg-secondary)" }}>{doctor.experienceYears ?? 10}+ yrs</span>
            </div>
            <div className="h-3 w-px" style={{ background: "var(--border)" }} />
            <div className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" style={{ color: "var(--brand)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold" style={{ color: "var(--brand)" }}>Rs. {doctor.consultationFee ?? 1500}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-3 px-3.5 pb-3.5 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "var(--success)",
              animation: "pulse-gentle 2s ease-in-out infinite",
            }}
          />
          <span className="font-medium" style={{ color: "var(--success)" }}>
            {doctor.availability || "Available today"}
          </span>
        </div>

        <Link
          href={`/appointments/booking?doctorId=${doctor.id}&doctorName=${encodeURIComponent(name)}&fee=${doctor.consultationFee ?? 1500}`}
          className="w-full inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
          style={{ background: "var(--brand)" }}
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
