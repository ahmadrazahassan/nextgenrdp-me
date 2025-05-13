import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

export const useSocket = (userId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    const initSocket = async () => {
      // Fetch to initialize the Socket.IO instance on the server
      await fetch('/api/socket');
      
      // Get the correct socket URL based on environment
      const socketUrl = process.env.NODE_ENV === 'production' 
        ? window.location.origin
        : 'http://localhost:3000';
      
      // Connect to socket server with the correct path
      socket = io(socketUrl, {
        path: '/api/socket',
        transports: ['websocket', 'polling'],
      });

      // Socket events
      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        setIsConnected(true);
        
        // Register user if userId is provided
        if (userId) {
          socket.emit('user-connected', userId);
        }
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      socket.on('admin-notification', (notification) => {
        console.log('New notification received:', notification);
        setNotifications((prev) => [notification, ...prev]);
      });

      // Cleanup on unmount
      return () => {
        socket.disconnect();
      };
    };

    // Only initialize if not already done
    if (!socket) {
      initSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userId]);

  // Function to send a message through the socket
  const sendMessage = (event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
      return true;
    }
    return false;
  };

  return {
    socket,
    isConnected,
    notifications,
    sendMessage,
  };
};

export default useSocket; 