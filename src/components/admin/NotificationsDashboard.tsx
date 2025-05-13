"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Bell, AlertTriangle, CheckCircle, Info, User, Clock, Settings, 
  Filter, Trash2, CheckCheck, AlertCircle, Shield, RefreshCw, 
  Loader2 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: string;
  priority: string;
  read: boolean;
  source?: string;
}

interface NotificationSummary {
  criticalCount: number;
  systemCount: number;
  userCount: number;
  systemStatus: string;
  unreadCount: number;
  lastUpdated: string;
}

export default function NotificationsDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [summary, setSummary] = useState<NotificationSummary>({
    criticalCount: 0,
    systemCount: 0,
    userCount: 0,
    systemStatus: "Unknown",
    unreadCount: 0,
    lastUpdated: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [notificationsRes, summaryRes] = await Promise.all([
        axios.get('/api/admin/notifications', { withCredentials: true }),
        axios.get('/api/admin/notifications/summary', { withCredentials: true })
      ]);
      
      setNotifications(notificationsRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again.");
      
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mark single notification as read
  const markAsRead = async (id: string) => {
    try {
      await axios.put(`/api/admin/notifications/${id}/read`, {}, { 
        withCredentials: true 
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Update summary count
      setSummary(prev => ({
        ...prev,
        unreadCount: Math.max(0, prev.unreadCount - 1)
      }));
    } catch (err) {
      console.error("Error marking notification as read:", err);
      toast({
        title: "Error",
        description: "Failed to update notification",
        variant: "destructive",
      });
    }
  };

  // Dismiss notification
  const dismissNotification = async (id: string) => {
    try {
      await axios.delete(`/api/admin/notifications/${id}`, { 
        withCredentials: true 
      });
      
      // Remove from local state
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      
      toast({
        title: "Success",
        description: "Notification dismissed",
      });
    } catch (err) {
      console.error("Error dismissing notification:", err);
      toast({
        title: "Error",
        description: "Failed to dismiss notification",
        variant: "destructive",
      });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setIsMarkingRead(true);
    
    try {
      await axios.put('/api/admin/notifications/read-all', {}, { 
        withCredentials: true 
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Update summary
      setSummary(prev => ({
        ...prev,
        unreadCount: 0
      }));
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      toast({
        title: "Error",
        description: "Failed to update notifications",
        variant: "destructive",
      });
    } finally {
      setIsMarkingRead(false);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await axios.delete('/api/admin/notifications', { 
        withCredentials: true 
      });
      
      // Update local state
      setNotifications([]);
      
      // Update summary
      setSummary(prev => ({
        ...prev,
        criticalCount: 0,
        systemCount: 0,
        userCount: 0,
        unreadCount: 0
      }));
      
      toast({
        title: "Success",
        description: "All notifications cleared",
      });
    } catch (err) {
      console.error("Error clearing notifications:", err);
      toast({
        title: "Error",
        description: "Failed to clear notifications",
        variant: "destructive",
      });
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for new notifications
    const intervalId = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(notif => notif.type === activeTab);

  // Get icon based on notification type
  const getIcon = (type: string, priority: string) => {
    switch (type) {
      case "security":
        return <div className={`h-9 w-9 rounded-full flex items-center justify-center ${priority === 'high' ? 'bg-red-100' : 'bg-orange-100'}`}>
          <Shield className={`h-5 w-5 ${priority === 'high' ? 'text-red-600' : 'text-orange-600'}`} />
        </div>;
      case "system":
        return <div className={`h-9 w-9 rounded-full flex items-center justify-center ${priority === 'high' ? 'bg-red-100' : priority === 'medium' ? 'bg-amber-100' : 'bg-blue-100'}`}>
          <Info className={`h-5 w-5 ${priority === 'high' ? 'text-red-600' : priority === 'medium' ? 'text-amber-600' : 'text-blue-600'}`} />
        </div>;
      case "user":
        return <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-blue-600" />
        </div>;
      case "transaction":
        return <div className="h-9 w-9 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>;
      case "support":
        return <div className="h-9 w-9 bg-orange-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
        </div>;
      default:
        return <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center">
          <Bell className="h-5 w-5 text-blue-600" />
        </div>;
    }
  };

  // Get badge styles based on priority
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 font-semibold";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200 font-semibold";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200 font-semibold";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Display loading state
  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error && notifications.length === 0) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Notifications</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchNotifications}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notifications Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Notifications Center
          </h2>
          <p className="text-gray-600 text-sm">View and manage system alerts and notifications</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="border-gray-200"
            onClick={markAllAsRead}
            disabled={isMarkingRead || summary.unreadCount === 0}
          >
            {isMarkingRead ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4 mr-2" />
            )}
            Mark All as Read
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-200"
            onClick={() => toast({
              title: "Settings",
              description: "Notification settings functionality is coming soon",
            })}
          >
            <Settings className="h-4 w-4 mr-2" />
            Notification Settings
          </Button>
        </div>
      </div>

      {/* Notification Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-red-100 shadow-md rounded-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-700">{summary.criticalCount}</p>
              </div>
            </div>
            <Badge className="bg-red-100 text-red-800 border-red-200">
              {summary.criticalCount > 0 ? "Urgent" : "None"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-100 shadow-md rounded-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Info className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">System Alerts</p>
                <p className="text-2xl font-bold text-amber-700">{summary.systemCount}</p>
              </div>
            </div>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">Today</Badge>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100 shadow-md rounded-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">User Activity</p>
                <p className="text-2xl font-bold text-blue-700">{summary.userCount}</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">New</Badge>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 shadow-md rounded-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">System Status</p>
                <p className="text-2xl font-bold text-green-700">{summary.systemStatus}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">Online</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="border-2 border-gray-200 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="border-b-2 border-gray-100 bg-gray-50 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-600" />
                Notifications
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 font-medium mt-1">
                {filteredNotifications.length} notifications, {summary.unreadCount} unread
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm"
                variant="outline"
                className="border-gray-200"
                onClick={fetchNotifications}
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger value="all" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                All
              </TabsTrigger>
              <TabsTrigger value="security" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Security
              </TabsTrigger>
              <TabsTrigger value="system" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                System
              </TabsTrigger>
              <TabsTrigger value="user" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Users
              </TabsTrigger>
              <TabsTrigger value="transaction" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Transactions
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {isLoading && notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <Loader2 className="h-12 w-12 mx-auto text-gray-300 animate-spin mb-3" />
                <p className="font-medium">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="font-medium">No notifications in this category</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                    !notification.read 
                      ? 'bg-blue-50 hover:bg-blue-50/80 border-blue-500' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {getIcon(notification.type, notification.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                        <Badge variant="outline" className={getPriorityBadge(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        {!notification.read && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {notification.timestamp}
                        </span>
                        {notification.source && (
                          <span className="flex items-center">
                            <Info className="h-3 w-3 mr-1" />
                            {notification.source}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark as Read
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                          onClick={() => dismissNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings Preview */}
      <Card className="border-2 border-gray-200 shadow-md rounded-xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-600" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">Security Alerts</p>
                  <p className="text-sm text-gray-500">Login attempts, security vulnerabilities</p>
                </div>
              </div>
              <div className="flex items-center h-5">
                <input type="checkbox" id="security" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">System Updates</p>
                  <p className="text-sm text-gray-500">Version updates, maintenance notices</p>
                </div>
              </div>
              <div className="flex items-center h-5">
                <input type="checkbox" id="system" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">User Activity</p>
                  <p className="text-sm text-gray-500">New registrations, user actions</p>
                </div>
              </div>
              <div className="flex items-center h-5">
                <input type="checkbox" id="user" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 