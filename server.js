const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

// Define allowed origins based on environment
const getAllowedOrigins = () => {
  // In production, use the actual domain
  if (process.env.NODE_ENV === "production") {
    const domains = [];
    
    // Add the main Vercel deployment URL
    if (process.env.VERCEL_URL) {
      domains.push(`https://${process.env.VERCEL_URL}`);
    }
    
    // Add custom domain if available
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      domains.push(process.env.NEXT_PUBLIC_SITE_URL);
    }
    
    // Add a fallback domain if needed
    domains.push("https://your-domain.com"); // Replace with your actual domain
    
    return domains;
  }
  
  // In development, allow localhost
  return ["http://localhost:3000"];
};

const io = new Server(server, {
  cors: {
    origin: getAllowedOrigins(),
    methods: ["GET", "POST"],
    credentials: true
  },
  // Add more Socket.IO options for production
  transports: ["websocket", "polling"],
  // Add a path if needed for custom routing in Vercel
  path: process.env.SOCKET_IO_PATH || "/socket.io"
});

// Store connected users
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Store user connection
  socket.on("user-connected", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });
  
  // Handle disconnection
  socket.on("disconnect", () => {
    // Remove user from connected users
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Admin route to send notifications
app.post("/api/send-notification", express.json(), (req, res) => {
  const { userId, message } = req.body;
  
  try {
    // Send to specific user if userId is provided
    if (userId && connectedUsers.has(userId)) {
      const socketId = connectedUsers.get(userId);
      io.to(socketId).emit("admin-notification", {
        id: Date.now().toString(),
        message,
        timestamp: new Date(),
        read: false
      });
      res.status(200).json({ success: true, message: "Notification sent to user" });
    } 
    // Broadcast to all connected users
    else if (!userId) {
      io.emit("admin-notification", {
        id: Date.now().toString(),
        message,
        timestamp: new Date(),
        read: false
      });
      res.status(200).json({ success: true, message: "Notification broadcast to all users" });
    } 
    else {
      res.status(404).json({ success: false, message: "User not connected" });
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ success: false, message: "Failed to send notification" });
  }
});

// Dynamic port for Vercel
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});