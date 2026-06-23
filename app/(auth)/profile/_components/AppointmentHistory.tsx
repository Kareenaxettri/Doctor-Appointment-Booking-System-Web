
const mockAppointments = [
  {
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: "May 24, 2024",
    time: "10:30 AM - 11:15 AM",
    status: "Upcoming" as const,
  },
  {
    doctor: "Dr. Michael Chen",
    specialty: "Dermatologist",
    date: "April 12, 2024",
    time: "02:00 PM - 02:30 PM",
    status: "Completed" as const,
  },
  {
    doctor: "Dr. Lisa Park",
    specialty: "Ophthalmologist",
    date: "March 05, 2024",
    time: "09:15 AM - 10:00 AM",
    status: "Cancelled" as const,
  },
  {
    doctor: "Dr. James Wilson",
    specialty: "Neurologist",
    date: "February 18, 2024",
    time: "04:30 PM - 05:15 PM",
    status: "Completed" as const,
  },
];

const statusStyles: Record<string, string> = {
  Upcoming: "bg-blue-50 text-blue-600",
  Completed: "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-600",
};

export default function AppointmentHistory() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-[#1d2b36]">
          Appointment History
        </h2>
        <span className="text-xs text-gray-400">
          Sample data — connect an appointments API to make this live
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm mt-4">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
              <th className="py-3 font-medium">Doctor</th>
              <th className="py-3 font-medium">Date & Time</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockAppointments.map((appt) => (
              <tr key={appt.doctor + appt.date} className="border-t border-gray-100">
                <td className="py-4">
                  <p className="font-semibold text-[#1d2b36]">{appt.doctor}</p>
                  <p className="text-xs text-gray-400">{appt.specialty}</p>
                </td>
                <td className="py-4 text-gray-500">
                  <p>{appt.date}</p>
                  <p className="text-xs text-gray-400">{appt.time}</p>
                </td>
                <td className="py-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[appt.status]}`}
                  >
                    {appt.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button
                    type="button"
                    className="text-xs font-semibold text-[#2f6f7e] hover:underline"
                  >
                    {appt.status === "Cancelled" ? "Rebook" : "View Details"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
