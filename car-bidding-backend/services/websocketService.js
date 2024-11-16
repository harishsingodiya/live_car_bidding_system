const WebSocket = require("ws");
const auctionRooms = new Map();
let activeConnections = 0;

exports.init = (wss) => {
  wss.on("connection", (ws) => {
    activeConnections++;
    notifyConnectionCount(wss);

    ws.on("message", (message) => {
      const data = JSON.parse(message);
      handleWebSocketEvents(ws, data);
    });

    ws.on("close", () => {
      activeConnections--;
      notifyConnectionCount(wss);
    });
  });
};

function notifyConnectionCount(wss) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "connectionCount", count: activeConnections }));
    }
  });
}

function handleWebSocketEvents(ws, data) {
  switch (data.type) {
    case "joinAuction":
      handleJoinAuction(ws, data.auctionId);
      break;
    case "placeBid":
      handlePlaceBid(ws, data.auctionId, data.userId, data.bidAmount);
      break;
    default:
      console.log("Unknown message type:", data.type);
  }
}

async function handleJoinAuction(ws, auctionId) {
  if (!auctionRooms.has(auctionId)) auctionRooms.set(auctionId, []);
  auctionRooms.get(auctionId).push(ws);

  const highestBid = await Bid.getHighestBid(auctionId);
  ws.send(JSON.stringify({ type: "updateBid", highestBid: highestBid?.bid_amount || 0 }));
}

async function handlePlaceBid(ws, auctionId, userId, bidAmount) {
  const currentHighestBid = await Bid.getHighestBid(auctionId);
  if (currentHighestBid && bidAmount <= currentHighestBid.bid_amount) {
    ws.send(JSON.stringify({ type: "error", message: "Bid must be higher than the current highest bid." }));
    return;
  }

  await Bid.placeBid(auctionId, userId, bidAmount);
  const updatedHighestBid = await Bid.getHighestBid(auctionId);
  broadcastToAuctionRoom(auctionId, JSON.stringify({ type: "updateBid", highestBid: updatedHighestBid.bid_amount }));
}

function broadcastToAuctionRoom(auctionId, message) {
  const clients = auctionRooms.get(auctionId) || [];
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(message);
  });
}
