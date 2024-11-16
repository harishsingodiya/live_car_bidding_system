const Bid = require("../models/bid");
const auctionRooms = new Map();

function broadcastToAuctionRoom(auctionId, message) {
  const clients = auctionRooms.get(auctionId) || [];
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

async function handleJoinAuction(ws, auctionId) {
  if (!auctionRooms.has(auctionId)) {
    auctionRooms.set(auctionId, []);
  }
  auctionRooms.get(auctionId).push(ws);
  const highestBid = await Bid.getHighestBid(auctionId);
  ws.send(
    JSON.stringify({
      type: "updateBid",
      highestBid: highestBid?.bid_amount || 0,
    })
  );
}

async function handlePlaceBid(ws, auctionId, userId, bidAmount) {
  const currentHighestBid = await Bid.getHighestBid(auctionId);
  if (currentHighestBid && bidAmount <= currentHighestBid.bid_amount) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Bid must be higher than current highest bid.",
      })
    );
    return;
  }

  await Bid.placeBid(auctionId, userId, bidAmount);
  const updatedHighestBid = await Bid.getHighestBid(auctionId);

  const bidUpdate = JSON.stringify({
    type: "updateBid",
    highestBid: updatedHighestBid.bid_amount,
  });
  broadcastToAuctionRoom(auctionId, bidUpdate);
}

module.exports = {
  auctionRooms,
  broadcastToAuctionRoom,
  handleJoinAuction,
  handlePlaceBid,
};
