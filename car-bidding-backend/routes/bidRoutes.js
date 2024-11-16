const express = require("express");
const bidController = require("../controllers/bidController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route to list all bids for an auction
router.get("/:auctionId", authMiddleware, bidController.getBidsByAuction);

// Route to place a bid
router.post("/:auctionId", authMiddleware, bidController.placeBid);

module.exports = router;
