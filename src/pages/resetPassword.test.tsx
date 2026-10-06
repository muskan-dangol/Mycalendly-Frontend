import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { ResetPassword } from "./resetPassword";

const mockResetPassword = vi.fn();
const mockUnwrap = vi.fn(async () => ({ message: "changed" }));
vi.mock("../app/services/passwordApi", async () => {
  const React = await import("react");

  return {
    useResetPasswordMutation: () => {
      const [isLoading, setIsLoading] = React.useState(false);

      const resetPassword = (data: {
        token: string;
        newPassword: string;
        confirmPassword: string;
      }) => {
        mockResetPassword(data);
        setIsLoading(true);

        return {
          unwrap: async () => {
            try {
              return await mockUnwrap();
            } finally {
              setIsLoading(false);
            }
          },
        };
      };

      return [resetPassword, { isLoading }] as const;
    },
  };
});

beforeEach(() => {
  mockResetPassword.mockClear();
  mockUnwrap.mockClear();
  mockUnwrap.mockImplementation(async () => ({ message: "changed" }));
});

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/reset-password?token=test-token"]}>
        {ui}
      </MemoryRouter>
    </Provider>,
  );

// Tests for the ResetPassword component
describe("ResetPassword component", () => {
  it("should display the reset password form", async () => {
    renderWithProviders(<ResetPassword />);

    expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  it("should show a mismatch error for different passwords", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ResetPassword />);

    expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();

    const newPasswordInput = screen.getByPlaceholderText("New password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm password");

    await user.type(newPasswordInput, "password123");
    await user.type(confirmPasswordInput, "different123");

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    await user.click(submitButton);

    expect(
      await screen.findByText("Passwords don't match"),
    ).toBeInTheDocument();
  });

  it("should successfully reset the password when inputs are valid", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ResetPassword />);

    const newPasswordInput = screen.getByPlaceholderText("New password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm password");

    await user.type(newPasswordInput, "password123");
    await user.type(confirmPasswordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    await user.click(submitButton);

    expect(mockResetPassword).toHaveBeenCalledWith({
      token: "test-token",
      newPassword: "password123",
      confirmPassword: "password123",
    });
    expect(mockUnwrap).toHaveBeenCalled();
  });

  it("should show an error when the reset password field is empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ResetPassword />);

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    await user.click(submitButton);

    expect(mockResetPassword).not.toHaveBeenCalled();
    expect(mockUnwrap).not.toHaveBeenCalled();
    expect(
      await screen.findAllByText("Password must be at least 6 characters long"),
    ).toHaveLength(2);
  });
});
