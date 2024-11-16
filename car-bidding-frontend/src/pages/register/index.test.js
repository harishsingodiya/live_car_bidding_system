import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./index";
import { useRouter } from "next/router";
import { registerUser } from "../../utils/api";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../utils/api", () => ({
  registerUser: jest.fn(),
}));

jest.mock("next/image", () => (props) => <img {...props} />);

describe("Register Component", () => {
  let mockPush;

  beforeEach(() => {
    mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Register component", () => {
    render(<Register />);

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
    expect(screen.getByText(/Login Here/i)).toBeInTheDocument();
  });

  it("updates username and password fields on user input", () => {
    render(<Register />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("password123");
  });

  it("calls `registerUser` and redirects to /login on successful registration", async () => {
    registerUser.mockResolvedValue({ data: { token: "abc123" } });

    render(<Register />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const registerButton = screen.getByRole("button", { name: /Register/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith("testuser", "password123");
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("displays an error message if registration fails", async () => {
    registerUser.mockRejectedValue({ response: { data: { message: "User already exists" } } });

    render(<Register />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const registerButton = screen.getByRole("button", { name: /Register/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/User already exists/i)).toBeInTheDocument();
    });
  });

  it("displays a default error message if no specific error message is provided", async () => {
    registerUser.mockRejectedValue({ response: {} });

    render(<Register />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const registerButton = screen.getByRole("button", { name: /Register/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });
});
