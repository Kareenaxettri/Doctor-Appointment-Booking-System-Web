import Link from "next/link";
import { redirect } from "next/navigation";
import { getTokenCookie, getUserData } from "@/lib/cookies";
import HeroCarousel from "./_components/HeroCarousel";
import RevealSection from "./_components/RevealSection";

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    title: "Find the right doctor",
    body: "Search by specialty, location, or availability. Compare profiles, fees, and real-time slots before you commit.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M16 10h4" />
        <path d="M3 10h8" />
      </svg>
    ),
    title: "Pay with your wallet",
    body: "Confirm bookings instantly with eSewa, Khalti, or Fonepay — no card details to hunt for.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="M9 16l2 2 4-4" />
      </svg>
    ),
    title: "Everything in one place",
    body: "Your appointments, payments, and reminders land on a single dashboard you can check anytime.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Search",
    body: "Filter by specialty, see real availability, and find a doctor that fits your schedule.",
  },
  {
    n: "02",
    title: "Choose",
    body: "Pick a date and time slot that works for you — no phone calls, no waiting.",
  },
  {
    n: "03",
    title: "Book",
    body: "Pay with the wallet you already use and get instant confirmation on your dashboard.",
  },
];

export default async function Home() {
  const token = await getTokenCookie();
  const user = await getUserData();

  if (token) {
    if (user?.role === "admin") {
      redirect("/admin/users");
    }
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b" style={{ borderColor: "var(--border-light)", background: "color-mix(in srgb, var(--bg-surface) 85%, transparent)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-base font-bold"
              style={{ background: "var(--brand)", color: "var(--fg-inverse)" }}
            >
              +
            </div>
            <span className="text-lg font-bold" style={{ color: "var(--fg)" }}>MediClick</span>
          </div>

          <nav className="hidden sm:flex items-center gap-8 text-sm font-medium" style={{ color: "var(--fg-secondary)" }}>
            <a href="#specialties" className="nav-link-underline hover:text-[var(--fg)] transition-colors">Find Doctors</a>
            <a href="#features" className="nav-link-underline hover:text-[var(--fg)] transition-colors">Services</a>
            <a href="#how-it-works" className="nav-link-underline hover:text-[var(--fg)] transition-colors">How it Works</a>
            <a href="#footer" className="nav-link-underline hover:text-[var(--fg)] transition-colors">About Us</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold px-4 py-2 rounded-full transition"
              style={{ color: "var(--brand)" }}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="btn-primary btn-hover-scale rounded-full px-5 py-2.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-slide-up">
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide rounded-full px-3 py-1.5"
            style={{ color: "var(--brand)", background: "var(--brand-subtle)" }}
          >
            Doctor booking for Kathmandu
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]" style={{ color: "var(--fg)" }}>
            Book a doctor without standing in line.
          </h1>
          <p className="mt-5 text-lg max-w-md" style={{ color: "var(--fg-secondary)" }}>
            MediClick connects you with trusted specialists across the city.
            Compare real availability, pay with the wallet you already carry,
            and keep every appointment in one dashboard.
          </p>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap items-center gap-8">
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--fg)" }}>2,500+</p>
              <p className="text-xs font-medium" style={{ color: "var(--fg-tertiary)" }}>Active patients</p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--fg)" }}>120+</p>
              <p className="text-xs font-medium" style={{ color: "var(--fg-tertiary)" }}>Verified doctors</p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--fg)" }}>4.8</p>
              <p className="text-xs font-medium" style={{ color: "var(--fg-tertiary)" }}>Average rating</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="btn-primary btn-hover-scale rounded-full px-6 py-3.5"
            >
              Find a doctor
            </Link>
            <Link
              href="/register"
              className="btn-outlined px-6 py-3.5"
            >
              Browse Doctors
            </Link>
          </div>
        </div>

        {/* Hero carousel with booking card overlay */}
        <HeroCarousel />
      </section>

      {/* ── Trusted-by strip ── */}
      <RevealSection>
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <p className="text-xs font-semibold uppercase tracking-wide mb-5" style={{ color: "var(--fg-tertiary)" }}>
            Trusted by patients at
          </p>
          <div className="flex flex-wrap items-center gap-8 opacity-50">
            {["Bir Hospital", "Nepal Mediciti", "Teaching Hospital", "Patan Hospital", "Grande International"].map((name) => (
              <span key={name} className="text-sm font-semibold" style={{ color: "var(--fg-secondary)" }}>{name}</span>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── Why choose MediClick ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 border-t" style={{ borderColor: "var(--border-light)" }}>
        <RevealSection>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--fg)" }}>Why choose MediClick?</h2>
          <p className="mb-10 max-w-xl" style={{ color: "var(--fg-secondary)" }}>
            From finding the right specialist to confirming your slot, every step is designed to be fast and clear.
          </p>
        </RevealSection>

        <div className="grid sm:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <RevealSection key={f.title} delay={i * 80}>
              <div className="feature-card card p-6 h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--brand-subtle)" }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-base mb-2" style={{ color: "var(--fg)" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--fg-secondary)" }}>{f.body}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-16 border-t" style={{ borderColor: "var(--border-light)" }}>
        <RevealSection>
          <h2 className="text-2xl font-bold mb-10" style={{ color: "var(--fg)" }}>Simple 3-step process</h2>
        </RevealSection>

        {/* Steps row with connectors */}
        <RevealSection delay={60}>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            {STEPS.map((step, i) => (
              <div key={step.n} className={`relative ${i < STEPS.length - 1 ? "step-connector" : ""}`}>
                <div className="step-card card p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: "var(--brand)", color: "var(--fg-inverse)" }}
                    >
                      {step.n}
                    </span>
                    <h3 className="font-semibold text-base" style={{ color: "var(--fg)" }}>{step.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--fg-secondary)" }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Select Time booking preview */}
        <RevealSection delay={120}>
          <div className="mt-10 flex justify-center">
            <div className="card p-5 w-full max-w-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--fg-tertiary)" }}>Select a time slot</span>
                <span className="text-xs font-medium" style={{ color: "var(--brand)" }}>Tomorrow</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {["9:00", "10:00", "11:30", "1:00", "2:30", "3:00", "4:00", "4:30"].map((t, i) => (
                  <button
                    key={t}
                    className={`text-xs font-medium py-2 rounded-lg transition-all duration-150 ${i === 2 ? "" : ""}`}
                    style={{
                      background: i === 2 ? "var(--brand)" : "var(--bg-input)",
                      color: i === 2 ? "var(--fg-inverse)" : "var(--fg-secondary)",
                      border: `1px solid ${i === 2 ? "var(--brand)" : "var(--border)"}`,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                className="w-full mt-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
                style={{ background: "var(--brand)", color: "var(--fg-inverse)" }}
              >
                Confirm booking
              </button>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ── Footer ── */}
      <footer id="footer" className="mt-auto border-t" style={{ borderColor: "var(--border-light)" }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{ background: "var(--brand)", color: "var(--fg-inverse)" }}
                >
                  +
                </div>
                <span className="text-base font-bold" style={{ color: "var(--fg)" }}>MediClick</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--fg-tertiary)" }}>
                Trusted healthcare booking for Kathmandu. Compare doctors, pay with your wallet, and manage every appointment in one place.
              </p>
            </div>

            {/* Patients column */}
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--fg)" }}>Patients</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--fg-secondary)" }}>
                <li><a href="#specialties" className="hover:text-[var(--fg)] transition-colors">Find doctors</a></li>
                <li><a href="#how-it-works" className="hover:text-[var(--fg)] transition-colors">How it works</a></li>
                <li><Link href="/login" className="hover:text-[var(--fg)] transition-colors">My appointments</Link></li>
                <li><Link href="/register" className="hover:text-[var(--fg)] transition-colors">Create account</Link></li>
              </ul>
            </div>

            {/* Doctors column */}
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--fg)" }}>Doctors</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--fg-secondary)" }}>
                <li><a href="#features" className="hover:text-[var(--fg)] transition-colors">Join MediClick</a></li>
                <li><a href="#features" className="hover:text-[var(--fg)] transition-colors">For clinics</a></li>
                <li><a href="#features" className="hover:text-[var(--fg)] transition-colors">Resources</a></li>
              </ul>
            </div>

            {/* Contact column */}
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--fg)" }}>Contact</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--fg-secondary)" }}>
                <li>Kathmandu, Nepal</li>
                <li>support@mediclick.com</li>
                <li>+977-1-4444555</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t" style={{ borderColor: "var(--border-light)" }}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: "var(--fg-tertiary)" }}>
            <span>&copy; {new Date().getFullYear()} MediClick. Built for Kathmandu.</span>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-[var(--fg)] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[var(--fg)] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[var(--fg)] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
