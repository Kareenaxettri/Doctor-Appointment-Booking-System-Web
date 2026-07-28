import { redirect } from "next/navigation";

import AppShell from "@/app/(auth)/_components/AppShell";
import ProfileForm from "@/app/(auth)/profile/_components/ProfileForm";
import { handleGetCurrentUser } from "@/lib/actions/auth-action";

export default async function ProfilePage() {
  const result = await handleGetCurrentUser();

  if (!result.success || !result.data) {
    redirect("/login");
  }

  const user = result.data;

  return (
    <AppShell title="Profile">
      <ProfileForm initialUser={user} />
    </AppShell>
  );
}
