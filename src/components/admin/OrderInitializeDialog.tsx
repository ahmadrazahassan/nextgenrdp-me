"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, addMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, AlertCircle, Package, ServerCog, Globe, Check, Loader2 } from "lucide-react";

// Interface for the order being initialized
interface Order {
  id: string;
  orderId: string;
  userId: string;
  planName: string;
  status: string;
  total: number;
  createdAt: string;
  location: string;
  locationCode?: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  isInitialized: boolean;
}

// Interface for plan data
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  isActive: boolean;
}

interface OrderInitializeDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (initializedOrder: any) => void;
  plans?: Plan[];
}

export function OrderInitializeDialog({ 
  order, 
  open, 
  onOpenChange,
  onComplete,
  plans = []
}: OrderInitializeDialogProps) {
  const [ipAddress, setIpAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(addMonths(new Date(), 1));
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Find the corresponding plan
  const selectedPlan = plans.find(plan => plan.name === order.planName);

  // Generate a random password
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let newPassword = "";
    
    // Ensure at least one character from each character set
    newPassword += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    newPassword += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    newPassword += "0123456789"[Math.floor(Math.random() * 10)];
    newPassword += "!@#$%^&*()_+"[Math.floor(Math.random() * 12)];
    
    // Fill the rest with random characters
    for (let i = 4; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Shuffle the password
    newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');
    
    setPassword(newPassword);
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!ipAddress) {
      newErrors.ipAddress = "IP address is required";
    } else if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ipAddress)) {
      newErrors.ipAddress = "Invalid IP address format";
    }
    
    if (!username) {
      newErrors.username = "Username is required";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (!expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      // Send data to the real API
      const response = await fetch('/api/admin/orders/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          ipAddress,
          username,
          password,
          expiryDate: expiryDate?.toISOString(),
          notes,
        }),
      });
      
      // Check if response was successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
      
      // Parse the response
      const data = await response.json();
      
      // Call the completion handler
      onComplete(data);
      
      // Reset form
      setIpAddress("");
      setUsername("");
      setPassword("");
      setExpiryDate(addMonths(new Date(), 1));
      setNotes("");
      setErrors({});
    } catch (error) {
      console.error("Error initializing order:", error);
      setApiError(error instanceof Error ? error.message : "Failed to initialize order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ServerCog className="h-5 w-5 text-sky-600" />
            <DialogTitle className="text-xl">Initialize Order</DialogTitle>
          </div>
          <DialogDescription>
            Configure service details for this order. This will make the service available to the customer.
          </DialogDescription>
        </DialogHeader>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 mt-4">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          </div>
        )}

        {/* Order summary section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-5 mt-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium flex items-center gap-2 text-gray-700">
                <Package className="h-4 w-4 text-sky-600" />
                Order Summary
              </h3>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 min-w-[80px]">Order ID:</span>
                  <span className="font-medium text-gray-900">{order.orderId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 min-w-[80px]">Plan:</span>
                  <span className="font-medium text-gray-900">{order.planName}</span>
                </div>
                {selectedPlan && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 min-w-[80px]">Type:</span>
                    <span className="font-medium text-gray-900">{selectedPlan.type}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 min-w-[80px]">Customer:</span>
                  <span className="font-medium text-gray-900">{order.customerName}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-sky-600" />
                <span className="text-sm font-medium text-gray-900">{order.location}</span>
              </div>
              <Badge className="mt-2 bg-amber-100 text-amber-800 border-0">
                Pending Initialization
              </Badge>
            </div>
          </div>
          
          {selectedPlan && (
            <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
              <p className="text-gray-700">{selectedPlan.description}</p>
            </div>
          )}
        </div>

        {/* Service configuration form */}
        <div className="grid gap-5 py-2">
          <h3 className="text-sm font-medium flex items-center gap-2 text-gray-700 mt-2">
            <ServerCog className="h-4 w-4 text-sky-600" />
            Service Configuration
          </h3>
          
          <div className="grid gap-2">
            <Label htmlFor="ipAddress" className="flex items-center gap-1">
              IP Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ipAddress"
              placeholder="e.g. 192.168.1.1"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className={cn(
                "font-mono w-full", 
                errors.ipAddress ? "border-red-500 focus-visible:ring-red-500" : ""
              )}
            />
            {errors.ipAddress && (
              <div className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.ipAddress}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username" className="flex items-center gap-1">
              Username <span className="text-red-500">*</span>
            </Label>
            <Input
              id="username"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={cn(
                "font-mono w-full", 
                errors.username ? "border-red-500 focus-visible:ring-red-500" : ""
              )}
            />
            {errors.username && (
              <div className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.username}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="flex items-center gap-1">
                Password <span className="text-red-500">*</span>
              </Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={generatePassword}
                className="h-8 text-sky-600 hover:text-sky-700 hover:bg-sky-50"
              >
                Generate
              </Button>
            </div>
            <Input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "font-mono w-full", 
                errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
              )}
            />
            {errors.password && (
              <div className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password}
              </div>
            )}
            {password && (
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Password strength: {password.length >= 12 ? "Strong" : "Medium"}
              </div>
            )}
          </div>

          <div className="grid gap-2 relative">
            <Label htmlFor="expiryDate" className="flex items-center gap-1">
              Expiry Date <span className="text-red-500">*</span>
            </Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="expiryDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white",
                    !expiryDate && "text-muted-foreground",
                    errors.expiryDate && "border-red-500 focus-visible:ring-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0 bg-white border border-gray-200 shadow-lg" 
                align="start"
                sideOffset={5}
                style={{ 
                  zIndex: 9999,
                  position: "relative"
                }}
                avoidCollisions={false}
                side="bottom"
              >
                <div className="bg-white rounded-md overflow-hidden">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={(date) => {
                      setExpiryDate(date);
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="rounded-md border-0"
                  />
                </div>
              </PopoverContent>
            </Popover>
            {errors.expiryDate && (
              <div className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.expiryDate}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any special configuration details or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] bg-white w-full"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="bg-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Initialize
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 