'use client';

import React from 'react';
import { Wallet, Landmark, Phone, Copy, Check } from 'lucide-react'; // Icons for payment methods
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { useToast } from "@/components/ui/use-toast"; // Import useToast for copy feedback

interface PaymentMethod {
  id: string;
  name: string;
  Icon: React.ElementType;
  details: Array<{ label: string; value: string; copyable?: boolean }>;
  themeColor: string; // e.g., 'blue', 'green', 'purple' for theming the card
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'wise',
    name: 'Wise (TransferWise)',
    Icon: Wallet,
    themeColor: 'green',
    details: [
      { label: 'Email', value: 'minal283636@gmail.com', copyable: true },
      { label: 'Beneficiary Name', value: 'Zaid Umar', copyable: true },
    ],
  },
  {
    id: 'alliedbank',
    name: 'Allied Bank',
    Icon: Landmark,
    themeColor: 'blue',
    details: [
      { label: 'Account Number', value: '13860010135378610018', copyable: true },
      { label: 'IBAN', value: 'PK57ABPA0010135378610018', copyable: true },
      { label: 'Account Name', value: 'Ahmad Raza Hassan', copyable: true },
    ],
  },
  {
    id: 'nayapay',
    name: 'NayaPay',
    Icon: Phone, // Or a more generic wallet/mobile pay icon if available
    themeColor: 'purple',
    details: [
      { label: 'NayaPay ID (Email)', value: 'ahmadchz0309@nayapay', copyable: true },
      { label: 'Registered Number', value: '03095782432', copyable: true },
    ],
  },
];

interface PaymentMethodSelectorProps {
  selectedMethodId: string | null;
  onMethodSelect: (methodId: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ selectedMethodId, onMethodSelect }) => {
  const [copiedValue, setCopiedValue] = React.useState<string | null>(null);
  const { toast } = useToast(); // Use toast for copy feedback

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedValue(text); // Highlight the copied item briefly
      toast({ title: "Copied!", description: `${label} copied to clipboard.` });
      setTimeout(() => setCopiedValue(null), 2000); 
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({ title: "Copy Failed", description: "Could not copy text to clipboard.", variant: "destructive" });
    });
  };

  // Define theme classes for light mode
  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'green': return 'border-gray-200 hover:border-green-400 hover:bg-green-50';
      case 'blue': return 'border-gray-200 hover:border-blue-400 hover:bg-blue-50';
      case 'purple': return 'border-gray-200 hover:border-purple-400 hover:bg-purple-50';
      default: return 'border-gray-200 hover:border-gray-400 hover:bg-gray-50';
    }
  };

  const getSelectedThemeClasses = (theme: string) => {
     switch (theme) {
      case 'green': return 'border-green-500 ring-2 ring-green-500 bg-green-50';
      case 'blue': return 'border-blue-500 ring-2 ring-blue-500 bg-blue-50';
      case 'purple': return 'border-purple-500 ring-2 ring-purple-500 bg-purple-50';
      default: return 'border-gray-400 ring-2 ring-gray-400 bg-gray-50';
    }
  };

  const getIconColor = (theme: string) => {
     switch (theme) {
        case 'green': return 'text-green-600';
        case 'blue': return 'text-blue-600';
        case 'purple': return 'text-purple-600';
        default: return 'text-gray-600';
      }
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Select Payment Method</h3>
      <p className="text-sm text-gray-500 mb-5">
        Choose one of the following methods for manual payment. You'll upload proof in the next step.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => onMethodSelect(method.id)}
            className={`p-5 rounded-lg border-2 cursor-pointer transition-all duration-200 bg-white shadow-sm 
              ${selectedMethodId === method.id 
                ? getSelectedThemeClasses(method.themeColor) 
                : getThemeClasses(method.themeColor)
            }`}
          >
            <div className="flex items-center mb-4">
              <method.Icon className={`h-7 w-7 mr-3 ${getIconColor(method.themeColor)}`} />
              <h4 className={`text-base font-semibold ${getIconColor(method.themeColor)}`}>{method.name}</h4>
            </div>
            <div className="space-y-2 border-t border-gray-200 pt-3">
              {method.details.map((detail) => (
                <div key={detail.label} className="flex flex-col sm:flex-row justify-between gap-1 text-sm">
                  <div className="text-gray-500 font-medium shrink-0 sm:w-2/5">{detail.label}:</div>
                  <div className="flex items-center justify-start sm:justify-end gap-1 min-w-0 sm:w-3/5">
                    <span className="text-gray-800 break-words text-left sm:text-right font-mono text-xs sm:text-sm flex-grow min-w-0">
                      {detail.value}
                    </span>
                    {detail.copyable && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); handleCopy(detail.value, detail.label); }}
                        className="text-gray-400 hover:text-indigo-600 h-6 w-6 shrink-0"
                        aria-label={`Copy ${detail.label}`}
                      >
                        {copiedValue === detail.value ? <Check size={14} className="text-green-600"/> : <Copy size={14} />}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector; 