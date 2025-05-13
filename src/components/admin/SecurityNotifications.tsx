"use client";

import { useState, useEffect } from "react";
import { 
  Bell, Shield, AlertTriangle, X, Eye, Clock, CheckCircle2
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface SecurityNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  threatId?: string;
  read: boolean;
}

export default function SecurityNotifications() {
  const [notifications, setNotifications] = useState<SecurityNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch initial notifications
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for new notifications
    const intervalId = setInterval(() => {
      checkForNewNotifications();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // Update unread count when notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const fetchNotifications = async () => {
    try {
      // In a real app, this would fetch from an API endpoint
      // For demo purposes, we'll use mock data
      setNotifications([
        {
          id: "n-1001",
          title: "Critical Vulnerability Detected",
          message: "A critical vulnerability has been detected in your system. Please take immediate action.",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          severity: "critical",
          threatId: "T-1021",
          read: false
        },
        {
          id: "n-1002",
          title: "Unusual Login Activity",
          message: "Multiple login attempts detected from an unusual location.",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          severity: "high",
          threatId: "T-1023",
          read: false
        },
        {
          id: "n-1003",
          title: "Security Scan Completed",
          message: "Weekly security scan completed. 3 vulnerabilities found.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          severity: "medium",
          read: true
        }
      ]);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const checkForNewNotifications = () => {
    // In a real app, this would check for new notifications via API
    // For demo, we'll occasionally add a new notification
    if (Math.random() > 0.7) {
      const newNotification: SecurityNotification = {
        id: `n-${1004 + Math.floor(Math.random() * 1000)}`,
        title: "New Security Event",
        message: "A new security event has been detected in your system.",
        timestamp: new Date().toISOString(),
        severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      toast({
        title: "New Security Alert",
        description: newNotification.title,
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (id: string) => {
    try {
      // In a real app, this would call an API to update the notification status
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // In a real app, this would call an API to update all notifications
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const viewThreat = async (threatId?: string) => {
    if (!threatId) return;
    
    // In a real app, this would navigate to the threat details page
    // For demo, we'll just close the notifications panel
    setShowNotifications(false);
    
    // Could be integrated with the threat management tab
    toast({
      title: "Viewing Threat Details",
      description: `Navigating to threat ID: ${threatId}`,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Shield className="h-4 w-4" />;
      case 'low': return <Shield className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="icon" 
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      
      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border z-50"
          >
            <div className="p-3 border-b flex justify-between items-center">
              <h3 className="font-medium">Security Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
                    onClick={markAllAsRead}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto p-2 space-y-2">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-md border ${!notification.read ? 'bg-blue-50' : 'bg-white'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(notification.severity)}>
                          <span className="flex items-center gap-1">
                            {getSeverityIcon(notification.severity)}
                            {notification.severity.charAt(0).toUpperCase() + notification.severity.slice(1)}
                          </span>
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      {!notification.read && (
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    
                    {notification.threatId && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs h-8"
                        onClick={() => viewThreat(notification.threatId)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        View Threat Details
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No notifications
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 