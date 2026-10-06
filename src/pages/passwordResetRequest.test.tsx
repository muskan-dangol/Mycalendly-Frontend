import { render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../app/store";
import { PasswordResetRequest } from "./passwordResetRequest";

const mockChangePassword = vi.fn();
const mockUnwrap = vi.fn(async () => ({ message: "changed" }));

vi.mock("../app/services/passwordApi", async () => {
  const React = await import("react");

  return {
    useRequestPasswordResetMutation: () => {
      const [isLoading, setIsLoading] = React.useState(false);

      const requestPasswordReset = (data: { email: string }) => {
        mockChangePassword(data);
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

      return [requestPasswordReset, { isLoading }] as const;
    },
  };
});

beforeEach(() => {
  mockChangePassword.mockClear();
  mockUnwrap.mockClear();
  mockUnwrap.mockImplementation(async () => ({ message: "changed" }));
});

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
  );

// test before submitting the PasswordResetRequest component
describe("ChangePassword Component", () => {
  it("should render the PasswordResetRequest component page", () => {
    renderWithProviders(<PasswordResetRequest />);

    expect(screen.getByText("Lets find your account")).toBeInTheDocument();
  });

  it("should have an input for an email", () => {
    renderWithProviders(<PasswordResetRequest />);

    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("email address")).toBeInTheDocument();
  });

  it("should have a button to continue changing the password", () => {
    renderWithProviders(<PasswordResetRequest />);

    expect(
      screen.getByRole("button", { name: /Continue/i }),
    ).toBeInTheDocument();
  });

  it("should give invalid email address on providing an incorrect email", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PasswordResetRequest />);

    const button = screen.getByRole("button", { name: /Continue/i });
    expect(button).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText("email address");
    await user.type(emailInput, "invalid");

    await user.click(button);

    const error = await screen.findByText("Invalid email address");
    expect(error).toBeInTheDocument();
  });

  it("should have processing state after clicking continue", async () => {
    let resolveRequest = null;
    mockUnwrap.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRequest = () => resolve({ message: "changed" });
        }),
    );

    const user = userEvent.setup();
    renderWithProviders(<PasswordResetRequest />);

    const button = screen.getByRole("button", { name: /Continue/i });
    expect(button).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText("email address");
    await user.type(emailInput, "test@example.com");

    await user.click(button);

    expect(
      await screen.findByRole("button", { name: /Processing/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });
    resolveRequest?.();
  });
});

// Tests for the state after the PasswordResetRequest component has been submitted
describe("After submitting the PasswordResetRequest component", () => {
  it("should display success message for a successful password reset request sent to email", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PasswordResetRequest />);

    await user.type(
      screen.getByPlaceholderText("email address"),
      "test@example.com",
    );
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });

    expect(
      await screen.findByText("Email has been sent successfully!"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Check your inbox/i)).toBeInTheDocument();

    expect(
      await screen.findByRole("button", { name: /Back to login/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /Try another email/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /Try again/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: /contact support/i }),
    ).toBeInTheDocument();
  });
});
