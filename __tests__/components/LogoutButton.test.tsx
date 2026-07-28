import { render, screen, fireEvent } from "@testing-library/react";
import LogoutButton from "@/components/LogoutButton";

const mockLogout = jest.fn();

jest.mock("@/lib/contexts/AuthContext", () => ({
  useAuth: () => ({ logout: mockLogout }),
}));

describe("LogoutButton", () => {
  beforeEach(() => {
    mockLogout.mockClear();
  });

  it("renders a 'Sign out' button", () => {
    render(<LogoutButton />);
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });

  it("calls logout from AuthContext when clicked", () => {
    render(<LogoutButton />);
    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
