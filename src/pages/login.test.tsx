import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Login from "./login";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { MemoryRouter } from "react-router-dom";

// Mock the RTK Query hook so tests don't require the api reducer/middleware
const mockLogin = vi.fn((data: { email: string; password: string }) => ({
  unwrap: async () => ({
    user: { id: "1", email: data.email },
    token: "mock-token",
  }),
}));

vi.mock("../app/services/authApi", () => ({
  useLoginMutation: () => [mockLogin],
}));

describe("Login component", () => {
  it("renders the login form", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );
    const emailLabel = screen.getByLabelText(/email/i);
    const emailInput = screen.getByLabelText(/email/i);

    const passwordLabel = screen.getByLabelText(/password/i);
    const passwordInput = screen.getByLabelText(/password/i);

    const loginButton = screen.getByRole("button", { name: /submit/i });

    expect(emailLabel).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it("displays validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /submit/i });

    await user.type(emailInput, "user");
    await user.type(passwordInput, "short123");
    await user.click(loginButton);

    expect(screen.getByText("Email is invalid")).toBeInTheDocument();
  });

  it("displays validation error for short password", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /submit/i });

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "sh");
    await user.click(loginButton);
    expect(
      screen.getByText("Password must be at least 6 characters"),
    ).toBeInTheDocument();
  });

  it("shows validation error for empty fields", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /submit/i });

    await user.clear(emailInput);
    await user.clear(passwordInput);
    await user.click(loginButton);

    expect(screen.getByText("Email is invalid")).toBeInTheDocument();
    expect(
      screen.getByText("Password must be at least 6 characters"),
    ).toBeInTheDocument();
  });

  it("submits the form with valid data", async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /submit/i });

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "password123");
    await user.click(loginButton);

    expect(mockLogin).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
  });


});
