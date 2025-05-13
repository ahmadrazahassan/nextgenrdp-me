'use client';

import React from 'react';
import {
  PackageCheck,
  MapPin,
  CreditCardIcon,
  FileCheck2,
  UserCircle,
  Hash,
  BadgePercent,
  CircleDollarSign,
} from 'lucide-react';

// Re-use Plan interface if needed, or define specific props
interface PlanDetails {
  name: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  os: string;
}

interface LocationDetails {
    flag: string;
    name: string;
    city?: string;
}

interface ReviewSummaryProps {
  plan: PlanDetails;
  location: LocationDetails | null;
  userEmail: string | undefined;
  paymentMethodId: string | null;
  paymentProofFilename: string | null;
  promoCode: string | null;
  basePrice: number;
  discount: number;
  totalPrice: number;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  plan,
  location,
  userEmail,
  paymentMethodId,
  paymentProofFilename,
  promoCode,
  basePrice,
  discount,
  totalPrice,
}) => {

  const formatPrice = (price: number) => {
    return price.toFixed(2) + ' PKR';
  }

  const getPaymentMethodName = (id: string | null): string => {
      if (id === 'wise') return 'Wise (TransferWise)';
      if (id === 'alliedbank') return 'Allied Bank';
      if (id === 'nayapay') return 'NayaPay';
      return 'Not Selected';
  }

  // Helper component for review items
  const ReviewItem = ({ label, children, icon: Icon }: {label: string, children: React.ReactNode, icon?: React.ElementType}) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-1">
        <dt className="text-sm font-medium text-gray-500 flex items-center">
            {Icon && <Icon size={16} className="mr-2 text-gray-400"/>}
            {label}
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 text-left sm:text-right">{children}</dd>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* Plan Details Card */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
          <PackageCheck className="mr-2 h-5 w-5 text-indigo-600" /> Plan Details
        </h4>
        <dl className="divide-y divide-gray-200">
           <ReviewItem label="Name">{plan.name}</ReviewItem>
           <ReviewItem label="CPU">{plan.cpu}</ReviewItem>
           <ReviewItem label="RAM">{plan.ram}</ReviewItem>
           <ReviewItem label="Storage">{plan.storage}</ReviewItem>
           <ReviewItem label="Bandwidth">{plan.bandwidth}</ReviewItem>
           <ReviewItem label="OS">{plan.os}</ReviewItem>
        </dl>
      </div>

      {/* Configuration Card */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
         <h4 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
           <MapPin className="mr-2 h-5 w-5 text-indigo-600" /> Configuration
         </h4>
         <dl className="divide-y divide-gray-200">
             <ReviewItem label="Location">
                {location ? (
                    <span className="flex items-center justify-end"><span className='mr-2 text-lg'>{location.flag}</span> {location.name} {location.city ? `(${location.city})` : ''}</span>
                ) : (
                    <span className="text-yellow-600">Not selected</span>
                )}
             </ReviewItem>
             <ReviewItem label="Account">
                 <span className="truncate">{userEmail || 'Not logged in'}</span>
             </ReviewItem>
         </dl>
      </div>
      
      {/* Payment Details Card */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
         <h4 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
           <CreditCardIcon className="mr-2 h-5 w-5 text-indigo-600" /> Payment
         </h4>
         <dl className="divide-y divide-gray-200">
             <ReviewItem label="Method">{getPaymentMethodName(paymentMethodId)}</ReviewItem>
             <ReviewItem label="Proof Uploaded">
                {paymentProofFilename ? (
                    <span className="text-green-600 flex items-center justify-end" title={paymentProofFilename}>
                        <FileCheck2 size={16} className="mr-1" /> Yes <span className="text-xs text-gray-500 ml-1 truncate max-w-[100px]">({paymentProofFilename})</span>
                    </span>
                ) : (
                    <span className="text-red-600">No</span>
                )}
            </ReviewItem>
         </dl>
      </div>

      {/* Pricing Summary Card */}
      <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
          <CircleDollarSign className="mr-2 h-5 w-5 text-indigo-600" /> Billing Summary
        </h4>
        <dl className="divide-y divide-gray-200">
           <ReviewItem label="Base Price">{formatPrice(basePrice)}</ReviewItem>
            {promoCode && discount > 0 && (
                <ReviewItem label={`Promo (${promoCode})`} icon={BadgePercent}>
                    <span className="text-green-600">- {formatPrice(discount)}</span>
                </ReviewItem>
            )}
             <div className="pt-4 mt-2">
                <ReviewItem label="Total Amount Due">
                    <span className="text-xl font-bold text-indigo-700">{formatPrice(totalPrice)}</span>
                </ReviewItem>
            </div>
        </dl>
      </div>
      <p className="text-xs text-gray-500 text-center mt-4">Payment is manually verified by admin after order submission.</p>
    </div>
  );
};

export default ReviewSummary; 