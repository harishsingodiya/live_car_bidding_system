import React from "react";
import { render, screen } from "@testing-library/react";
import Logout from "./index";
import { useAuth } from "../../context/AuthContext";

// Mock the `useAuth` context
jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("Logout Component", () => {
  test("calls logout on render and displays logging out message", () => {
    // Mock the logout function
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({
      logout: mockLogout,
    });

    render(<Logout />);

    // Assert that the logout function is called
    expect(mockLogout).toHaveBeenCalled();

    // Assert that the "Logging out" message is displayed
    expect(screen.getByText("Logging out")).toBeInTheDocument();
  });
});
