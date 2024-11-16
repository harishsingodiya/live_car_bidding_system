import { useEffect, useRef, useState } from "react";

const useWebSocket = (aucId) => {
  const auctionId = aucId || localStorage.getItem('auctionId')
  const [connectionCount, setConnectionCount] = useState(0);
  const [highestBid, setHighestBid] = useState(0);
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}`);

    ws.current.onopen = () => {
      if (auctionId) {
        ws.current.send(JSON.stringify({ type: "joinAuction", auctionId }));
      } else {
        console.log("AuctionId is undefined");
      }
    };

    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "updateBid") setHighestBid(data.highestBid);
      if (data.type === "auctionEnd")
        setMessages((msgs) => [
          ...msgs,
          "Auction ended. Final bid: " + data.winningBid,
        ]);
      if (data.type === "connectionCount") {
        setConnectionCount(data.count);
      }
    };

    ws.current.onclose = () => console.log("WebSocket closed");

    return () => ws.current.close();
  }, [auctionId]);

  const placeBid = (auctId, userId, bidAmount) => {
    ws.current.send(
      JSON.stringify({ type: "placeBid", auctId, userId, bidAmount })
    );
  };

  return { highestBid, placeBid, messages, connectionCount };
};

export default useWebSocket;
