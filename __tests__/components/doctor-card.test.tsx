import { render, screen, fireEvent } from "@testing-library/react";
import DoctorCard from "@/app/(auth)/_components/doctor-card";

const doctor = {
  id: "doc-1",
  fullName: "Dr. Sushma Paudel",
  specialty: "Dermatologist",
  hospital: "CIWEC Hospital",
  photo: "https://images.unsplash.com/photo-example.jpg",
  rating: 4.9,
  experienceYears: 11,
  consultationFee: 1300,
  availability: "Available today",
};

describe("DoctorCard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the doctor's name, hospital, and specialty", () => {
    render(<DoctorCard doctor={doctor} />);
    expect(screen.getByText("Dr. Sushma Paudel")).toBeInTheDocument();
    expect(screen.getByText("CIWEC Hospital")).toBeInTheDocument();
    expect(screen.getByText("Dermatologist")).toBeInTheDocument();
  });

  it("renders the rating, experience, and fee", () => {
    render(<DoctorCard doctor={doctor} />);
    expect(screen.getByText("4.9")).toBeInTheDocument();
    expect(screen.getByText("11+ yrs")).toBeInTheDocument();
    expect(screen.getByText("Rs. 1300")).toBeInTheDocument();
  });

  it("links the Book Appointment button to the correct booking URL", () => {
    render(<DoctorCard doctor={doctor} />);
    const link = screen.getByRole("link", { name: /book appointment/i });
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("/appointments/booking?doctorId=doc-1")
    );
  });

  it("is not marked as favorite by default", () => {
    render(<DoctorCard doctor={doctor} />);
    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
  });

  it("toggles favorite state and persists it to localStorage when the heart button is clicked", () => {
    render(<DoctorCard doctor={doctor} />);
    const favoriteButton = screen.getByLabelText("Add to favorites");

    fireEvent.click(favoriteButton);

    expect(screen.getByLabelText("Remove from favorites")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("fav_doctors") || "[]")).toContain("doc-1");
  });

  it("falls back to sensible defaults when optional fields are missing", () => {
    render(<DoctorCard doctor={{ id: "doc-2", name: "Dr. No Data" }} />);
    expect(screen.getByText("Dr. No Data")).toBeInTheDocument();
    expect(screen.getByText("Specialist")).toBeInTheDocument();
    expect(screen.getByText("Available today")).toBeInTheDocument();
  });
});
