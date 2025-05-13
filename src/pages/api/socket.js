import { Server as SocketIOServer } from 'socket.io';

// Map to store connected users
const connectedUsers = new Map();

const SocketHandler = (req, res) => {
  // Check if Socket.IO server is already running
  if (res.socket.server.io) {
    console.log('Socket.IO already running');
    res.end();
    return;
  }

  // Define allowed origins
  const getAllowedOrigins = () => {
    if (process.env.NODE_ENV === "production") {
      const domains = [];
      
      if (process.env.VERCEL_URL) {
        domains.push(`https://${process.env.VERCEL_URL}`);
      }
      
      if (process.env.NEXT_PUBLIC_SITE_URL) {
        domains.push(process.env.NEXT_PUBLIC_SITE_URL);
      }
      
      domains.push("https://your-domain.com"); // Replace with your actual domain
      
      return domains;
    }
    
    return ["http://localhost:3000"];
  };

  // Initialize Socket.IO server
  const io = new SocketIOServer(res.socket.server, {
    path: '/api/socket',
    cors: {
      origin: getAllowedOrigins(),
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ["websocket", "polling"]
  });

  // Store Socket.IO server instance on the response socket server
  res.socket.server.io = io;

  // Socket.IO event handlers
  io.on('connection', (socket) => {
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

    // Add any other socket event handlers from your original server.js
  });

  console.log('Socket.IO initialized on Vercel');
  res.end();
};

export default SocketHandler; 