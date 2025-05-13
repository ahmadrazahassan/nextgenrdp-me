"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Receipt, 
  FileText, 
  ChevronRight, 
  Clock, 
  Calendar, 
  Download, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  ChevronDown,
  Search,
  Wallet
} from "lucide-react";

export default function BillingHelpDocs() {
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  const toggleFaq = (faq: string) => {
    setExpandedFaq(expandedFaq === faq ? null : faq);
  };
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-5xl">
      <div className="flex items-center mb-4">
        <Link 
          href="/support/help-docs" 
          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          Back to Help Docs
        </Link>
      </div>
      
      {/* Page Header */}
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-violet-600/20 rounded-2xl -z-10 blur-xl opacity-80"></div>
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10 mix-blend-overlay"></div>
        
        <div className="flex flex-col relative z-10 backdrop-blur-sm bg-white/30 dark:bg-slate-950/30 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <CreditCard className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Billing & Payments Help</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Comprehensive guide to understanding your billing, invoices, and payments</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search billing documentation..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-sm"
          />
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div 
          className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex items-center gap-3 cursor-pointer"
          onClick={() => toggleSection("invoices")}
        >
          <div className="p-2 bg-blue-100 rounded-full">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium">Understanding Invoices</h3>
            <p className="text-sm text-slate-500">Learn about your billing documents</p>
          </div>
        </div>
        
        <div 
          className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex items-center gap-3 cursor-pointer"
          onClick={() => toggleSection("payments")}
        >
          <div className="p-2 bg-emerald-100 rounded-full">
            <Wallet className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-medium">Payment Instructions</h3>
            <p className="text-sm text-slate-500">How to complete your payments</p>
          </div>
        </div>
        
        <div 
          className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex items-center gap-3 cursor-pointer"
          onClick={() => toggleSection("faq")}
        >
          <div className="p-2 bg-amber-100 rounded-full">
            <HelpCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium">FAQ</h3>
            <p className="text-sm text-slate-500">Answers to common billing questions</p>
          </div>
        </div>
      </div>
      
      {/* Main Documentation */}
      <div className="space-y-6">
        {/* Billing Overview Section */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div 
            className={`p-5 border-b border-slate-200 flex justify-between items-center cursor-pointer ${expandedSection === "overview" ? "bg-indigo-50" : "bg-white"}`}
            onClick={() => toggleSection("overview")}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${expandedSection === "overview" ? "bg-indigo-100" : "bg-slate-100"}`}>
                <CreditCard className={`h-5 w-5 ${expandedSection === "overview" ? "text-indigo-600" : "text-slate-600"}`} />
              </div>
              <h2 className="text-lg font-medium">Billing Overview</h2>
            </div>
            <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedSection === "overview" ? "rotate-180" : ""}`} />
          </div>
          
          {expandedSection === "overview" && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-5"
            >
              <div className="prose prose-indigo max-w-none">
                <h3>Understanding Your Billing Dashboard</h3>
                <p>
                  The Billing Dashboard provides a comprehensive overview of your financial relationship with NextGenRDP. 
                  Here's what you'll find in each section:
                </p>
                
                <h4>Overview Tab</h4>
                <ul>
                  <li>
                    <strong>Billing Summary</strong> - Shows your total spent, number of active services, and account balance at a glance.
                  </li>
                  <li>
                    <strong>Upcoming Payment</strong> - Displays your next scheduled payment with due date and amount.
                  </li>
                  <li>
                    <strong>Recent Activity</strong> - Lists your most recent billing activities including payments and new invoices.
                  </li>
                </ul>
                
                <h4>Invoices Tab</h4>
                <p>
                  View your complete invoice history with detailed information about each transaction. 
                  You can filter invoices by status, search for specific records, and download PDF copies.
                </p>
                
                <h4>Payment History Tab</h4>
                <p>
                  Access your payment history with detailed records of all completed transactions.
                  You can download receipts for your records and view payment methods used.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 my-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-blue-700 font-medium mb-1">Important Note</h4>
                      <p className="text-blue-600 text-sm">
                        All prices are displayed in Pakistani Rupees (PKR). Invoices are generated automatically when you place an order
                        or when a subscription renewal is due.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Invoices Section */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div 
            className={`p-5 border-b border-slate-200 flex justify-between items-center cursor-pointer ${expandedSection === "invoices" ? "bg-blue-50" : "bg-white"}`}
            onClick={() => toggleSection("invoices")}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${expandedSection === "invoices" ? "bg-blue-100" : "bg-slate-100"}`}>
                <FileText className={`h-5 w-5 ${expandedSection === "invoices" ? "text-blue-600" : "text-slate-600"}`} />
              </div>
              <h2 className="text-lg font-medium">Understanding Invoices</h2>
            </div>
            <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedSection === "invoices" ? "rotate-180" : ""}`} />
          </div>
          
          {expandedSection === "invoices" && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-5"
            >
              <div className="prose prose-blue max-w-none">
                <h3>Invoice Details Explained</h3>
                <p>
                  Our invoices provide detailed information about your orders and payments. Here's a breakdown of the key elements:
                </p>
                
                <h4>Invoice Elements</h4>
                <ul>
                  <li>
                    <strong>Invoice ID</strong> - A unique identifier for each invoice (format: INV-XXXXXXXX).
                  </li>
                  <li>
                    <strong>Order ID</strong> - References the specific order this invoice is associated with.
                  </li>
                  <li>
                    <strong>Date</strong> - When the invoice was issued.
                  </li>
                  <li>
                    <strong>Due Date</strong> - The date by which payment should be completed (for pending invoices).
                  </li>
                  <li>
                    <strong>Amount</strong> - The total amount to be paid.
                  </li>
                  <li>
                    <strong>Status</strong> - Current state of the invoice (Paid, Pending, Overdue).
                  </li>
                  <li>
                    <strong>Service Details</strong> - Description of the purchased service(s).
                  </li>
                </ul>
                
                <h4>Invoice Statuses</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                  <div className="p-3 border border-emerald-100 rounded-lg bg-emerald-50">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <h5 className="font-medium text-emerald-700">Paid</h5>
                    </div>
                    <p className="text-sm text-emerald-600">
                      Payment has been received and processed successfully.
                    </p>
                  </div>
                  
                  <div className="p-3 border border-amber-100 rounded-lg bg-amber-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <h5 className="font-medium text-amber-700">Pending</h5>
                    </div>
                    <p className="text-sm text-amber-600">
                      Invoice has been issued but payment hasn't been received yet.
                    </p>
                  </div>
                  
                  <div className="p-3 border border-rose-100 rounded-lg bg-rose-50">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-rose-600" />
                      <h5 className="font-medium text-rose-700">Overdue</h5>
                    </div>
                    <p className="text-sm text-rose-600">
                      Due date has passed without payment being received.
                    </p>
                  </div>
                </div>
                
                <h4>Downloading Invoices</h4>
                <p>
                  You can download PDF copies of your invoices for your records:
                </p>
                <ol>
                  <li>Navigate to the "Invoices" tab in your Billing Dashboard</li>
                  <li>Find the invoice you wish to download</li>
                  <li>Click the "PDF" button with the download icon</li>
                  <li>The invoice will download automatically to your device</li>
                </ol>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 my-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="text-amber-700 font-medium mb-1">Tax Information</h4>
                      <p className="text-amber-600 text-sm">
                        All invoices include applicable taxes as required by law. If you need a specific tax format or have
                        questions about tax application, please contact our support team.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Payments Section */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div 
            className={`p-5 border-b border-slate-200 flex justify-between items-center cursor-pointer ${expandedSection === "payments" ? "bg-emerald-50" : "bg-white"}`}
            onClick={() => toggleSection("payments")}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${expandedSection === "payments" ? "bg-emerald-100" : "bg-slate-100"}`}>
                <Wallet className={`h-5 w-5 ${expandedSection === "payments" ? "text-emerald-600" : "text-slate-600"}`} />
              </div>
              <h2 className="text-lg font-medium">Payment Instructions</h2>
            </div>
            <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedSection === "payments" ? "rotate-180" : ""}`} />
          </div>
          
          {expandedSection === "payments" && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-5"
            >
              <div className="prose prose-emerald max-w-none">
                <h3>How to Make Payments</h3>
                <p>
                  NextGenRDP processes payments manually. When a payment is due, you'll receive detailed instructions
                  via email. Here's what you should know about our payment process:
                </p>
                
                <h4>Payment Timeline</h4>
                <ul>
                  <li>Invoices are generated automatically when you place an order or when a subscription is due for renewal</li>
                  <li>Payment is due within 7 days of invoice generation</li>
                  <li>Services may be suspended if payment is not received within 14 days</li>
                  <li>You'll receive email reminders 7 days, 3 days, and 1 day before suspension</li>
                </ul>
                
                <h4>Supported Payment Methods</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Bank Transfer</h5>
                    <p className="text-sm text-slate-600">
                      Transfer the invoiced amount directly to our bank account. Account details will be provided in the payment 
                      instructions email.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Mobile Payment Services</h5>
                    <p className="text-sm text-slate-600">
                      We accept payments through popular mobile payment services. Details will be provided in the payment 
                      instructions email.
                    </p>
                  </div>
                </div>
                
                <h4>Payment Confirmation Process</h4>
                <ol>
                  <li>After making a payment, forward your payment confirmation to billing@nextgenrdp.com</li>
                  <li>Include your Invoice ID and Order ID in the email subject</li>
                  <li>Our team will verify the payment (usually within 24 hours)</li>
                  <li>You'll receive a payment confirmation email with a receipt</li>
                  <li>Your invoice status will be updated to "Paid" in your billing dashboard</li>
                </ol>
                
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 my-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <h4 className="text-emerald-700 font-medium mb-1">Payment Receipt</h4>
                      <p className="text-emerald-600 text-sm">
                        After your payment is confirmed, a receipt will be generated automatically. You can download this receipt
                        from the "Payment History" tab in your billing dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Renewal & Cancellation Section */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div 
            className={`p-5 border-b border-slate-200 flex justify-between items-center cursor-pointer ${expandedSection === "renewal" ? "bg-purple-50" : "bg-white"}`}
            onClick={() => toggleSection("renewal")}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${expandedSection === "renewal" ? "bg-purple-100" : "bg-slate-100"}`}>
                <RefreshCw className={`h-5 w-5 ${expandedSection === "renewal" ? "text-purple-600" : "text-slate-600"}`} />
              </div>
              <h2 className="text-lg font-medium">Renewals & Cancellations</h2>
            </div>
            <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedSection === "renewal" ? "rotate-180" : ""}`} />
          </div>
          
          {expandedSection === "renewal" && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-5"
            >
              <div className="prose prose-purple max-w-none">
                <h3>Managing Your Subscriptions</h3>
                <p>
                  Understanding how renewals and cancellations work is important for managing your services effectively.
                </p>
                
                <h4>Automatic Renewals</h4>
                <ul>
                  <li>All subscriptions are set to auto-renew by default</li>
                  <li>You'll receive a renewal notice via email 7 days before the renewal date</li>
                  <li>A new invoice will be generated automatically on the renewal date</li>
                  <li>The same payment process applies to renewal invoices</li>
                </ul>
                
                <h4>How to Cancel a Subscription</h4>
                <ol>
                  <li>Navigate to your Dashboard</li>
                  <li>Select the service you wish to cancel</li>
                  <li>Click on "Manage" and then "Cancel Subscription"</li>
                  <li>Follow the prompts to confirm cancellation</li>
                  <li>You'll receive a cancellation confirmation email</li>
                </ol>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 my-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="text-amber-700 font-medium mb-1">Important Notice</h4>
                      <p className="text-amber-600 text-sm">
                        Cancellation must be requested at least 7 days before the renewal date to avoid being charged for the next period.
                        After cancellation, your service will remain active until the end of the current billing period.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h4>Refund Policy</h4>
                <p>
                  Please refer to our refund policy for detailed information about eligible refunds and the refund process:
                </p>
                <ul>
                  <li>New subscriptions: Eligible for refund within 7 days of purchase if service is unusable</li>
                  <li>Renewals: Generally not eligible for refunds once processed</li>
                  <li>Refund requests must be submitted through our support system</li>
                </ul>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* FAQ Section */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div 
            className={`p-5 border-b border-slate-200 flex justify-between items-center cursor-pointer ${expandedSection === "faq" ? "bg-amber-50" : "bg-white"}`}
            onClick={() => toggleSection("faq")}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${expandedSection === "faq" ? "bg-amber-100" : "bg-slate-100"}`}>
                <HelpCircle className={`h-5 w-5 ${expandedSection === "faq" ? "text-amber-600" : "text-slate-600"}`} />
              </div>
              <h2 className="text-lg font-medium">Frequently Asked Questions</h2>
            </div>
            <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedSection === "faq" ? "rotate-180" : ""}`} />
          </div>
          
          {expandedSection === "faq" && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-5"
            >
              <div className="space-y-4">
                {/* FAQ Item 1 */}
                <div className="border rounded-lg overflow-hidden">
                  <div 
                    className={`p-4 ${expandedFaq === "faq1" ? "bg-amber-50 border-b border-amber-100" : "bg-white"} cursor-pointer flex justify-between items-center`}
                    onClick={() => toggleFaq("faq1")}
                  >
                    <h3 className="font-medium">What happens if I miss a payment?</h3>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedFaq === "faq1" ? "rotate-180" : ""}`} />
                  </div>
                  
                  {expandedFaq === "faq1" && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4"
                    >
                      <p className="text-slate-600">
                        If you miss a payment, you'll receive multiple reminder emails. Your service will continue running for a grace period of 7 days 
                        past the due date. After that, it may be suspended until payment is made. To restore a suspended service, simply make the 
                        outstanding payment, and your service will be reactivated within 24 hours.
                      </p>
                    </motion.div>
                  )}
                </div>
                
                {/* FAQ Item 2 */}
                <div className="border rounded-lg overflow-hidden">
                  <div 
                    className={`p-4 ${expandedFaq === "faq2" ? "bg-amber-50 border-b border-amber-100" : "bg-white"} cursor-pointer flex justify-between items-center`}
                    onClick={() => toggleFaq("faq2")}
                  >
                    <h3 className="font-medium">How do I update my billing information?</h3>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedFaq === "faq2" ? "rotate-180" : ""}`} />
                  </div>
                  
                  {expandedFaq === "faq2" && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4"
                    >
                      <p className="text-slate-600">
                        You can update your billing information in your account settings. Navigate to Dashboard → Settings → Billing Information. 
                        Here you can update your name, address, contact information, and tax details. These changes will be reflected in all 
                        future invoices generated for your account.
                      </p>
                    </motion.div>
                  )}
                </div>
                
                {/* FAQ Item 3 */}
                <div className="border rounded-lg overflow-hidden">
                  <div 
                    className={`p-4 ${expandedFaq === "faq3" ? "bg-amber-50 border-b border-amber-100" : "bg-white"} cursor-pointer flex justify-between items-center`}
                    onClick={() => toggleFaq("faq3")}
                  >
                    <h3 className="font-medium">Can I change my payment method?</h3>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedFaq === "faq3" ? "rotate-180" : ""}`} />
                  </div>
                  
                  {expandedFaq === "faq3" && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4"
                    >
                      <p className="text-slate-600">
                        Yes, you can use different payment methods for each invoice. When you receive your payment instructions email, 
                        it will contain details for all supported payment methods. Simply choose the one that's most convenient for you.
                        If you have a preferred payment method that you'd like to use for all future payments, please contact our support team.
                      </p>
                    </motion.div>
                  )}
                </div>
                
                {/* FAQ Item 4 */}
                <div className="border rounded-lg overflow-hidden">
                  <div 
                    className={`p-4 ${expandedFaq === "faq4" ? "bg-amber-50 border-b border-amber-100" : "bg-white"} cursor-pointer flex justify-between items-center`}
                    onClick={() => toggleFaq("faq4")}
                  >
                    <h3 className="font-medium">I need a specific invoice format for my business. Is this possible?</h3>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedFaq === "faq4" ? "rotate-180" : ""}`} />
                  </div>
                  
                  {expandedFaq === "faq4" && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4"
                    >
                      <p className="text-slate-600">
                        Yes, we can accommodate special invoicing requirements for business customers. Please contact our billing support team
                        at billing@nextgenrdp.com with details about your requirements. We can provide customized invoices with additional information
                        such as purchase order numbers, tax identification details, or specific formatting required by your accounting department.
                      </p>
                    </motion.div>
                  )}
                </div>
                
                {/* FAQ Item 5 */}
                <div className="border rounded-lg overflow-hidden">
                  <div 
                    className={`p-4 ${expandedFaq === "faq5" ? "bg-amber-50 border-b border-amber-100" : "bg-white"} cursor-pointer flex justify-between items-center`}
                    onClick={() => toggleFaq("faq5")}
                  >
                    <h3 className="font-medium">Why was my service suspended?</h3>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedFaq === "faq5" ? "rotate-180" : ""}`} />
                  </div>
                  
                  {expandedFaq === "faq5" && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4"
                    >
                      <p className="text-slate-600">
                        Service suspension usually occurs due to one of these reasons:
                      </p>
                      <ul className="mt-2 space-y-1 text-slate-600">
                        <li>Overdue payment (after the grace period has expired)</li>
                        <li>Violation of our Terms of Service</li>
                        <li>Security concerns related to your account</li>
                      </ul>
                      <p className="mt-2 text-slate-600">
                        Check your email for notifications about the suspension cause. For payment-related suspensions,
                        simply paying the outstanding balance will restore your service. For other issues, please contact our support team.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Help and Support Box */}
      <div className="mt-10 p-6 rounded-xl border border-indigo-200 bg-indigo-50">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-indigo-100 rounded-full">
            <HelpCircle className="h-10 w-10 text-indigo-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-indigo-700 mb-2">Need More Help?</h3>
            <p className="text-indigo-600 mb-4">
              Our billing support team is available to assist you with any questions or issues related to your billing, invoices, or payments.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/dashboard/support"
                className="inline-flex items-center justify-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Contact Support
              </Link>
              
              <Link 
                href="mailto:billing@nextgenrdp.com"
                className="inline-flex items-center justify-center bg-white text-indigo-600 border border-indigo-300 py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Email Billing Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 