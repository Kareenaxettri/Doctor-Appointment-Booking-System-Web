
"use client";

import { useEffect, useState } from "react";
import { handleListAppointments } from "@/lib/actions/appointment-action";
import { Appointment } from "@/lib/api/appointments";

const statusStyles: Record<string, string> = {
  upcoming: "bg-blue-50 text-blue-600",
  pending: "bg-blue-50 text-blue-600",
  completed: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
  confirmed: "bg-emerald-50 text-emerald-600",
};

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      const result = await handleListAppointments({ page: 1, limit: 10 });
      setLoading(false);
      if (!result.success) {
        setError(result.message || "Failed to load appointments");
        return;
      }
      setAppointments(result.data || []);
    };

    loadAppointments();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-[#1d2b36]">Appointment History</h2>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-8 text-slate-500">
          <span className="mb-3 h-6 w-6 animate-spin rounded-full border-4 border-[#2f6f7e]/20 border-t-[#2f6f7e]" />
          <p className="text-sm font-medium">Loading appointments...</p>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && appointments.length === 0 && (
        <p className="text-sm text-gray-500">No appointments found.</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm mt-4">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
              <th className="py-3 font-medium">Doctor</th>
              <th className="py-3 font-medium">Date & Time</th>
              <th className="py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id} className="border-t border-gray-100">
                <td className="py-4">
                  <p className="font-semibold text-[#1d2b36]">{appt.doctorName || appt.doctor || "Doctor"}</p>
                  <p className="text-xs text-gray-400">{appt.specialty || "Specialty"}</p>
                </td>
                <td className="py-4 text-gray-500">
                  <p>{appt.appointmentDate || "TBD"}</p>
                  <p className="text-xs text-gray-400">{appt.startTime || appt.appointmentTime || "TBD"}{appt.endTime ? ` - ${appt.endTime}` : ""}</p>
                </td>
                <td className="py-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[(appt.status || "pending").toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
                    {appt.status || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
