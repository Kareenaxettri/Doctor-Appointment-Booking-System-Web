import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

describe("ConfirmDeleteModal", () => {
  it("shows the given user's name in the confirmation message", () => {
    render(
      <ConfirmDeleteModal userName="Jane Doe" submitting={false} onCancel={jest.fn()} onConfirm={jest.fn()} />
    );
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("calls onCancel when Cancel is clicked", () => {
    const onCancel = jest.fn();
    render(
      <ConfirmDeleteModal userName="Jane Doe" submitting={false} onCancel={onCancel} onConfirm={jest.fn()} />
    );
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when Delete user is clicked", () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmDeleteModal userName="Jane Doe" submitting={false} onCancel={jest.fn()} onConfirm={onConfirm} />
    );
    fireEvent.click(screen.getByRole("button", { name: /delete user/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("disables the delete button and shows a loading label while submitting", () => {
    render(
      <ConfirmDeleteModal userName="Jane Doe" submitting={true} onCancel={jest.fn()} onConfirm={jest.fn()} />
    );
    const button = screen.getByRole("button", { name: /deleting/i });
    expect(button).toBeDisabled();
  });
});
