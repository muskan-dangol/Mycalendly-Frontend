import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { EmailVerification } from "./emailVerification";

const mockVerifyEmail = vi.fn(() => ({
  unwrap: async () => ({ message: "verified" }),
}));

vi.mock("../app/services/emailVerify", () => ({
  useVerifyEmailMutation: () => [mockVerifyEmail],
}));

describe("EmailVerification", () => {
  it("renders the email verified success message", async () => {
    render(
      <MemoryRouter initialEntries={["/verify-email?token=test-token"]}>
        <EmailVerification />
      </MemoryRouter>,
    );

    const messageElement = await screen.findByText(
      /Email Verified Successfully/i,
    );
    expect(messageElement).toBeInTheDocument();
  });

  it("renders the go to login button when token is missing", () => {
    render(
      <MemoryRouter initialEntries={["/verify-email"]}>
        <EmailVerification />
      </MemoryRouter>,
    );

    const messageElement = screen.getByRole("button", {
      name: /Go to login/i,
    });
    expect(messageElement).toBeInTheDocument();
  });

  it("renders the error message when token is invalid", async () => {
    mockVerifyEmail.mockImplementationOnce(() => ({
      unwrap: async () => {
        throw new Error("Invalid token");
      },
    }));

    render(
      <MemoryRouter initialEntries={["/verify-email?token=invalid-token"]}>
        <EmailVerification />
      </MemoryRouter>,
    );

    const messageElement = await screen.findByText(
      /Failed to verify email. Please try again./i,
    );
    expect(mockVerifyEmail).toHaveBeenCalledWith({ token: "invalid-token" });
    expect(messageElement).toBeInTheDocument();
  });

  it("renders the verifying email message when token is present", () => {
    render(
      <MemoryRouter initialEntries={["/verify-email?token=test-token"]}>
        <EmailVerification />
      </MemoryRouter>,
    );

    const messageElement = screen.getByText(/Verifying Email/i);
    expect(messageElement).toBeInTheDocument();
  });
});
