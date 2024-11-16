import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./index";
import { createAuction, getAuctions } from "../utils/api";
import moment from "moment";

jest.mock("next/image", () => (props) => <img {...props} />);
jest.mock("../utils/api", () => ({
  createAuction: jest.fn(),
  getAuctions: jest.fn(),
}));
jest.mock('../context/AuthContext', ()=>({
  useAuth: jest.fn(()=>({
    checkAndRefreshToken: jest.fn()
  }))
}))

jest.mock('next/router', () => ({
  useRouter: () => ({
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn()
  }),
}));
jest.mock(
  "../components/PopupCard",
  () =>
    ({ children, isOpen }) =>
      isOpen ? <div data-testid="popup">{children}</div> : null
);
jest.mock("../components/AuctionForm", () => ({ handleFormData }) => (
  <form
    data-testid="auction-form"
    onSubmit={(e) => {
      e.preventDefault();
      handleFormData({ car_brand: "Test", car_model: "Car" });
    }}
  >
    <button type="submit">Submit Auction</button>
  </form>
));

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the header and Create Auction button", () => {
    render(<Home />);

    expect(screen.getByText("Cars for auction")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Auction/i })
    ).toBeInTheDocument();
  });

  it("fetches and displays auctions", async () => {
    const mockAuctions = [
      {
        id: 1,
        car_brand: "Toyota",
        car_model: "Corolla",
        sold: 0,
        start_time: moment().subtract(1, "hour").toISOString(),
        end_time: moment().add(1, "hour").toISOString(),
      },
    ];
    getAuctions.mockResolvedValue({ data: mockAuctions });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Toyota-Corolla/i)).toBeInTheDocument();
    });
  });

  it("displays 'no data' image when there are no auctions", async () => {
    getAuctions.mockResolvedValue({ data: [] });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByAltText(/no data/i)).toBeInTheDocument();
    });
  });

  it("opens and closes the popup card on Create Auction button click", async () => {
    render(<Home />);

    const createButton = screen.getByRole("button", {
      name: /Create Auction/i,
    });
    fireEvent.click(createButton);

    expect(screen.getByTestId("popup")).toBeInTheDocument();

    const popupCloseButton = screen.getByTestId("popup");
    fireEvent.click(popupCloseButton);
  });

  it("submits a new auction and refreshes the list", async () => {
    createAuction.mockResolvedValue({});
    getAuctions.mockResolvedValue({ data: [] });

    render(<Home />);

    const createButton = screen.getByRole("button", {
      name: /Create Auction/i,
    });
    fireEvent.click(createButton);

    const formSubmitButton = screen.getByText(/Submit Auction/i);
    fireEvent.click(formSubmitButton);

    await waitFor(() => {
      expect(createAuction).toHaveBeenCalledWith({
        car_brand: "Test",
        car_model: "Car",
      });
      expect(getAuctions).toHaveBeenCalled();
    });
  });

  it("renders auction statuses (Sold, Expired, Start Auction)", async () => {
    const mockAuctions = [
      {
        id: 1,
        car_brand: "BMW",
        car_model: "X5",
        sold: 1,
        start_time: moment().subtract(2, "hours").toISOString(),
        end_time: moment().subtract(1, "hour").toISOString(),
        highest_bid: 20000,
      },
      {
        id: 2,
        car_brand: "Audi",
        car_model: "Q5",
        sold: 0,
        start_time: moment().add(1, "hour").toISOString(),
        end_time: moment().add(3, "hours").toISOString(),
      },
    ];
    getAuctions.mockResolvedValue({ data: mockAuctions });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Sold \$20000/i)).toBeInTheDocument();
      expect(screen.getByText(/Start at/i)).toBeInTheDocument();
    });
  });

  it("closes the popup when handleClosePopUp is called", async () => {
    // Mock API response
    getAuctions.mockResolvedValueOnce({ data: [] });

    // Render the Home component
    render(<Home />);

    // Open the popup
    const openPopupButton = screen.getByTestId("create-auction");
    fireEvent.click(openPopupButton);

    waitFor(()=>{

        // Check that the popup is displayed
    expect(screen.getByText(/Auction Form/i)).toBeInTheDocument();

    // Close the popup
    const closePopupButton = screen.getByTestId('close-btn');
    fireEvent.click(closePopupButton);

    // Verify the popup is closed
    expect(screen.queryByText(/Auction Form/i)).not.toBeInTheDocument();
    })

    
  });
});
