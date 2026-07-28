import { render, screen, fireEvent } from "@testing-library/react";
import BookingSuccessModal from "@/components/BookingSuccessModal";

const details = {
  bookingId: "BK-1001",
  doctorName: "Dr. Sushma Paudel",
  specialty: "Dermatologist",
  hospital: "CIWEC Hospital",
  date: "2026-08-01",
  time: "10:30 AM",
  fee: 1300,
  paymentMethod: "card",
};

describe("BookingSuccessModal", () => {
  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <BookingSuccessModal isOpen={false} onClose={jest.fn()} details={details} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when details is null, even if isOpen is true", () => {
    const { container } = render(
      <BookingSuccessModal isOpen={true} onClose={jest.fn()} details={null} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the booking details when open", () => {
    render(<BookingSuccessModal isOpen={true} onClose={jest.fn()} details={details} />);
    expect(screen.getByText("Dr. Sushma Paudel")).toBeInTheDocument();
    expect(screen.getByText("BK-1001")).toBeInTheDocument();
    expect(screen.getByText(/2026-08-01 at 10:30 AM/)).toBeInTheDocument();
    expect(screen.getByText(/Rs\. 1300/)).toBeInTheDocument();
  });

  it("calls onClose when 'View Appointments' is clicked", () => {
    const onClose = jest.fn();
    render(<BookingSuccessModal isOpen={true} onClose={onClose} details={details} />);
    fireEvent.click(screen.getByRole("link", { name: /view appointments/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
