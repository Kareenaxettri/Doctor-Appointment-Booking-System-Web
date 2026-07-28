import { detectGender, FEMALE_PHOTOS, MALE_PHOTOS } from "@/lib/doctor-photo-data";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";
const FAVORITES_STORAGE_KEY = "fav_doctors";

export const DOCTOR_PLACEHOLDER_URL = "/doctor-placeholder.svg";

export function getProfileImageUrl(profileImage?: string | null) {
  if (!profileImage) return null;
  if (profileImage.startsWith("http")) return profileImage;
  if (profileImage.startsWith("/doctor-photos/") || profileImage.startsWith("/doctor-hero")) return profileImage;
  return `${BASE_URL}${profileImage}`;
}

// Deterministic, collision-free fallback photo. Used only when a doctor has no
// photo at all, or when their photo URL collides with another doctor's — this
// used to just null the photo out (which made the card fall back to a generic
// gray placeholder icon), and later picked a random photo that could mismatch
// the doctor's gender. Now it draws from the same real, gender-correct
// Unsplash pools used everywhere else in the app.
function fallbackAvatarUrl(name: string, seed: string) {
  const gender = detectGender(name || seed);
  const pool = gender === "female" ? FEMALE_PHOTOS : MALE_PHOTOS;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return pool[Math.abs(hash) % pool.length];
}

export function deduplicateDoctorPhotos<
  T extends { id: string; photo?: string; profileImage?: string; fullName?: string; name?: string },
>(doctors: T[]): T[] {
  const seen = new Map<string, string>();
  return doctors.map((doc) => {
    const raw = doc.photo || doc.profileImage;
    const name = doc.fullName || doc.name || "";

    // No photo at all -> give it a unique, gender-matched fallback instead of
    // showing the generic silhouette placeholder.
    if (!raw) {
      return { ...doc, photo: fallbackAvatarUrl(name, doc.id) };
    }

    const resolved = (raw.startsWith("http") || raw.startsWith("/doctor-photos/")) ? raw : `${BASE_URL}${raw}`;
    if (seen.has(resolved)) {
      // Collides with an earlier doctor's photo — give this one a distinct,
      // gender-matched fallback instead of stripping the image entirely.
      return { ...doc, photo: fallbackAvatarUrl(name, doc.id), profileImage: undefined };
    }
    seen.set(resolved, doc.id);
    return doc;
  });
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object"
  ) {
    const response = (error as { response?: { data?: { message?: unknown } } })
      .response;
    const message = response?.data?.message;
    if (typeof message === "string" && message.length > 0) return message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function getInitials(fullName?: string | null) {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getFavoriteDoctorIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteDoctorId(id: string): string[] {
  if (typeof window === "undefined") return [];

  const current = getFavoriteDoctorIds();
  const exists = current.includes(id);
  const next = exists ? current.filter((item) => item !== id) : [...current, id];

  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function dispatchFavoritesUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("favorites_updated"));
  }
}