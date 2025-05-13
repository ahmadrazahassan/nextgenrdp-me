"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlusCircle, ArrowLeft, AlertCircle, HelpCircle } from "lucide-react";

export default function NewTicketPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<string>("technical");
  const [priority, setPriority] = useState<string>("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (!subject.trim()) {
        setError("Please enter a subject for your ticket");
        return;
      }
      
      if (message.length < 10) {
        setError("Please provide more details in your message (at least 10 characters)");
        return;
      }
      
      const response = await fetch("/api/user/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          message,
          category,
          priority,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create ticket");
      }
      
      const data = await response.json();
      
      // Redirect to the newly created ticket
      router.push(`/dashboard/support/tickets/${data.ticket.id}`);
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError(err instanceof Error ? err.message : "Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
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
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Create New Support Ticket</h1>
        <p className="text-slate-600 mt-1">Describe your issue and our support team will assist you</p>
      </div>
      
      {/* Error Display */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </motion.div>
      )}
      
      {/* Ticket Creation Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-6">
          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
              Subject <span className="text-rose-500">*</span>
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              required
            />
          </div>
          
          {/* Category Field */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              required
            >
              <option value="billing">Billing & Payments</option>
              <option value="technical">Technical Support</option>
              <option value="account">Account Management</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {/* Priority Field */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-1">
              Priority <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div 
                className={`relative border rounded-lg p-3 cursor-pointer ${
                  priority === "low" 
                    ? "bg-emerald-50 border-emerald-200" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => setPriority("low")}
              >
                <input 
                  type="radio" 
                  name="priority" 
                  id="priority-low" 
                  value="low" 
                  checked={priority === "low"} 
                  onChange={() => setPriority("low")} 
                  className="sr-only"
                />
                <label htmlFor="priority-low" className="cursor-pointer block text-center">
                  <div className={`text-sm font-medium ${priority === "low" ? "text-emerald-700" : "text-slate-700"}`}>
                    Low
                  </div>
                  <div className={`text-xs ${priority === "low" ? "text-emerald-600" : "text-slate-500"}`}>
                    General questions
                  </div>
                </label>
              </div>
              
              <div 
                className={`relative border rounded-lg p-3 cursor-pointer ${
                  priority === "medium" 
                    ? "bg-amber-50 border-amber-200" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => setPriority("medium")}
              >
                <input 
                  type="radio" 
                  name="priority" 
                  id="priority-medium" 
                  value="medium" 
                  checked={priority === "medium"} 
                  onChange={() => setPriority("medium")} 
                  className="sr-only"
                />
                <label htmlFor="priority-medium" className="cursor-pointer block text-center">
                  <div className={`text-sm font-medium ${priority === "medium" ? "text-amber-700" : "text-slate-700"}`}>
                    Medium
                  </div>
                  <div className={`text-xs ${priority === "medium" ? "text-amber-600" : "text-slate-500"}`}>
                    Minor issues
                  </div>
                </label>
              </div>
              
              <div 
                className={`relative border rounded-lg p-3 cursor-pointer ${
                  priority === "high" 
                    ? "bg-rose-50 border-rose-200" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => setPriority("high")}
              >
                <input 
                  type="radio" 
                  name="priority" 
                  id="priority-high" 
                  value="high" 
                  checked={priority === "high"} 
                  onChange={() => setPriority("high")} 
                  className="sr-only"
                />
                <label htmlFor="priority-high" className="cursor-pointer block text-center">
                  <div className={`text-sm font-medium ${priority === "high" ? "text-rose-700" : "text-slate-700"}`}>
                    High
                  </div>
                  <div className={`text-xs ${priority === "high" ? "text-rose-600" : "text-slate-500"}`}>
                    Urgent problems
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
              Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setCharacterCount(e.target.value.length);
              }}
              placeholder="Please describe your issue in detail. Include any relevant information that will help us assist you better."
              rows={8}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              required
            />
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <div>
                {characterCount < 10 ? (
                  <span className="text-rose-500">Minimum 10 characters required ({10 - characterCount} more needed)</span>
                ) : (
                  <span>Character count: {characterCount}</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Ticket</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/dashboard/support/tickets')}
              disabled={loading}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      
      {/* Help Box */}
      <div className="mt-8 p-5 rounded-xl border border-indigo-100 bg-indigo-50">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-indigo-100 rounded-full">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-indigo-700 mb-1">Tips for faster support</h3>
            <ul className="text-xs text-indigo-600 space-y-1">
              <li>Be specific about what you're experiencing</li>
              <li>Include any error messages you've received</li>
              <li>Mention what you've already tried to resolve the issue</li>
              <li>For technical issues, specify which service is affected (RDP, VPS, etc.)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 