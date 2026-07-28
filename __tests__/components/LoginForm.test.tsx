import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/app/(auth)/_components/LoginForm";

const mockPush = jest.fn();
const mockCheckAuth = jest.fn();
const mockHandleLoginUser = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/lib/actions/auth-action", () => ({
  handleLoginUser: (...args: unknown[]) => mockHandleLoginUser(...args),
}));

jest.mock("@/lib/contexts/AuthContext", () => ({
  useAuth: () => ({ checkAuth: mockCheckAuth }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockCheckAuth.mockClear();
    mockHandleLoginUser.mockReset();
  });

  it("renders email and password fields with a submit button", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows a validation error for an invalid email and does not submit", async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockHandleLoginUser).not.toHaveBeenCalled();
    });
  });

  it("logs in successfully and redirects to the dashboard", async () => {
    mockHandleLoginUser.mockResolvedValue({ success: true });

    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(mockCheckAuth).toHaveBeenCalled());
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/dashboard"));
  });

  it("shows the server error message on failed login", async () => {
    mockHandleLoginUser.mockResolvedValue({ success: false, message: "Invalid credentials" });

    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
