"use client";

import { useState } from "react";
import AppShell from "@/app/(auth)/_components/AppShell";
import PasswordForm from "@/app/(auth)/profile/_components/PasswordForm";

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-between py-4 border-b last:border-b-0 transition-colors"
      style={{ borderColor: "var(--border-light)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div className="pr-6">
        <p className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
          {title}
        </p>
        <p
          className="text-xs mt-0.5 leading-relaxed"
          style={{ color: "var(--fg-tertiary)" }}
        >
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full transition shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          background: checked ? "var(--brand)" : "var(--border-light)",
          borderRadius: 9999,
          ["--tw-ring-color" as string]: "var(--brand)",
        }}
        aria-checked={checked}
        role="switch"
        aria-label={title}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform"
          style={{ borderRadius: 9999, transform: checked ? "translateX(20px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}

type SettingsTab = "notifications" | "security" | "password";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("notifications");

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    reminders: true,
    promotions: false,
  });

  const [privacy, setPrivacy] = useState({
    twoFactor: false,
    dataSharing: true,
  });

  const tabs: { id: SettingsTab; label: string; icon: React.JSX.Element }[] = [
    {
      id: "notifications",
      label: "Notifications",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "security",
      label: "Security",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "password",
      label: "Password",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <AppShell title="Settings">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div
            className="p-5 shadow-sm"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              borderRadius: 10,
            }}
          >
            {/* Tab Navigation */}
            <nav className="space-y-1" role="tablist" aria-label="Settings sections">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition"
                  style={{
                    borderRadius: 8,
                    background: activeTab === tab.id ? "var(--brand)" : "transparent",
                    color: activeTab === tab.id ? "#fff" : "var(--fg-secondary)",
                    boxShadow: activeTab === tab.id ? "var(--shadow-sm)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = "var(--bg-hover)";
                      e.currentTarget.style.color = "var(--fg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--fg-secondary)";
                    }
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Notification Preferences */}
          {activeTab === "notifications" && (
            <div
              className="p-6 shadow-sm md:p-8 animate-fade-in"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
                borderRadius: 10,
              }}
            >
              <div className="mb-2">
                <h2
                  className="text-xl font-bold"
                  style={{ color: "var(--fg)" }}
                >
                  Notification Preferences
                </h2>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--fg-tertiary)" }}
                >
                  Choose how you would like to hear from us about your appointments.
                </p>
              </div>

              <div
                className="mt-6 p-1"
                style={{
                  borderRadius: 8,
                  border: "1px solid var(--border-light)",
                  background: "var(--bg)",
                }}
              >
                <ToggleRow
                  title="Email notifications"
                  description="Appointment confirmations, receipts, and account updates."
                  checked={notifications.email}
                  onChange={(v) => setNotifications((s) => ({ ...s, email: v }))}
                />
                <ToggleRow
                  title="SMS notifications"
                  description="Text alerts for upcoming appointments and urgent messages."
                  checked={notifications.sms}
                  onChange={(v) => setNotifications((s) => ({ ...s, sms: v }))}
                />
                <ToggleRow
                  title="Appointment reminders"
                  description="Get reminded 24 hours before your scheduled visit."
                  checked={notifications.reminders}
                  onChange={(v) => setNotifications((s) => ({ ...s, reminders: v }))}
                />
                <ToggleRow
                  title="Offers & promotions"
                  description="Occasional updates about clinic offers and health tips."
                  checked={notifications.promotions}
                  onChange={(v) => setNotifications((s) => ({ ...s, promotions: v }))}
                />
              </div>

              <p
                className="mt-5 text-xs flex items-center gap-1.5"
                style={{ color: "var(--fg-tertiary)" }}
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Changes are saved automatically. You can update these anytime.
              </p>
            </div>
          )}

          {/* Privacy & Security */}
          {activeTab === "security" && (
            <div
              className="p-6 shadow-sm md:p-8 animate-fade-in"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
                borderRadius: 10,
              }}
            >
              <div className="mb-2">
                <h2
                  className="text-xl font-bold"
                  style={{ color: "var(--fg)" }}
                >
                  Privacy & Security
                </h2>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--fg-tertiary)" }}
                >
                  Manage how your account and data are protected.
                </p>
              </div>

              <div
                className="mt-6 p-1"
                style={{
                  borderRadius: 8,
                  border: "1px solid var(--border-light)",
                  background: "var(--bg)",
                }}
              >
                <ToggleRow
                  title="Two-factor authentication"
                  description="Add an extra layer of security at login with a verification code."
                  checked={privacy.twoFactor}
                  onChange={(v) => setPrivacy((s) => ({ ...s, twoFactor: v }))}
                />
                <ToggleRow
                  title="Share data with doctors only"
                  description="Restrict visibility of your medical history to authorized doctors."
                  checked={privacy.dataSharing}
                  onChange={(v) => setPrivacy((s) => ({ ...s, dataSharing: v }))}
                />
              </div>

              <div
                className="mt-6 p-5"
                style={{
                  borderRadius: 8,
                  border: "1px solid var(--border-light)",
                  background: "var(--bg)",
                }}
              >
                <h3
                  className="text-sm font-bold mb-1"
                  style={{ color: "var(--fg)" }}
                >
                  Data Protection
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--fg-tertiary)" }}
                >
                  Your personal health data is encrypted and stored securely. We comply with healthcare data protection regulations and never share your information with third parties without your explicit consent.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold"
                    style={{ borderRadius: 9999, background: "var(--brand-light)", color: "var(--brand)" }}
                  >
                    <span
                      className="h-1.5 w-1.5"
                      style={{ borderRadius: "50%", background: "var(--brand)" }}
                    />
                    Encrypted
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold"
                    style={{ borderRadius: 9999, background: "var(--brand-light)", color: "var(--brand)" }}
                  >
                    <span
                      className="h-1.5 w-1.5"
                      style={{ borderRadius: "50%", background: "var(--brand)" }}
                    />
                    HIPAA Compliant
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Change Password */}
          {activeTab === "password" && (
            <div className="animate-fade-in">
              <PasswordForm />
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
}
