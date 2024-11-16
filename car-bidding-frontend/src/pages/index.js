import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { createAuction, getAuctions } from "../utils/api";
import CarImg from "../assets/car.jpg";
import PopupCard from "../components/PopupCard";
import AuctionForm from "../components/AuctionForm";
import moment from "moment";
import NoData from "../assets/no-data.jpg";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { checkAndRefreshToken } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAuctions = async () => {
    const isValid = await checkAndRefreshToken();

    if (!isValid) {
      throw new Error("Authentication failed");
    }

    try {
      const { data } = await getAuctions();
      setAuctions(data || []);
    } catch (error) {
      console.error("Failed to fetch auctions", error);
      setAuctions([]); // Fallback to empty list
    }
  };

  const handleCreateAuction = async (formData) => {
    try {
      await createAuction(formData);
      fetchAuctions();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create auctions", error);
    }
  };

  const handleStartAuction = (auctionId) => {
    localStorage.setItem("auctionId", auctionId);
    router.push(`/auction/${auctionId}`);
  };

  const handleClosePopUp = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const isStarted = (startTime) => {
    const currentTime = moment();
    const tempStartTime = moment(startTime);
    return currentTime.isAfter(tempStartTime);
  };

  const isExpired = (endTime) => {
    const currentTime = moment();
    const tempEndTime = moment(endTime);
    return currentTime.isAfter(tempEndTime);
  };

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900">
              Cars for auction
            </h3>
            <div>
              <button
                type="button"
                data-testid="create-auction"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsOpen(true)}
              >
                Create Auction
              </button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {auctions.map((auction) => (
                  <div
                    key={auction?.id}
                    className="max-w-sm rounded overflow-hidden shadow-lg"
                  >
                    {auction?.sold === 1 && (
                      <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        Sold ${auction.highest_bid}
                      </span>
                    )}

                    {isExpired(auction.end_time) && auction?.sold === 0 && (
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10">
                        Expired
                      </span>
                    )}
                    <Image
                      src={CarImg}
                      className="w-full"
                      alt={auction.car_id}
                    />
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">
                        {auction?.car_brand}-{auction?.car_model}
                      </div>
                      <p className="text-gray-700 text-base">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Voluptatibus quia, nulla! Maiores et perferendis
                        eaque, exercitationem praesentium nihil.
                      </p>
                    </div>
                    {!auction?.sold &&
                    isStarted(auction.start_time) &&
                    !isExpired(auction.end_time) ? (
                      <div className="px-6 pt-4 pb-2">
                        <a
                          key={auction.id}
                          href="#"
                          onClick={() => handleStartAuction(auction.id)}
                        >
                          <button className="flex w-full justify-center bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Start Auction
                          </button>
                        </a>
                      </div>
                    ) : (
                      !isStarted(auction?.start_time) && (
                        <div className="px-6 pt-4 pb-2">
                          <button className="flex w-full justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Start at &nbsp;
                            {moment(auction?.start_time).format(
                              "MMM Do YYYY, hh:mm:ss a"
                            )}
                          </button>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
              {!auctions.length && (
                <div>
                  <Image
                    src={NoData}
                    className="mx-auto"
                    width="600"
                    height="200"
                    alt="no data"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <PopupCard isOpen={isOpen} handleClosePopUp={handleClosePopUp}>
        <AuctionForm handleFormData={handleCreateAuction} />
      </PopupCard>
    </>
  );
}

Home.auth = true;
