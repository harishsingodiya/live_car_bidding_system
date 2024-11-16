import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import Login from "./index";

// Mock `next/router` and `useAuth`
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("Login Component", () => {
  let mockLogin, mockPush;

  beforeEach(() => {
    mockLogin = jest.fn();
    mockPush = jest.fn();

    useAuth.mockReturnValue({
      login: mockLogin,
    });

    useRouter.mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the login form", () => {
    render(<Login />);

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign in/i })).toBeInTheDocument();
  });

  test("allows input for username and password", () => {
    render(<Login />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("password123");
  });

  test("calls login function on form submission with correct credentials", async () => {
    render(<Login />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByRole("button", { name: /Sign in/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(signInButton);

    expect(mockLogin).toHaveBeenCalledWith("testuser", "password123");
  });

  test("displays error message on login failure", async () => {
    mockLogin.mockRejectedValue({
      response: { data: { message: "Invalid username or password" } },
    });

    render(<Login />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByRole("button", { name: /Sign in/i });

    fireEvent.change(usernameInput, { target: { value: "wronguser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(signInButton);

    expect(await screen.findByText(/Invalid username or password/i)).toBeInTheDocument();
  });

  test("displays default error message if response message is unavailable", async () => {
    mockLogin.mockRejectedValue({});

    render(<Login />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByTestId("login-btn");

    fireEvent.change(usernameInput, { target: { value: "user" } });
    fireEvent.change(passwordInput, { target: { value: "pass" } });
    fireEvent.click(signInButton);

    expect(await screen.findByText(/Login failed/i)).toBeInTheDocument();
  });
});
