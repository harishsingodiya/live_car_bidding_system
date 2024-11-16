import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuctionForm from "./index";

describe("AuctionForm Component", () => {
  let handleFormDataMock;

  beforeEach(() => {
    handleFormDataMock = jest.fn();
  });

  test("renders the form with all inputs and labels", () => {
    render(<AuctionForm handFormData={handleFormDataMock} />);

    // Check for form title
    expect(screen.getByText("Create Auction")).toBeInTheDocument();

    // Check for all input fields and labels
    expect(screen.getByLabelText(/Car Brand/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Car Model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Auction Start Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Auction End Time/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
  });

  test("shows validation errors when required fields are empty", async () => {
    render(<AuctionForm handFormData={handleFormDataMock} />);

    // Submit the form without filling any fields
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    // Check for validation error messages
    expect(
      await screen.findByText("Car brand is required")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Car model is required")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Start time is required")
    ).toBeInTheDocument();
    expect(await screen.findByText("End time is required")).toBeInTheDocument();
  });

  test("submits form data successfully when all fields are valid", async () => {
    render(<AuctionForm handleFormData={handleFormDataMock} />);

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/Car Brand/i), {
      target: { value: "Hyundai" },
    });
    fireEvent.change(screen.getByLabelText(/Car Model/i), {
      target: { value: "Elantra" },
    });
    fireEvent.change(screen.getByLabelText(/Auction Start Time/i), {
      target: { value: "2024-11-17T10:00" },
    });
    fireEvent.change(screen.getByLabelText(/Auction End Time/i), {
      target: { value: "2024-11-18T10:00" },
    });

    const submitBtn = screen.getByTestId("create-btn");
    // Submit the form
    fireEvent.click(submitBtn);

    waitFor(() => {
      // Ensure handFormData is called with the correct data
      expect(handleFormDataMock).toHaveBeenCalled();
      expect(handleFormDataMock).toHaveBeenCalledWith({
        carBrand: "Hyundai",
        carModel: "Elantra",
        startTime: "2024-11-17T10:00",
        endTime: "2024-11-18T10:00",
      });
    });
  });
});
