"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HelpCircle,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Search,
} from "lucide-react";

// FAQ data
const faqItems = [
  {
    question: "How do I connect to my RDP/VPS?",
    answer:
      "After your order is activated, you'll receive login credentials in your dashboard. Use Remote Desktop Connection on Windows or an RDP client on Mac/Linux to connect using the provided IP, username, and password.",
  },
  {
    question: "What if I forget my RDP/VPS password?",
    answer:
      "You can reset your password from the dashboard under 'My Services'. Select the service and click on 'Reset Password'. A new password will be generated and displayed immediately.",
  },
  {
    question: "How do I upgrade my plan?",
    answer:
      "To upgrade, go to 'My Services', select the service you want to upgrade, and click 'Upgrade Plan'. You'll see available upgrade options with prorated pricing for the remainder of your billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfers, cryptocurrency payments, and mobile payment services. You can view all available payment methods during checkout or in the Billing section.",
  },
  {
    question: "How long does it take to activate my service?",
    answer:
      "After payment verification, your service is typically activated within 1-2 hours during business hours. For orders placed outside business hours, activation may take up to 12 hours.",
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer:
      "We offer a 3-day money-back guarantee for new customers. If you're not satisfied, contact support within 3 days of service activation to request a refund. Refunds are processed within 7 business days.",
  },
];

// Knowledge base articles
const knowledgeBaseArticles = [
  {
    id: 1,
    title: "Getting Started with Windows RDP",
    category: "Guides",
    excerpt: "Learn how to connect and set up your Windows RDP for first use.",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Securing Your VPS: Best Practices",
    category: "Security",
    excerpt: "Essential security measures to protect your virtual private server.",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Troubleshooting Common Connection Issues",
    category: "Troubleshooting",
    excerpt: "Solutions for the most frequent connection problems.",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Installing Software on Your RDP",
    category: "Guides",
    excerpt: "Step-by-step instructions for installing applications.",
    readTime: "4 min read",
  },
  {
    id: 5,
    title: "Optimizing VPS Performance",
    category: "Performance",
    excerpt: "Tips and tricks to maximize your VPS performance.",
    readTime: "7 min read",
  },
  {
    id: 6,
    title: "Backup and Recovery Options",
    category: "Management",
    excerpt: "How to set up backups and restore your data when needed.",
    readTime: "5 min read",
  },
];

// Support ticket interface
interface SupportTicket {
  id: string;
  subject: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  lastUpdated: string;
  messages: number;
}

// Mock support tickets
const mockTickets: SupportTicket[] = [
  {
    id: "TKT-1001",
    subject: "Cannot connect to my Windows RDP",
    status: "in-progress",
    priority: "high",
    category: "Technical Support",
    lastUpdated: "2023-11-15T10:30:00",
    messages: 3,
  },
  {
    id: "TKT-1002",
    subject: "Request for additional storage",
    status: "open",
    priority: "medium",
    category: "Sales",
    lastUpdated: "2023-11-14T16:45:00",
    messages: 1,
  },
  {
    id: "TKT-1003",
    subject: "Payment verification issue",
    status: "resolved",
    priority: "medium",
    category: "Billing",
    lastUpdated: "2023-11-10T09:15:00",
    messages: 5,
  },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "medium",
    message: "",
  });
  const { toast } = useToast();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate loading tickets
  useEffect(() => {
    const timer = setTimeout(() => {
      setTickets(mockTickets);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom of messages when viewing a ticket
  useEffect(() => {
    if (selectedTicket && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedTicket, newMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Ticket Submitted",
      description: "Your support ticket has been created successfully.",
    });

    // Add the new ticket to the list
    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: formData.subject,
      status: "open",
      priority: formData.priority as "low" | "medium" | "high" | "urgent",
      category: formData.category || "General",
      lastUpdated: new Date().toISOString(),
      messages: 1,
    };

    setTickets([newTicket, ...tickets]);
    setFormData({
      subject: "",
      category: "",
      priority: "medium",
      message: "",
    });
    setActiveTab("tickets");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    toast({
      title: "Message Sent",
      description: "Your reply has been sent to support.",
    });

    // Update the ticket with the new message
    if (selectedTicket) {
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              messages: ticket.messages + 1,
              lastUpdated: new Date().toISOString(),
              status: ticket.status === "resolved" ? "in-progress" : ticket.status,
            }
          : ticket
      );
      setTickets(updatedTickets);
      setSelectedTicket({
        ...selectedTicket,
        messages: selectedTicket.messages + 1,
        lastUpdated: new Date().toISOString(),
        status: selectedTicket.status === "resolved" ? "in-progress" : selectedTicket.status,
      });
    }

    setNewMessage("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            Open
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <MessageSquare className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Closed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            Low
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Medium
          </Badge>
        );
      case "high":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
            High
          </Badge>
        );
      case "urgent":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Urgent
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {priority}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderTicketMessages = () => {
    if (!selectedTicket) return null;

    // Mock messages for the selected ticket
    const mockMessages = [
      {
        id: 1,
        sender: "You",
        message: `I'm having trouble connecting to my RDP. I've tried multiple times but keep getting a connection error.`,
        timestamp: "2023-11-15T08:30:00",
        isUser: true,
      },
      {
        id: 2,
        sender: "Support Agent",
        message: `Hello! I'm sorry to hear you're having connection issues. Could you please provide the error message you're seeing? Also, have you made any recent changes to your network or firewall settings?`,
        timestamp: "2023-11-15T09:15:00",
        isUser: false,
      },
      {
        id: 3,
        sender: "You",
        message: `The error says "Remote Desktop can't connect to the remote computer". I haven't made any changes to my network settings. I was able to connect yesterday without issues.`,
        timestamp: "2023-11-15T09:45:00",
        isUser: true,
      },
      {
        id: 4,
        sender: "Support Agent",
        message: `Thank you for the details. I've checked your server and it appears there was a temporary network issue on our end. We've resolved it now. Could you please try connecting again and let me know if it works?`,
        timestamp: "2023-11-15T10:30:00",
        isUser: false,
      },
    ];

    return (
      <div className="space-y-4 max-h-[400px] overflow-y-auto p-4">
        {mockMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${message.isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-xs">{message.sender}</span>
                <span className="text-xs opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm">{message.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  const renderSkeletons = () => (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="border border-border/40 bg-background/60">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-3/5" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-4 mb-6"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Support Center</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Get help with your RDP/VPS services and account
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="h-9">
            <a href="https://wa.link/6h5rm7" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp Support
            </a>
          </Button>
          <Button asChild variant="default" size="sm" className="h-9">
            <a href="tel:+923000000000">
              <Phone className="h-4 w-4 mr-2" />
              Call Support
            </a>
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 md:w-[400px]">
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="new">New Ticket</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="kb">Knowledge Base</TabsTrigger>
        </TabsList>

        {/* My Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          {selectedTicket ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{selectedTicket.subject}</CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      Ticket ID: {selectedTicket.id} • {formatDate(selectedTicket.lastUpdated)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => setSelectedTicket(null)}
                >
                  ← Back to tickets
                </Button>
                <Separator className="mt-3" />
              </CardHeader>
              <CardContent className="pb-3">
                {renderTicketMessages()}
              </CardContent>
              <CardFooter className="flex flex-col space-y-3 pt-3 border-t">
                <div className="flex w-full items-center space-x-2">
                  <Textarea
                    placeholder="Type your reply here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Our support team typically responds within 2 hours during business hours.
                </div>
              </CardFooter>
            </Card>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search tickets..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("new")}
                >
                  New Ticket
                </Button>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  renderSkeletons()
                ) : tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <Card
                      key={ticket.id}
                      className="border border-border/40 bg-background/60 hover:bg-accent/10 transition-colors cursor-pointer"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">{ticket.subject}</CardTitle>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <CardDescription className="mt-1">
                          Ticket ID: {ticket.id} • Last updated: {formatDate(ticket.lastUpdated)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{ticket.category}</span>
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{ticket.messages} messages</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border border-border/40 bg-background/60">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="bg-muted/30 p-4 rounded-full mb-4 ring-1 ring-border/50">
                        <MessageSquare className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-medium text-foreground mb-2">No Support Tickets</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mb-6">
                        You don't have any support tickets yet. Create a new ticket if you need assistance.
                      </p>
                      <Button onClick={() => setActiveTab("new")}>
                        Create New Ticket
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </TabsContent>

        {/* New Ticket Tab */}
        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>
                Fill out the form below to submit a new support ticket. Our team will respond as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical Support">Technical Support</SelectItem>
                        <SelectItem value="Billing">Billing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Account">Account</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="priority" className="text-sm font-medium">
                      Priority
                    </label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => handleSelectChange("priority", value)}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Describe your issue in detail"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("tickets")}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit Ticket
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about our RDP/VPS services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Can't find what you're looking for?
              </p>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("new")}>
                Contact Support
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="kb" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>
                Explore our guides and tutorials to get the most out of your services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {knowledgeBaseArticles.map((article) => (
                  <Card key={article.id} className="border border-border/40 bg-background/60 hover:bg-accent/10 transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <Badge variant="outline" className="mb-2">
                          {article.category}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.readTime}
                        </div>
                      </div>
                      <CardTitle className="text-base">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="ghost" size="sm" className="w-full justify-between">
                        Read Article
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Need more detailed assistance?
              </p>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("new")}>
                Contact Support
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}