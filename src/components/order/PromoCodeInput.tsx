'use client';

import React from 'react';
import { TicketPercent } from 'lucide-react'; // Example icon
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface PromoCodeInputProps {
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  onApplyPromoCode: () => void;
  isLoading?: boolean; // Optional: for showing loading state on apply
  appliedMessage?: string | null; // Optional: message after applying (e.g., "Code Applied!" or error)
}

const PromoCodeInput: React.FC<PromoCodeInputProps> = ({
  promoCode,
  onPromoCodeChange,
  onApplyPromoCode,
  isLoading = false,
  appliedMessage = null,
}) => {
  return (
    <div className="mb-6">
      <label htmlFor="promo-code" className="block text-lg font-semibold text-gray-800 mb-3">Promo Code (Optional)</label>
      <div className="flex items-stretch gap-2">
        <div className="relative flex-grow">
          <Input
            id="promo-code"
            type="text"
            placeholder="Enter code"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value.toUpperCase())}
            className="pl-4 pr-3 py-2.5 h-11 bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-60"
            disabled={isLoading}
          />
          {/* Icon can be inside or outside */}
        </div>
        <Button
          type="button" // Ensure it's not submit
          onClick={onApplyPromoCode}
          disabled={isLoading || !promoCode}
          className="px-5 py-2.5 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Apply'
          )}
        </Button>
      </div>
      {appliedMessage && (
        <p className={`mt-2 text-sm ${appliedMessage.includes('Error') || appliedMessage.includes('Invalid') ? 'text-red-600' : 'text-green-600'}`}>
          {appliedMessage}
        </p>
      )}
    </div>
  );
};

export default PromoCodeInput; 