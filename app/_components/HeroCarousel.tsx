"use client";

export default function HeroCarousel() {
  return (
    <div className="relative animate-fade-in">
      <div className="absolute -inset-6 rounded-[2rem] -rotate-2" style={{ background: "var(--brand-subtle)" }} aria-hidden="true" />
      <div
        className="relative rounded-3xl overflow-hidden shadow-xl"
        style={{ border: "1px solid var(--border-light)", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}
      >
        <div className="relative" style={{ height: 340 }}>
          {/* Doctor image */}
          <img
            src="/doctor-hero.jpg"
            alt="Doctor"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,122,109,0.95) 0%, rgba(26,122,109,0.6) 40%, transparent 70%)" }} />

          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10" style={{ background: "white" }} />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full opacity-10" style={{ background: "white" }} />

          {/* Floating badge */}
          <div
            className="absolute top-5 right-5 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: "var(--bg-surface)",
              color: "var(--success)",
              boxShadow: "var(--shadow-md)",
              border: "1px solid var(--border-light)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Appointment Confirmed
          </div>

          {/* Doctor name tag */}
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-white font-semibold text-lg">Dr. Rita Shrestha</p>
            <p className="text-white/80 text-sm">Cardiologist · Bir Hospital</p>
          </div>
        </div>
      </div>
    </div>
  );
}
