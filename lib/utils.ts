const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

// The backend returns profileImage as a relative path like
// "/uploads/profile/172...-123.jpg" (served via express.static in app.ts).
// Prefix it with the API base URL so <img> can load it directly.
export function getProfileImageUrl(profileImage?: string | null) {
  if (!profileImage) return null;
  if (profileImage.startsWith("http")) return profileImage;
  return `${BASE_URL}${profileImage}`;
}

// Pulls a message out of an axios error (error.response.data.message)
// without resorting to `any`. Used by lib/api/auth.ts + auth-action.ts.
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
