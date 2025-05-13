"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import React from "react";
import {
  Ticket,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  Send,
  XCircle,
  RefreshCw,
  CornerDownLeft
} from "lucide-react";

// Define ticket-related types
type TicketPriority = "low" | "medium" | "high";
type TicketStatus = "open" | "closed" | "resolved";
type TicketCategory = "billing" | "technical" | "account" | "other";

interface TicketReply {
  id: string;
  message: string;
  createdAt: string;
  isStaffReply: boolean;
  staffName?: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  replies: TicketReply[];
}

export default function TicketDetailPage({ params }: { params: { ticketId: string } }) {
  const router = useRouter();
  // Unwrap params using React.use()
  const resolvedParams = React.use(Promise.resolve(params));
  const { ticketId } = resolvedParams;
  
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReply, setNewReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  useEffect(() => {
    fetchTicket();
  }, [ticketId]);
  
  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/tickets/${ticketId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Ticket not found");
        }
        throw new Error("Failed to fetch ticket");
      }
      
      const data = await response.json();
      setTicket(data.ticket);
    } catch (err) {
      console.error("Error fetching ticket:", err);
      setError(err instanceof Error ? err.message : "Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendReply = async () => {
    if (!newReply.trim()) return;
    
    try {
      setSendingReply(true);
      
      const response = await fetch(`/api/user/tickets/${ticketId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newReply,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to send reply");
      }
      
      // Clear the input and refresh the ticket data
      setNewReply("");
      await fetchTicket();
    } catch (err) {
      console.error("Error sending reply:", err);
      setError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };
  
  const handleStatusChange = async (newStatus: TicketStatus) => {
    try {
      setUpdatingStatus(true);
      
      const response = await fetch(`/api/user/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update ticket status");
      }
      
      // Refresh the ticket data
      await fetchTicket();
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err instanceof Error ? err.message : "Failed to update ticket status");
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case "high":
        return "text-rose-600 bg-rose-50 border-rose-200";
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "low":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };
  
  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "resolved":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "closed":
        return "text-slate-600 bg-slate-50 border-slate-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };
  
  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "closed":
        return <XCircle className="h-4 w-4 text-slate-500" />;
      default:
        return null;
    }
  };
  
  const getCategoryLabel = (category: TicketCategory) => {
    switch (category) {
      case "billing":
        return "Billing";
      case "technical":
        return "Technical Support";
      case "account":
        return "Account";
      case "other":
        return "Other";
      default:
        return "Other";
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <div className="relative h-10 w-10">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-6">
          <Link 
            href="/dashboard/support/tickets" 
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tickets
          </Link>
        </div>
        
        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-6 rounded-lg text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">Error Loading Ticket</h3>
          <p>{error}</p>
          <button 
            onClick={fetchTicket}
            className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!ticket) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-6">
          <Link 
            href="/dashboard/support/tickets" 
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tickets
          </Link>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 text-amber-600 p-6 rounded-lg text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">Ticket Not Found</h3>
          <p>The ticket you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link 
            href="/dashboard/support/tickets"
            className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            View All Tickets
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/dashboard/support/tickets" 
          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tickets
        </Link>
      </div>
      
      {/* Ticket Header */}
      <div className="mb-8 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <Ticket className="h-5 w-5 text-indigo-600" />
                </div>
                <h1 className="text-xl font-bold text-slate-800">{ticket.subject}</h1>
              </div>
              
              <div className="flex flex-wrap gap-2 my-3">
                <span className={`px-2 py-0.5 rounded-full text-sm border ${getStatusColor(ticket.status)}`}>
                  {getStatusIcon(ticket.status)}
                  <span className="ml-1">{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-sm border ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                </span>
                <span className="px-2 py-0.5 rounded-full text-sm border text-blue-600 bg-blue-50 border-blue-200">
                  {getCategoryLabel(ticket.category)}
                </span>
              </div>
              
              <div className="text-sm text-slate-500">
                Created on {format(new Date(ticket.createdAt), "MMMM d, yyyy 'at' h:mm a")}
              </div>
            </div>
            
            <div className="flex gap-2">
              {ticket.status === "open" && (
                <button
                  onClick={() => handleStatusChange("resolved")}
                  disabled={updatingStatus}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark Resolved</span>
                </button>
              )}
              
              {ticket.status === "open" && (
                <button
                  onClick={() => handleStatusChange("closed")}
                  disabled={updatingStatus}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Close</span>
                </button>
              )}
              
              {(ticket.status === "resolved" || ticket.status === "closed") && (
                <button
                  onClick={() => handleStatusChange("open")}
                  disabled={updatingStatus}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reopen</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Conversation */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-slate-800 mb-4">Conversation</h2>
        
        <div className="space-y-6 mb-6">
          {ticket.replies.map((reply) => (
            <div 
              key={reply.id} 
              className={`p-5 rounded-lg ${
                reply.isStaffReply 
                  ? "bg-blue-50 border border-blue-100" 
                  : "bg-white border border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full ${reply.isStaffReply ? "bg-blue-100" : "bg-slate-100"}`}>
                  <MessageSquare className={`h-4 w-4 ${reply.isStaffReply ? "text-blue-600" : "text-slate-600"}`} />
                </div>
                <div>
                  <div className="font-medium">
                    {reply.isStaffReply ? (
                      <span className="text-blue-700">{reply.staffName || "Support Team"}</span>
                    ) : (
                      <span>You</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {format(new Date(reply.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              </div>
              
              <div className="pl-9">
                <p className="text-slate-700 whitespace-pre-wrap">{reply.message}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Reply Form */}
        {ticket.status === "open" && (
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-md font-medium text-slate-800 mb-3">Add Reply</h3>
            
            <div className="space-y-4">
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
              
              <div className="flex justify-end">
                <button
                  onClick={handleSendReply}
                  disabled={sendingReply || !newReply.trim()}
                  className={`flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors ${
                    (sendingReply || !newReply.trim()) ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {sendingReply ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Reply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Closed or Resolved Ticket Notice */}
        {ticket.status !== "open" && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex items-start gap-3">
            <div className="p-2 bg-slate-100 rounded-full">
              <AlertCircle className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <h3 className="text-md font-medium text-slate-800 mb-1">
                This ticket is {ticket.status === "resolved" ? "resolved" : "closed"}
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                {ticket.status === "resolved"
                  ? "The issue has been marked as resolved. If you're still experiencing problems, you can reopen this ticket."
                  : "This ticket has been closed. If you need further assistance, you can reopen this ticket or create a new one."}
              </p>
              <button
                onClick={() => handleStatusChange("open")}
                disabled={updatingStatus}
                className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800"
              >
                <CornerDownLeft className="h-4 w-4" />
                <span>Reopen this ticket</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 