import React from "react";
import { useAuth } from "../../context/AuthContext";

const NavBar = () => {
  const { token, user } = useAuth();
  return (
    <header>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl lg:px-6 sm:px-6 flex flex-row justify-between sm:py-4 lg:py-4">
          <div className="">
            <a href="/" className="">
              <span className="text-white text-2xl ">Car Auction</span>
            </a>
          </div>

          <div className="flex">
            <div>
              <span className="text-white mr-4 text-2xl capitalize">
                {user?.username}
              </span>
            </div>
            <div>
              <a href="/logout" className="flex text-white text-2xl">
                Log out
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 5.25v13.5A2.25 2.25 0 006.75 21h6.75a2.25 2.25 0 002.25-2.25V15m-3.75 3l3.75-3m0 0l-3.75-3m3.75 3H9"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
