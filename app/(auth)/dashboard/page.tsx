"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/app/(auth)/_components/AppShell";
import DoctorCard from "@/app/(auth)/_components/doctor-card";
import { useAuth } from "@/lib/contexts/AuthContext";
import { handleListDoctors } from "@/lib/actions/doctor-action";
import { Doctor } from "@/lib/api/doctors";
import { specialtyFilters as doctorSpecialtyFilters } from "@/app/(auth)/_components/mock-doctors";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { deduplicateDoctorPhotos } from "@/lib/utils";

const specialtyFilters = doctorSpecialtyFilters;

const specialtyKeywords: Record<string, string[]> = {
  cardiology: ["cardio", "heart"],
  dermatology: ["derm", "skin"],
  pediatrics: ["pediatr", "child"],
  neurology: ["neuro", "brain"],
  orthopedics: ["ortho", "bone"],
  gynecology: ["gyn", "obgyn", "women"],
  ent: ["ent", "ear", "throat"],
  dentistry: ["dent", "oral"],
  ophthalmology: ["ophthalm", "eye", "vision"],
  psychiatry: ["psych", "mental"],
  "general medicine": ["physician", "medicine", "general"],
};

function matchesSpecialty(specialty: string, filterTerm: string): boolean {
  if (filterTerm === "all specialists") return true;
  const keywords = specialtyKeywords[filterTerm];
  if (keywords) {
    return keywords.some((kw) => specialty.includes(kw));
  }
  return specialty.includes(filterTerm);
}

const specialtyIcons: Record<string, string> = {
  "all specialists": "M4 6h16M4 12h16M4 18h16",
  cardiology: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  dermatology: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  pediatrics: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  neurology: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  orthopedics: "M13 10V3L4 14h7v7l9-11h-7z",
  gynecology: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  ent: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z",
  dentistry: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  ophthalmology: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  psychiatry: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  "general medicine": "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All Specialists");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "fee-low" | "fee-high" | "experience">("rating");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const heroReveal = useScrollReveal();
  const statsReveal = useScrollReveal({ delay: 100 });

  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true);
      setError(null);
      const result = await handleListDoctors({ page: 1, limit: 50 });

      if (result.success && result.data) {
        setDoctors(result.data);
      } else {
        setDoctors([]);
        setError(result.message || "Failed to load doctors. Please try again.");
      }
      setLoading(false);
    };

    loadDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const filtered = doctors.filter((doctor) => {
      const name = (doctor.fullName || doctor.name || "").toLowerCase();
      const specialty = (doctor.specialty || doctor.specialization || "").toLowerCase();
      const clinic = (doctor.clinic || doctor.clinicAddress || "").toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        name.includes(query) || specialty.includes(query) || clinic.includes(query);
      const matchesFilter = matchesSpecialty(specialty, activeFilter.toLowerCase());

      return matchesSearch && matchesFilter;
    });

    return deduplicateDoctorPhotos(filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "fee-low":
          return (a.consultationFee || 0) - (b.consultationFee || 0);
        case "fee-high":
          return (b.consultationFee || 0) - (a.consultationFee || 0);
        case "experience":
          return (b.experienceYears || 0) - (a.experienceYears || 0);
        default:
          return 0;
      }
    }));
  }, [activeFilter, searchQuery, sortBy, doctors]);

  return (
    <AppShell title="Find Doctors">
      {/* Hero Banner */}
      <div
        ref={heroReveal.ref}
        className="relative overflow-hidden rounded-xl p-6 md:p-8 mb-6"
        style={{
          background: "linear-gradient(135deg, var(--brand) 0%, color-mix(in srgb, var(--brand) 70%, #111) 100%)",
          opacity: heroReveal.isVisible ? 1 : 0,
          transform: heroReveal.isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-10" style={{ background: "#fff" }} />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full opacity-10" style={{ background: "#fff" }} />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
              Find Your Specialist
            </h1>
            <p className="text-sm max-w-lg" style={{ color: "rgba(255,255,255,0.8)" }}>
              {user?.fullName ? `Welcome back, ${user.fullName}. ` : ""}
              Browse trusted clinicians across Kathmandu with modern booking and reliable care coordination.
            </p>
          </div>
          <div
            className="flex items-center gap-4 rounded-lg px-5 py-3"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{doctors.length}</p>
              <p className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>Specialists</p>
            </div>
            <div className="h-10 w-px" style={{ background: "rgba(255,255,255,0.2)" }} />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div
        className="rounded-xl p-5 md:p-6 mb-6"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Search */}
        <div
          className="mb-5 flex max-w-2xl items-center gap-2 p-2"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border-light)",
            borderRadius: "8px",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--brand)";
            e.currentTarget.style.boxShadow = "0 0 0 3px var(--brand-light)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-light)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <svg
            className="h-5 w-5 shrink-0 ml-2"
            style={{ color: "var(--fg-tertiary)" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search doctors, specializations, clinics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
            style={{ color: "var(--fg)" }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear"
              className="flex h-7 w-7 items-center justify-center rounded-md transition"
              style={{ color: "var(--fg-tertiary)", background: "var(--bg-surface-raised)" }}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters + Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {specialtyFilters.map((filter) => {
              const iconPath = specialtyIcons[filter.toLowerCase()];
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium transition-all duration-200"
                  style={{
                    borderRadius: "6px",
                    border: activeFilter === filter ? "1px solid var(--brand)" : "1px solid var(--border-light)",
                    background: activeFilter === filter ? "var(--brand)" : "var(--bg)",
                    color: activeFilter === filter ? "#fff" : "var(--fg-secondary)",
                    boxShadow: activeFilter === filter ? "0 2px 6px rgba(26,122,109,0.2)" : "none",
                    transform: activeFilter === filter ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  {iconPath && (
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path d={iconPath} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {filter}
                </button>
              );
            })}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="cursor-pointer px-3 py-2 text-xs font-medium outline-none"
            style={{
              borderRadius: "8px",
              border: "1px solid var(--border-light)",
              background: "var(--bg)",
              color: "var(--fg-secondary)",
            }}
          >
            <option value="rating">Sort by Rating</option>
            <option value="fee-low">Fee: Low to High</option>
            <option value="fee-high">Fee: High to Low</option>
            <option value="experience">Most Experienced</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="shimmer-loading rounded-xl"
              style={{ height: "380px" }}
            />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="py-6 text-center">
          <p className="text-sm" style={{ color: "#dc2626" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline"
            style={{ color: "var(--brand)" }}
          >
            Try again
          </button>
        </div>
      )}

      {/* Doctor grid */}
      {!loading && !error && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--fg-tertiary)" }} aria-live="polite">
              Showing {filteredDoctors.length} of {doctors.length} doctors
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredDoctors.map((doctor, idx) => (
              <DoctorCard
                key={doctor.id}
                index={idx}
                doctor={{
                  id: doctor.id,
                  name: doctor.name || doctor.fullName,
                  fullName: doctor.fullName,
                  specialty: doctor.specialty,
                  specialization: doctor.specialization,
                  clinic: doctor.clinic,
                  clinicAddress: doctor.clinicAddress,
                  photo: doctor.photo,
                  profileImage: doctor.profileImage,
                  rating: doctor.rating,
                  availability: doctor.availability,
                  experienceYears: doctor.experienceYears,
                  consultationFee: doctor.consultationFee,
                }}
              />
            ))}

            {filteredDoctors.length === 0 && (
              <div
                className="col-span-full flex flex-col items-center justify-center p-12 text-center"
                style={{
                  border: "1px dashed var(--border)",
                  borderRadius: "10px",
                  color: "var(--fg-tertiary)",
                }}
              >
                <div
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ background: "var(--brand-light)" }}
                >
                  <svg
                    className="h-7 w-7"
                    style={{ color: "var(--brand)" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-base font-semibold" style={{ color: "var(--fg)" }}>
                  No specialists found
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--fg-tertiary)" }}>Try resetting your search or picking another specialization.</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveFilter("All Specialists"); }}
                  className="mt-4 rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200"
                  style={{ color: "var(--brand)", background: "var(--brand-light)" }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </AppShell>
  );
}