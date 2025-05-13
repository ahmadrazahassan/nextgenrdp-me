'use client'; // Keep as client component if using Lucide icons directly

import React from 'react';
import { 
    Settings2, 
    UserCog, 
    CreditCard, 
    ClipboardCheck, 
    Info
} from 'lucide-react';

const HowToOrderGuide = () => {
  const steps = [
    { icon: Settings2, title: "Configure Service", description: "Select location & apply promo codes.", color: "text-blue-600" },
    { icon: UserCog, title: "Account Details", description: "Log in or create an account.", color: "text-purple-600" },
    { icon: CreditCard, title: "Payment", description: "Choose method & upload proof.", color: "text-green-600" },
    { icon: ClipboardCheck, title: "Review & Confirm", description: "Check details & place order.", color: "text-teal-600" },
  ];

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-center text-gray-700 mb-6">How to Complete Your Order</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <step.icon className={`h-10 w-10 mb-3 ${step.color}`} />
            <h4 className="font-medium text-gray-800">{step.title}</h4>
            <p className="text-xs text-gray-500 mt-1">{step.description}</p>
          </div>
        ))}
      </div>
       <div className="mt-6 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-start gap-3 text-xs">
            <Info size={18} className="text-indigo-600 flex-shrink-0 mt-0.5"/>
            <p className="text-indigo-700"> All payments are verified manually by our team after you place the order. You can monitor the status in your dashboard.</p>
        </div>
    </div>
  );
};

export default HowToOrderGuide; 