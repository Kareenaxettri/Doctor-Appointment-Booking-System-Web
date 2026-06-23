"use client";

import { useState } from "react";
import AppShell from "@/app/(auth)/_components/AppShell";
import { mockDoctors, specialtyFilters } from "@/app/(auth)/_components/mock-doctors";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState(specialtyFilters[0]);

  const doctors =
    activeFilter === specialtyFilters[0]
      ? mockDoctors
      : mockDoctors.filter((doctor) =>
          doctor.specialty.toLowerCase().includes(activeFilter.toLowerCase())
        );

  return (
    <AppShell title="Dashboard Page">
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1d2b36]">
              Find Your Specialist
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {user?.fullName ? `Welcome back, ${user.fullName}. ` : ""}
              Over 2,400+ verified doctors available for you.
            </p>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-gray-600 border border-gray-200 rounded-full px-4 py-2"
          >
            More Filters
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {specialtyFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`text-sm font-medium px-4 py-2 rounded-full border transition ${
                activeFilter === filter
                  ? "bg-[#2f6f7e] text-white border-[#2f6f7e]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#2f6f7e]/50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-3xl border border-gray-100 p-4 hover:shadow-lg transition"
            >
              <div className="relative rounded-2xl overflow-hidden h-32 mb-4">
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                  ★ {doctor.rating.toFixed(1)}
                </span>
              </div>
              <h3 className="font-semibold text-[#1d2b36]">{doctor.name}</h3>
              <p className="text-sm text-[#2f6f7e]">{doctor.specialty}</p>
              <p className="text-xs text-gray-400 mt-1">📍 {doctor.clinic}</p>
              <button
                type="button"
                className="w-full mt-4 bg-[#2f6f7e] hover:bg-[#285c68] text-white text-sm font-semibold rounded-xl py-2.5 transition"
              >
                Book Appointment
              </button>
            </div>
          ))}

          <div className="rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-6 text-gray-400">
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl mb-2">
              +
            </div>
            <p className="text-sm font-semibold text-[#1d2b36]">
              View More Doctors
            </p>
            <p className="text-xs mt-1">Discover specialists near you</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
