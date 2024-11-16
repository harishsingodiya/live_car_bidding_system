import React from "react";

const PopupCard = ({ children, isOpen, handleClosePopUp }) => {
  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
          <div className="flex justify-end">
            <CloseButtonIcon
              size={30}
              color="black"
              onClick={() => handleClosePopUp()}
            />
          </div>
          {children}
        </div>
      </div>
    )
  );
};

export default PopupCard;

const CloseButtonIcon = ({ size = 24, color = "black", onClick }) => (
  <svg
  data-testid={"close-btn"}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Close button"
    onClick={onClick}
  >
    <line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" />
    <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" />
  </svg>
);
