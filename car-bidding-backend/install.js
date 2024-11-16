/*
Run this file once before running the server.
This creates the required database and tables.
*/

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const mysql = require("mysql2/promise");

async function initializeDatabase() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  try {
    // Create the database
    console.log("Creating database...");
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\`;`);
    console.log("Database created.");

    // Use the new database
    console.log("Switching to the database...");
    await pool.query(`USE \`${process.env.DB_DATABASE}\`;`);

    // Create the `users` table
    console.log("Creating users table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
    `);

    // Insert initial users
    console.log("Inserting users...");
    await pool.query(`
      INSERT INTO users VALUES (11,'harish','$2b$10$LS8YK6fgoF0Y8SQ6cTLwGOJ2A8d9PL8hFhtpC3FWIEST4UDsNfp3y'),(12,'harry','$2b$10$zLuqn/cLw9jH2Svhuf.HP.pfEzowbpLdA4jYva6G8IJnU3IKw6tba'),(13,'jhon','$2b$10$pQVX.F8hK.eJL5NqSp.gv.JqlwHVeW.skrQ1WJbJG0pNxmNyKaNpi')
    `);

    // Create the `auctions` table
    console.log("Creating auctions table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS auctions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        car_id VARCHAR(255) NOT NULL,
        car_brand VARCHAR(255) NOT NULL,
        car_model VARCHAR(255) NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        sold TINYINT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Insert initial auctions
    console.log("Inserting auctions...");
    await pool.query(`
      INSERT INTO auctions (id, car_id, car_brand, car_model, start_time, end_time, sold) VALUES
      (6, '40de26b7-23a8-4813-8acb-a950fe19a1b0', 'Hyundai', 'I-10', '2024-11-15 12:52:00', '2024-11-15 15:49:18', 1),
      (7, '6d4954c3-5f87-49d9-9e7d-177ee2b55c3d', 'Toyota', 'Hyryder', '2024-11-15 16:05:00', '2024-11-15 17:38:50', 1),
      (9, 'e9c37519-0476-4ea0-b413-50a96ee86547', 'Hyundai', 'I-20', '2024-11-15 18:00:00', '2024-11-15 19:26:26', 1)
      ON DUPLICATE KEY UPDATE car_brand = VALUES(car_brand);
    `);

    // Create the `bids` table
    console.log("Creating bids table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bids (
        id INT PRIMARY KEY AUTO_INCREMENT,
        auction_id INT,
        user_id INT,
        bid_amount DECIMAL(10, 2) NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
    `);

    // Insert initial bids
    console.log("Inserting bids...");
    await pool.query(`
      INSERT INTO bids (id, auction_id, user_id, bid_amount, timestamp) VALUES
      (1, 6, 11, 5000.00, '2024-11-15 13:38:51'),
      (2, 6, 11, 5500.00, '2024-11-15 14:55:44'),
      (3, 6, 12, 6000.00, '2024-11-15 14:58:47'),
      (4, 6, 11, 6100.00, '2024-11-15 14:58:53'),
      (5, 6, 11, 6500.00, '2024-11-15 15:10:26'),
      (6, 6, 12, 7000.00, '2024-11-15 15:10:35'),
      (7, 7, 11, 5000.00, '2024-11-15 16:08:08'),
      (8, 7, 12, 5500.00, '2024-11-15 16:08:13'),
      (9, 9, 12, 5000.00, '2024-11-15 19:04:06'),
      (10, 9, 13, 5500.00, '2024-11-15 19:10:05')
      ON DUPLICATE KEY UPDATE bid_amount = VALUES(bid_amount);
    `);

    console.log("Database setup complete!");
  } catch (error) {
    console.error("Failed to initialize the database:", error);
  } finally {
    await pool.end();
    process.exit();
  }
}

initializeDatabase();
