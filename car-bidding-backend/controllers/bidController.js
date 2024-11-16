const Bid = require("../models/bid");
const {broadcastToAuctionRoom} = require("../services/websocketService")

exports.getBidsByAuction = async (req, res) => {
  const { auctionId } = req.params;
  try {
    const bids = await Bid.getBidsByAuction(auctionId);
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bids" });
  }
};

exports.placeBid = async (req, res) => {
  const { auctionId } = req.params;
  const { userId, bidAmount } = req.body;
  try {
    const currentHighestBid = await Bid.getHighestBid(auctionId);

    if (currentHighestBid && bidAmount <= currentHighestBid.bid_amount) {
      return res.status(400).json({ error: "Bid must be higher than the current highest bid." });
    }

    await Bid.placeBid(auctionId, userId, bidAmount);

    const updatedHighestBid = await Bid.getHighestBid(auctionId);
    broadcastToAuctionRoom(
      auctionId,
      JSON.stringify({ type: "updateBid", highestBid: updatedHighestBid.bid_amount })
    );

    res.status(201).json({ message: "Bid placed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to place bid" });
  }
};
