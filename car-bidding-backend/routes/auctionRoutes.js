const express = require("express");
const auctionController = require("../controllers/auctionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route to list all auctions
router.get("/", authMiddleware, auctionController.getAllAuctions);

// Route to get an auction by ID
router.get("/:id", authMiddleware, auctionController.getAuctionById);

// Route to create an auction
router.post("/", authMiddleware, auctionController.createAuction);

// Route to end an auction
router.post("/:id/end", authMiddleware, auctionController.endAuction);

module.exports = router;
