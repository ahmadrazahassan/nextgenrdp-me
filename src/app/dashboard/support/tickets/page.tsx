"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Ticket,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  ChevronRight,
  ArrowLeft,
  Filter,
  Search
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

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/tickets");
      
      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }
      
      const data = await response.json();
      setTickets(data.tickets);
      setError(null);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load tickets. Please try again later.");
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "closed":
        return <AlertCircle className="h-4 w-4 text-slate-500" />;
      default:
        return null;
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

  // Filter tickets by status and search query
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/dashboard/support" 
          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Support
        </Link>
      </div>
      
      {/* Page Header */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-violet-600/20 rounded-2xl -z-10 blur-xl opacity-80"></div>
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10 mix-blend-overlay"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 relative z-10 backdrop-blur-sm bg-white/30 dark:bg-slate-950/30 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Ticket className="h-7 w-7 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Support Tickets</h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm">Manage your support requests</p>
            </div>
          </div>
          
          <button
            onClick={() => router.push("/dashboard/support/tickets/new")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </button>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Filter className="h-5 w-5 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "all")}
            className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
      
      {/* Tickets List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative h-10 w-10">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-lg text-center">
          <AlertCircle className="h-6 w-6 mx-auto mb-2" />
          <p>{error}</p>
          <button 
            onClick={fetchTickets}
            className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Try Again
          </button>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl text-center">
          {searchQuery || statusFilter !== "all" ? (
            <>
              <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Search className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-1">No matching tickets</h3>
              <p className="text-slate-500 mb-3">Try changing your search or filter</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Ticket className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-1">No tickets yet</h3>
              <p className="text-slate-500 mb-3">Create your first support ticket to get help</p>
              <button
                onClick={() => router.push("/dashboard/support/tickets/new")}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                New Ticket
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/dashboard/support/tickets/${ticket.id}`}
              className="block"
            >
              <div className="border border-slate-200 rounded-xl bg-white p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(ticket.status)}
                      <h3 className="font-medium text-slate-800">{ticket.subject}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className={`px-2 py-0.5 rounded-full border ${getStatusColor(ticket.status)}`}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                      </span>
                      <span className="px-2 py-0.5 rounded-full border text-blue-600 bg-blue-50 border-blue-200">
                        {getCategoryLabel(ticket.category)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
                
                <div className="mt-3 text-sm text-slate-500 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}</span>
                  </div>
                  <div>Created {format(new Date(ticket.createdAt), 'MMM d, yyyy')}</div>
                </div>
                
                {/* Display latest reply preview if available */}
                {ticket.replies.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${ticket.replies[ticket.replies.length - 1].isStaffReply ? 'bg-blue-100' : 'bg-slate-100'}`}>
                        {ticket.replies[ticket.replies.length - 1].isStaffReply ? (
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-medium mb-1">
                          {ticket.replies[ticket.replies.length - 1].isStaffReply ? (
                            <span className="text-blue-600">Support Team</span>
                          ) : (
                            <span>You</span>
                          )}
                          <span className="text-slate-400 font-normal ml-2">
                            {format(new Date(ticket.replies[ticket.replies.length - 1].createdAt), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-1">
                          {ticket.replies[ticket.replies.length - 1].message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 