import React from "react";
import { render, screen } from "@testing-library/react";
import NavBar from "./index";
import { useAuth } from "../../context/AuthContext";

// Mock the `useAuth` context
jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    token: "mockToken123",
    login: jest.fn(),
    user: { userId: "123", username: "harry" },
  })),
}));

describe("NavBar Component", () => {
  test("renders NavBar without crashing", () => {
    render(<NavBar />);

    // Check for the site title
    expect(screen.getByText("Car Auction")).toBeInTheDocument();
  });

  test("displays the user's name when authenticated", () => {
    // Mock the useAuth return value with a user
    useAuth.mockReturnValue({
      token: "mockToken123",
      user: { username: "John" },
    });

    render(<NavBar />);

    // Check that the username is displayed
    expect(screen.getByText("John")).toBeInTheDocument();

    // Check for the "Log out" button
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  test("renders 'Log out' link correctly", () => {
    useAuth.mockReturnValue({
      token: "mockToken123",
      user: { username: "JaneDoe" },
    });

    render(<NavBar />);

    // Check that the logout link is present and contains the correct URL
    const logoutLink = screen.getByRole("link", { name: /Log out/i });
    expect(logoutLink).toHaveAttribute("href", "/logout");
  });

  test("does not display username or logout when not authenticated", () => {
    // Mock the useAuth return value with no user
    useAuth.mockReturnValue({
      token: null,
      user: null,
    });

    render(<NavBar />);

    // Ensure username is not displayed
    expect(screen.queryByText(/username/i)).not.toBeInTheDocument();

    // Ensure logout is not displayed
    expect(screen.queryByText(/Log out/i)).toBeInTheDocument();
  });
});
