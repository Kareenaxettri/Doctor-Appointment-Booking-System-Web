import AppShell from "@/app/(auth)/_components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div className="bg-white rounded-3xl shadow-sm p-8 text-center text-gray-400">
        <p className="text-lg font-semibold text-[#1d2b36] mb-1">
          Settings — coming soon
        </p>
        <p className="text-sm">
          Account preferences will live here. For now, head to{" "}
          <a href="/profile" className="text-[#2f6f7e] font-semibold hover:underline">
            Profile
          </a>{" "}
          to update your personal information or password.
        </p>
      </div>
    </AppShell>
  );
}
