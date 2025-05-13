'use client';

import React from 'react';
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogTrigger, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
    HelpCircle, 
    Settings2, 
    UserCog, 
    CreditCard, 
    FileCheck, 
    ClipboardCheck, 
    Check, 
    Info
} from 'lucide-react';

const HowToOrderModal = () => {
  const steps = [
    {
      icon: Settings2,
      title: "1. Configure Your Service",
      description: "Select your desired server location. If you have a promo code, enter and apply it here.",
      color: "text-blue-600"
    },
    {
      icon: UserCog,
      title: "2. Account Details",
      description: "Log in to your existing account or create a new one. This links the order to your profile.",
      color: "text-purple-600"
    },
    {
      icon: CreditCard,
      title: "3. Payment Method & Proof",
      description: "Choose a manual payment method (Wise, Bank, NayaPay), make the payment using the details provided, and upload a clear screenshot or PDF proof.",
      color: "text-green-600"
    },
    {
      icon: ClipboardCheck,
      title: "4. Review & Confirm",
      description: "Carefully review your plan, configuration, and pricing. Once everything looks correct, confirm and place your order.",
      color: "text-teal-600"
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-gray-300">
          <HelpCircle size={16} />
          How to Order?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">Ordering Process</DialogTitle>
          <DialogDescription className="text-gray-600">
            Follow these steps to complete your RDP/VPS order.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <step.icon className={`h-8 w-8 mt-1 flex-shrink-0 ${step.color}`} />
              <div>
                <h4 className="font-semibold text-gray-800">{step.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-2 p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex items-start gap-3">
            <Info size={24} className="text-indigo-600 flex-shrink-0 mt-0.5"/>
            <div>
                <h5 className="font-semibold text-indigo-800">Important Note</h5>
                <p className="text-sm text-indigo-700 mt-1">All payments are processed manually. After submitting your order and payment proof, please allow time for our team to verify the transaction. You can track your order status in the Client Area dashboard.</p>
             </div>
        </div>

        {/* Footer could have a close button if needed, but default X is usually sufficient */}
        {/* <DialogFooter>
          <Button type="button" variant="secondary">Close</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default HowToOrderModal; 