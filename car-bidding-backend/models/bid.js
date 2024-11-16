const db = require('../config/db');

const Bid = {
  placeBid: async (auctionId, userId, bidAmount) => {
    const [result] = await db.execute(
      'INSERT INTO bids (auction_id, user_id, bid_amount, timestamp) VALUES (?, ?, ?, NOW())',
      [auctionId, userId, bidAmount]
    );
    return result.insertId;
  },

  getHighestBid: async (auctionId) => {
    const [rows] = await db.execute(
      'SELECT * FROM bids WHERE auction_id = ? ORDER BY bid_amount DESC LIMIT 1',
      [auctionId]
    );
    return rows[0];
  },

  getBidsByAuction: async (auctionId) => {
    const [rows] = await db.execute(
      'SELECT * FROM bids WHERE auction_id = ? ORDER BY timestamp ASC',
      [auctionId]
    );
    return rows;
  }
};

module.exports = Bid;
