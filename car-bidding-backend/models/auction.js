const db = require("../config/db");

const Auction = {
  create: async (carId, carBrand, carModel, startTime, endTime, sold) => {
    const [result] = await db.execute(
      "INSERT INTO auctions (car_id, car_brand, car_model, start_time, end_time, sold) VALUES (?, ?, ?, ?, ?, ?)",
      [carId, carBrand, carModel, startTime, endTime, sold]
    );
    return result.insertId;
  },

  getAllAuctions: async () => {
    const [rows] = await db.execute(`SELECT 
    a.id AS id,
    a.car_brand,
    a.car_model,
    a.start_time,
    a.end_time,
    a.sold,
    a.car_id,
    COALESCE(MAX(b.bid_amount), 0) AS highest_bid
FROM 
    car_bidding.auctions a
LEFT JOIN 
    car_bidding.bids b ON a.id = b.auction_id
GROUP BY 
    a.id, a.car_brand, a.car_model, a.start_time, a.end_time
ORDER BY 
    a.id DESC`);
    return rows;
  },

  getById: async (auctionId) => {
    const [rows] = await db.execute("SELECT * FROM auctions WHERE id = ?", [
      auctionId,
    ]);
    return rows[0];
  },

  getCurrentAuctions: async () => {
    const [rows] = await db.execute(
      "SELECT * FROM auctions WHERE end_time > NOW() ORDER BY start_time ASC"
    );
    return rows;
  },

  endAuction: async (auctionId) => {
    await db.execute(
      "UPDATE auctions SET end_time = NOW(), sold = 1 WHERE id = ?",
      [auctionId]
    );
  },
};

module.exports = Auction;
