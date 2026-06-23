import { redirect } from "next/navigation";

import AppShell from "@/app/(auth)/_components/AppShell";
import ProfileForm from "@/app/(auth)/profile/_components/ProfileForm";
import PasswordForm from "@/app/(auth)/profile/_components/PasswordForm";
import AppointmentHistory from "@/app/(auth)/profile/_components/AppointmentHistory";
import { handleGetCurrentUser } from "@/lib/actions/auth-action";

export default async function ProfilePage() {
  const result = await handleGetCurrentUser();
  console.log(result.data);

  if (!result.success || !result.data) {
    redirect("/login");
  }

  const user = result.data;
  

  return (
    <AppShell title="Profile & History Page">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProfileForm initialUser={user} />
          <AppointmentHistory />
        </div>
        <div>
          <PasswordForm />
        </div>
      </div>
    </AppShell>
  );
}
