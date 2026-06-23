import AppShell from "@/app/(auth)/_components/AppShell";
import AppointmentHistory from "@/app/(auth)/profile/_components/AppointmentHistory";

export default function AppointmentsPage() {
  return (
    <AppShell title="My Appointments">
      <AppointmentHistory />
    </AppShell>
  );
}
