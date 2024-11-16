const { v4: uuidv4 } = require("uuid");
const Auction = require("../models/auction");
const Bid = require("../models/bid");

exports.getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.getAllAuctions();
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch auctions" });
  }
};

exports.getAuctionById = async (req, res) => {
  const { id: auctionId } = req.params;
  try {
    const auction = await Auction.getById(auctionId);
    if (!auction) return res.status(404).json({ error: "Auction not found" });

    res.status(200).json(auction);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch auction" });
  }
};

exports.createAuction = async (req, res) => {
  const { carBrand, carModel, startTime, endTime } = req.body;
  let carId = uuidv4();
  try {
    const auctionId = await Auction.create(
      carId,
      carBrand,
      carModel,
      startTime,
      endTime,
      0
    );
    res.status(201).json({ auctionId });
  } catch (error) {
    res.status(500).json({ error: "Failed to create auction" });
  }
};

exports.endAuction = async (req, res) => {
  const { id: auctionId } = req.params;
  try {
    await Auction.endAuction(auctionId);
    const highestBid = await Bid.getHighestBid(auctionId);

    res.status(200).json({
      message: "Auction ended successfully",
      winningBid: highestBid?.bid_amount || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to end auction" });
  }
};
