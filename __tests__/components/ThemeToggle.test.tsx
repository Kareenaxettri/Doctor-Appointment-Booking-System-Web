import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "@/components/ThemeToggle";

const mockToggle = jest.fn();
let mockTheme: "light" | "dark" = "light";

jest.mock("@/components/ThemeProvider", () => ({
  useTheme: () => ({ theme: mockTheme, toggle: mockToggle }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    mockToggle.mockClear();
    mockTheme = "light";
  });

  it("shows a label offering to switch to dark mode when theme is light", () => {
    render(<ThemeToggle />);
    expect(screen.getByLabelText("Switch to dark mode")).toBeInTheDocument();
  });

  it("shows a label offering to switch to light mode when theme is dark", () => {
    mockTheme = "dark";
    render(<ThemeToggle />);
    expect(screen.getByLabelText("Switch to light mode")).toBeInTheDocument();
  });

  it("calls toggle when clicked", () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
