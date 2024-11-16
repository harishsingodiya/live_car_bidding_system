const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const bodyParser = require("body-parser");
const Bid = require("./models/bid");


const auctionRoutes = require("./routes/auctionRoutes");
const bidRoutes = require("./routes/bidRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());

app.use(express.urlencoded({ extended: true }));
// This is required to handle urlencoded data
app.use(express.json());

app.use(bodyParser.json());

const auctionRooms = new Map();

let activeConnections = 0;

// WebSocket event handlers
wss.on("connection", (ws) => {
  // Increment active connection count
  activeConnections++;
  console.log(
    `New connection established. Active connections: ${activeConnections}`
  );

  // Notify all clients about the updated count
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({ type: "connectionCount", count: activeConnections })
      );
    }
  });

  ws.on("message", async (message) => {
    const data = JSON.parse(message);
    switch (data.type) {
      case "joinAuction":
        handleJoinAuction(ws, data.auctionId);
        break;
      case "placeBid":
        handlePlaceBid(ws, data.auctId, data.userId, data.bidAmount);
        break;
      default:
        console.log("Unknown message type:", data.type);
    }
  });

  // Handle client disconnection
  ws.on("close", () => {
    activeConnections--;
    console.log(`Connection closed. Active connections: ${activeConnections}`);

    // Notify all clients about the updated count
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ type: "connectionCount", count: activeConnections })
        );
      }
    });
  });
});

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

function broadcastToAuctionRoom(auctionId, message) {
  const clients = auctionRooms.get(auctionId) || [];
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Routes
app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api", userRoutes);

// Start server
server.listen(3001, () => {
  console.log("Server listening on port 3001");
});