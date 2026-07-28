import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterForm from "@/app/(auth)/_components/RegisterForm";

const mockPush = jest.fn();
const mockHandleRegisterUser = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/lib/actions/auth-action", () => ({
  handleRegisterUser: (...args: unknown[]) => mockHandleRegisterUser(...args),
}));

function fillValidForm() {
  fireEvent.change(screen.getByPlaceholderText(/your full name/i), {
    target: { value: "Jane Doe" },
  });
  fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
    target: { value: "jane@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/98xxxxxxxx/i), {
    target: { value: "9800000000" },
  });
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "female" } });
  fireEvent.change(screen.getByPlaceholderText(/create a password/i), {
    target: { value: "Password1" },
  });
  fireEvent.change(screen.getByPlaceholderText(/repeat your password/i), {
    target: { value: "Password1" },
  });
}

describe("RegisterForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockHandleRegisterUser.mockReset();
  });

  it("renders all the expected registration fields", () => {
    render(<RegisterForm />);
    expect(screen.getByPlaceholderText(/your full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/98xxxxxxxx/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/create a password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/repeat your password/i)).toBeInTheDocument();
  });

  it("blocks submission and shows an error when terms are not agreed to", async () => {
    render(<RegisterForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/agree to the terms/i)).toBeInTheDocument();
    expect(mockHandleRegisterUser).not.toHaveBeenCalled();
  });

  it("registers successfully and redirects to login when terms are agreed to", async () => {
    mockHandleRegisterUser.mockResolvedValue({ success: true });

    render(<RegisterForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => expect(mockHandleRegisterUser).toHaveBeenCalled());
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/login"));
  });

  it("shows the server error message on failed registration", async () => {
    mockHandleRegisterUser.mockResolvedValue({ success: false, message: "Email already exists" });

    render(<RegisterForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText("Email already exists")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
