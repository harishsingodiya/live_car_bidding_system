import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { endAuction, getAuctionById } from "../../utils/api";
import useWebSocket from "../../hooks/useWebSocket";
import { useAuth } from "@/context/AuthContext";
import ConfettiComponent from "../../components/Confetti";
import PopupCard from "@/components/PopupCard";

const AuctionPage = () => {
  const router = useRouter();
  const { id: auctionId } = router.query;
  const { user, checkAndRefreshToken } = useAuth();
  const [auction, setAuction] = useState({});
  const [userId, setUserId] = useState(user?.userId || null);
  const [bidAmount, setBidAmount] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isConfettiShow, setIsConfettiShow] = useState(false);
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const { highestBid, placeBid, messages, connectionCount } =
    useWebSocket(auctionId);

  const handlePlaceBid = () => {
    placeBid(auctionId, userId, parseInt(bidAmount));
    setBidAmount("");
  };

  const handleEndAuction = async () => {
    const isValid = await checkAndRefreshToken();

    if (!isValid) {
      throw new Error("Authentication failed");
    }
    try {
      await endAuction(auctionId);
      setTimeRemaining("Auction ended");
      fetchAuction(auctionId);
    } catch (error) {
      console.error("Error ending auction:", error);
    }
  };

  const fetchAuction = async (id) => {
    const isValid = await checkAndRefreshToken();

    if (!isValid) {
      throw new Error("Authentication failed");
    }
    try {
      const { data } = await getAuctionById(id);
      setAuction(data);
    } catch (error) {
      console.log("error while fetching action", error);
      setAuction({});
    }
  };

  const handleClosePopUp = () => {
    setIsConfettiShow(false);
    setIsConfettiShow(false);
    router.push("/");
  };

  useEffect(() => {
    if (auctionId) {
      localStorage.setItem("auctionId", auctionId)
      fetchAuction(auctionId);      
    }
  }, [auctionId]);

  useEffect(() => {
    setUserId(user?.userId);
  }, [user?.userId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (auction.end_time) {
        const now = new Date();
        const endTime = new Date(auction.end_time);
        const timeLeft = endTime - now;

        if (timeLeft > 0) {
          let seconds = Math.floor((timeLeft / 1000) % 60);
          let minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
          let hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);

          hours = hours < 10 ? "0" + hours : hours;
          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;
          setTimeRemaining(`${hours} : ${minutes}: ${seconds}`);
        } else {
          setTimeRemaining("Auction ended");
          clearInterval(interval);
          !auction.sold && handleEndAuction();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  useEffect(() => {
    if (messages?.length > 0) {
      setIsConfettiShow(true);
      setIsOpenPopUp(true);
    }
  }, [messages]);

  return (
    <>
      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="max-w-7xl px-4 py-6 sm:px-6 lg:px-2">
            <div className="flex justify-between">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                Auction Room: {auction?.car_brand}-{auction?.car_model}
              </h3>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                Ends In: {timeRemaining}
              </h3>
              <div className="self-start">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleEndAuction}
                  disabled={auction?.sold}
                >
                  End Auction
                </button>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between">
              <h2 className="text-2xl">Current Highest Bid: ${highestBid}</h2>
              <h2 className="text-2xl">People for Bid: {connectionCount}</h2>
            </div>

            <div>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  placeholder="Your bid"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  disabled={auction?.sold}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    disabled={auction?.sold}
                    className="h-full rounded-md border-0 bg-gray-500 py-0 pl-2 pr-7 text-gray-100 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    onClick={handlePlaceBid}
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            </div>

            {messages?.length > 0 && (
              <div>
                <h3>Messages</h3>
                <ul>
                  {messages.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
      {isConfettiShow && <ConfettiComponent />}
      <PopupCard isOpen={isOpenPopUp} handleClosePopUp={handleClosePopUp}>
        <div>
          <div
            className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <svg
                  className="fill-current h-6 w-6 text-teal-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">
                  The{" "}
                  <span className="text-2xl">{`${auction.car_brand}- ${auction.car_model}`}</span>{" "}
                  has been sold!!
                </p>
                <p className="text-sm">
                  The highest bid price is{" "}
                  <span className="text-2xl">${highestBid}</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </PopupCard>
    </>
  );
};

AuctionPage.auth = true;

export default AuctionPage;
