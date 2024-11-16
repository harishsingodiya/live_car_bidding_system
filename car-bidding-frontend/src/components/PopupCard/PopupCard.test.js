import { render, screen, fireEvent } from '@testing-library/react';
import PopupCard from './index';

describe('PopupCard', () => {
  let handleClosePopUp;

  beforeEach(() => {
    // Mock the handleClosePopUp function
    handleClosePopUp = jest.fn();
  });

  test('renders popup when isOpen is true', () => {
    render(
      <PopupCard isOpen={true} handleClosePopUp={handleClosePopUp}>
        <p>Popup Content</p>
      </PopupCard>
    );

    // Check if popup content is rendered
    expect(screen.getByText('Popup Content')).toBeInTheDocument();
  });

  test('does not render popup when isOpen is false', () => {
    render(
      <PopupCard isOpen={false} handleClosePopUp={handleClosePopUp}>
        <p>Popup Content</p>
      </PopupCard>
    );

    // Check if popup content is NOT rendered
    expect(screen.queryByText('Popup Content')).toBeNull();
  });

  test('calls handleClosePopUp when close button is clicked', () => {
    render(
      <PopupCard isOpen={true} handleClosePopUp={handleClosePopUp}>
        <p>Popup Content</p>
      </PopupCard>
    );

    // Find the close button (SVG)
    const closeButton = screen.getByTestId('close-btn');

    // Simulate a click event
    fireEvent.click(closeButton);

    // Check if the handleClosePopUp function was called
    expect(handleClosePopUp).toHaveBeenCalled();
  });
});
