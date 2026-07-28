"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AppShell from "@/app/(auth)/_components/AppShell";
import DoctorCard from "@/app/(auth)/_components/doctor-card";
import { handleListDoctors } from "@/lib/actions/doctor-action";
import { Doctor } from "@/lib/api/doctors";
import { getFavoriteDoctorIds, deduplicateDoctorPhotos } from "@/lib/utils";

export default function FavoritesPage() {
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    typeof window !== "undefined" ? getFavoriteDoctorIds() : []
  );
  const [loading, setLoading] = useState(true);

  const refreshFavorites = useCallback(() => {
    setFavoriteIds(getFavoriteDoctorIds());
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await handleListDoctors({ page: 1, limit: 50 });
      setAllDoctors(result.success && result.data ? result.data : []);
      setLoading(false);
    };

    load();

    window.addEventListener("favorites_updated", refreshFavorites);
    window.addEventListener("storage", refreshFavorites);
    return () => {
      window.removeEventListener("favorites_updated", refreshFavorites);
      window.removeEventListener("storage", refreshFavorites);
    };
  }, [refreshFavorites]);

  const favoriteDoctors = deduplicateDoctorPhotos(allDoctors.filter((d) => favoriteIds.includes(d.id)));

  return (
    <AppShell title="Favorites">
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-light)",
          borderRadius: 10,
          boxShadow: "var(--shadow-sm)",
          padding: "2rem",
        }}
      >
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: "var(--fg)" }}
            >
              My Favorite Doctors
            </h2>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--fg-tertiary)" }}
            >
              Your preferred specialists stay saved here for fast access and booking.
            </p>
          </div>
          <div
            className="px-4 py-3 text-sm"
            style={{ background: "var(--brand-light)", borderRadius: 8, color: "var(--brand)" }}
          >
            <span className="font-semibold">{favoriteDoctors.length}</span> saved doctors
          </div>
        </div>

        {loading && (
          <div
            className="flex flex-col items-center justify-center py-12"
            style={{ color: "var(--fg-tertiary)" }}
          >
            <span
              className="h-8 w-8 animate-spin mb-3"
              style={{
                borderRadius: "50%",
                border: "4px solid var(--border-light)",
                borderTopColor: "var(--brand)",
              }}
            />
            <p className="text-sm font-medium">Loading your favorites...</p>
          </div>
        )}

        {!loading && favoriteDoctors.length === 0 && (
          <div
            className="flex flex-col items-center justify-center border border-dashed p-12 text-center"
            style={{ borderRadius: 10, borderColor: "var(--border-light)", color: "var(--fg-tertiary)" }}
          >
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center"
              style={{ borderRadius: "50%", background: "var(--brand-light)" }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 fill-none"
                style={{ stroke: "var(--fg-tertiary)" }}
                strokeWidth="2"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <p
              className="text-base font-semibold"
              style={{ color: "var(--fg)" }}
            >
              No favorite doctors yet
            </p>
            <p className="mb-5 mt-1 text-sm">
              Tap the heart icon on any doctor card to save them here for quick access.
            </p>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 text-sm font-semibold text-white transition"
              style={{ background: "var(--brand)", borderRadius: 8 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--brand-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand)")}
            >
              Browse Specialists
            </Link>
          </div>
        )}

        {!loading && favoriteDoctors.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {favoriteDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
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
          </div>
        )}
      </div>
    </AppShell>
  );
}
