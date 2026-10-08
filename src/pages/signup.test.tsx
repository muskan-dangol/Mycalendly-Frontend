import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Signup from "./signup";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { MemoryRouter } from "react-router-dom";

// Mock the RTK Query hook so tests don't require the api reducer/middleware
const mockRegister = vi.fn(
  (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => ({
    unwrap: async () => ({
      user: {
        id: "1",
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      },
      token: "mock-token",
    }),
  }),
);

vi.mock("../app/services/authApi", () => ({
  useRegisterMutation: () => [mockRegister, { isLoading: false, isError: false, error: undefined }],
}));

describe("Signup Component", () => {
  it("renders the sign up form", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>,
    );

    const emailLabel = screen.getByLabelText(/email/i);
    const emailInput = screen.getByLabelText(/email/i);

    const passwordLabel = screen.getByPlaceholderText(".........");
    const passwordInput = screen.getByPlaceholderText(".........");

    const firstNameLabel = screen.getByLabelText(/first name/i);
    const firstNameInput = screen.getByLabelText(/first name/i);

    const lastNameLabel = screen.getByLabelText(/last name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);

    const confirmPasswordLabel = screen.getByLabelText(/confirm password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    expect(emailLabel).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(firstNameLabel).toBeInTheDocument();
    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameLabel).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(confirmPasswordLabel).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
  });

  it("display validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>,
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByPlaceholderText(".........");
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const signupButton = screen.getByRole("button", { name: /sign up/i });

    await user.type(emailInput, "invalid");
    await user.type(passwordInput, "password123");
    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");
    await user.type(confirmPasswordInput, "password123");
    await user.click(signupButton);

    const error = await screen.findByText("Invalid email address");
    expect(error).toBeInTheDocument();
  });

  it("display validation error for short password", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>,
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByPlaceholderText(".........");
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const signupButton = screen.getByRole("button", { name: /sign up/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "123");
    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");
    await user.type(confirmPasswordInput, "123");
    await user.click(signupButton);

    const error = await screen.findByText(
      "Password must be at least 6 characters",
    );
    expect(error).toBeInTheDocument();
  });

  it("display validation error for mismatched passwords", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>,
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByPlaceholderText(".........");
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const signupButton = screen.getByRole("button", { name: /sign up/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");
    await user.type(confirmPasswordInput, "differentPassword");
    await user.click(signupButton);

    const error = await screen.findByText("Passwords don't match");
    expect(error).toBeInTheDocument();
  });

  it("display validation error for empty fields", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>,
    );
    const signupButton = screen.getByRole("button", { name: /sign up/i });

    await user.click(signupButton);

    const emailError = await screen.findByText("Invalid email address");
    const passwordError = await screen.findByText("Password must be at least 6 characters");
    const firstNameError = await screen.findByText("FirstName must be at least 2 characters");
    const lastNameError = await screen.findByText("LastName must be at least 2 characters");
    const confirmPasswordError = await screen.findByText(
      "Confirm Password must be equal to Password",
    );

    expect(emailError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
    expect(firstNameError).toBeInTheDocument();
    expect(lastNameError).toBeInTheDocument();
    expect(confirmPasswordError).toBeInTheDocument();
  });
});
