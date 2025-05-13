'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft, ArrowRight, Info, UserCheck, UserPlus, CreditCard, ShieldCheck, CheckCircle } from 'lucide-react'; // Example icons

// Providers & Hooks
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from "@/components/ui/use-toast"; // Use standard shadcn hook

// Components
import LocationSelector, { locations as serverLocations } from '@/components/order/LocationSelector';
import PromoCodeInput from '@/components/order/PromoCodeInput';
import StepIndicator from '@/components/order/StepIndicator';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import UserDisplay from '@/components/auth/UserDisplay';
import PaymentMethodSelector from '@/components/order/PaymentMethodSelector';
import PaymentProofUpload from '@/components/order/PaymentProofUpload';
import ReviewSummary from '@/components/order/ReviewSummary'; // Import ReviewSummary
import HowToOrderGuide from '@/components/order/HowToOrderGuide'; // Import the static guide
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Assuming Card component for structure

// Define the Plan interface based on your plans.js structure
interface Plan {
  id: string;
  name: string;
  cpu: string;
  ram: string;
  storage: string;
  price: number;
  bandwidth: string;
  os: string;
  useCases: string[];
  orderLink: string;
  themeColor: string;
  label: string | null;
  // Add any other fields from your plans.js if necessary
}

// Define types for order steps if you want strong typing for steps
type OrderStepId = 'configure' | 'account' | 'payment' | 'review';

interface StepConfig {
  id: OrderStepId;
  name: string;
}

const orderSteps: StepConfig[] = [
  { id: 'configure', name: 'Configuration' },
  { id: 'account', name: 'Account Details' },
  { id: 'payment', name: 'Payment Method' },
  { id: 'review', name: 'Review & Confirm' },
];

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast(); // Use toast for notifications
  const planId = params?.planId as string;

  const { user, isAuthenticated, isLoading: isAuthLoading, error: authError } = useAuth();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [planError, setPlanError] = useState<string | null>(null);
  
  const [currentStep, setCurrentStep] = useState<OrderStepId>(orderSteps[0].id);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(serverLocations.length > 0 ? serverLocations[0].id : null);
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeMessage, setPromoCodeMessage] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  const [authFormMode, setAuthFormMode] = useState<'login' | 'register'>('login');

  // Payment Step State
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState<string | null>(null);
  const [paymentProofFilename, setPaymentProofFilename] = useState<string | null>(null);
  const [paymentStepError, setPaymentStepError] = useState<string | null>(null);

  // Submission State
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSubmissionError, setOrderSubmissionError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (planId) {
      const fetchPlanDetails = async () => {
        setIsLoadingPlan(true);
        setPlanError(null);
        try {
          const response = await fetch(`/api/plans/${planId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to fetch plan: ${response.statusText}`);
          }
          const data: Plan = await response.json();
          setPlan(data);
        } catch (err: any) {
          setPlanError(err.message || 'An unexpected error occurred.');
        }
        setIsLoadingPlan(false);
      };
      fetchPlanDetails();
    }
  }, [planId]);

  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const handlePromoCodeChange = (code: string) => {
    setPromoCode(code);
    if (promoCodeMessage) setPromoCodeMessage(null); // Clear message on new input
    if (promoDiscount > 0) setPromoDiscount(0); // Clear discount if code changes
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    setPromoCodeMessage(null);
    // Simulate API call for promo code validation
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    // Replace with actual API call: POST /api/promo/validate { code: promoCode, planId: plan?.id }
    // For now, let's assume a dummy validation
    if (promoCode === 'HEAVYDUTY10') {
      setPromoCodeMessage('Promo code HEAVYDUTY10 applied! 10% discount.');
      setPromoDiscount(plan ? plan.price * 0.10 : 0); // Example 10% discount
    } else if (promoCode === 'INVALID5'){
      setPromoCodeMessage('Error: Invalid or expired promo code.');
      setPromoDiscount(0);
    } else {
      setPromoCodeMessage('Validating...'); // Should be handled by actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      setPromoCodeMessage('Info: Promo code not recognized for this plan.');
      setPromoDiscount(0);
    }
    setIsApplyingPromo(false);
  };
  
  const currentStepIndex = orderSteps.findIndex(s => s.id === currentStep);

  const goToNextStep = () => {
    let canProceed = true;
    // Add validation checks for the current step before proceeding
    if (currentStep === 'payment') {
        if (!isAuthenticated) {
            setPaymentStepError("Please log in or register first.");
            setCurrentStep('account'); 
            canProceed = false;
        }
        else if (!selectedPaymentMethodId) {
            setPaymentStepError("Please select a payment method.");
            canProceed = false;
        }
        else if (!paymentProofUrl) {
            setPaymentStepError("Please upload your payment proof.");
            canProceed = false;
        }
        if (canProceed) setPaymentStepError(null);
    }
    
    if (canProceed && currentStepIndex < orderSteps.length - 1) {
      setCurrentStep(orderSteps[currentStepIndex + 1].id);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(orderSteps[currentStepIndex - 1].id);
    }
  };

  const calculatedTotal = plan ? plan.price - promoDiscount : 0;

  // Render loading/error/not found states
  if (!params || !planId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }
  if (isLoadingPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700 p-8">
        <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mb-4" />
        <p className="text-xl font-medium">Loading plan details...</p>
      </div>
    );
  }
  if (planError) { 
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-8">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-xl font-semibold">Error Loading Plan</p>
        <p className="text-center mt-1">{planError}</p>
        <Button variant="outline" className="mt-6" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }
  if (!plan) { 
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 text-yellow-700 p-8">
        <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
        <p className="text-xl font-semibold">Plan Not Found</p>
        <p className="text-center mt-1">The plan ID specified does not exist.</p>
         <Button variant="outline" className="mt-6" onClick={() => router.push('/pricing')}>View Plans</Button>
      </div>
    );
  }

  const selectedLocationDetails = serverLocations.find(loc => loc.id === selectedLocation);

  // Function to handle successful login/registration for the order page
  const handleAuthSuccess = () => {
    // If user logs in/registers successfully on the account page, move them to payment
    if (currentStep === 'account') {
        goToNextStep();
    }
  }

  // Payment Step Handlers
  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethodId(methodId);
    setPaymentStepError(null); // Clear error when method changes
  };

  const handleProofUploadSuccess = (url: string, name: string) => {
    setPaymentProofUrl(url);
    setPaymentProofFilename(name);
    setPaymentStepError(null); // Clear error on successful upload
  };

  const handleProofUploadError = (errorMessage: string) => {
    setPaymentStepError(`Upload Error: ${errorMessage}`);
    setPaymentProofUrl(null); // Clear proof URL on error
    setPaymentProofFilename(null);
  };

  // Order Submission Handler
  const handlePlaceOrder = async () => {
      if (!isAuthenticated || !user || !plan || !selectedLocation || !selectedPaymentMethodId || !paymentProofUrl) {
          setOrderSubmissionError("Missing required information to place order. Please review all steps.");
          // Attempt to navigate back to the first step with missing info (optional)
          if (!isAuthenticated || !user) setCurrentStep('account');
          else if (!selectedPaymentMethodId || !paymentProofUrl) setCurrentStep('payment');
          else if (!selectedLocation) setCurrentStep('configure');
          return;
      }

      setIsSubmittingOrder(true);
      setOrderSubmissionError(null);
      setIsRedirecting(false);

      const orderData = {
          planId: plan.id,
          planName: plan.name,
          location: selectedLocation, // Assuming location ID is sufficient
          paymentMethod: selectedPaymentMethodId,
          paymentProofUrl: paymentProofUrl,
          subtotal: plan.price,
          total: calculatedTotal,
          // Add quantity, duration if implemented
      };

      try {
          const response = await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(orderData)
          });

          const result = await response.json();

          if (!response.ok) {
              throw new Error(result.error || 'Failed to place order.');
          }

          // Order placed successfully!
          toast({ 
              title: "Order Placed!", 
              description: `Order #${result.order?.orderId} received. Verifying payment...`,
              variant: "default",
              duration: 4000 // Give slightly longer for first toast
          });
          
          setIsRedirecting(true);

          // Redirect to dashboard after a delay
          setTimeout(() => {
              router.push('/dashboard/orders'); 
          }, 3000); // Adjust delay as needed
          
      } catch (err: any) {
          console.error("Order submission failed:", err);
          setOrderSubmissionError(err.message || "An unexpected error occurred while placing your order.");
          toast({ title: "Order Failed", description: err.message || "Could not place order.", variant: "destructive" });
          setIsSubmittingOrder(false);
          setIsRedirecting(false);
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 text-gray-900 p-4 md:p-8 lg:p-12 selection:bg-indigo-100">
      <div className="max-w-7xl mx-auto">
         
         {/* Conditionally render Redirecting message or Order Steps */}
         {isRedirecting ? (
             <div className="flex flex-col items-center justify-center text-center py-20 md:py-32">
                 <CheckCircle size={64} className="text-green-500 mb-6 animate-pulse" />
                 <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Order Placed Successfully!</h1>
                 <p className="text-lg text-gray-600 mb-8">Your order is being processed. Please wait while we redirect you to your dashboard...</p>
                 <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
             </div>
         ) : (
            <> { /* Original Order Page Content */ }
                 <header className="mb-8 md:mb-12 text-center">
                    {/* <div className="absolute top-0 right-0"> <HowToOrderModal /> </div> */}
                    {/* Rest of header */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                        Order: <span className="text-indigo-600">{plan.name}</span>
                    </h1>
                     <p className="text-md md:text-lg text-gray-600 mt-3 max-w-2xl mx-auto">Complete the steps below to configure and place your order.</p>
                 </header>

                 <StepIndicator steps={orderSteps} currentStepId={currentStep} />

                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
                    {/* Main Content Area (Steps) */}
                    <main className="lg:col-span-7 xl:col-span-8 space-y-8">
                         {/* --- Step 1: Configuration --- */}
                         {currentStep === 'configure' && (
                           <Card className="shadow-lg border-gray-200">
                             <CardHeader>
                               <CardTitle className="text-2xl flex items-center gap-2"><Info size={24} className="text-indigo-500"/> Configuration</CardTitle>
                               <CardDescription>Select your server location and apply any promo codes.</CardDescription>
                             </CardHeader>
                             <CardContent className="space-y-6">
                                <LocationSelector selectedLocation={selectedLocation} onLocationChange={handleLocationChange} />
                                <PromoCodeInput 
                                    promoCode={promoCode} 
                                    onPromoCodeChange={handlePromoCodeChange} 
                                    onApplyPromoCode={handleApplyPromoCode}
                                    isLoading={isApplyingPromo}
                                    appliedMessage={promoCodeMessage}
                                />
                             </CardContent>
                           </Card>
                         )}

                         {/* --- Step 2: Account --- */}
                         {currentStep === 'account' && (
                            <Card className="shadow-lg border-gray-200">
                             <CardHeader>
                               <CardTitle className="text-2xl flex items-center gap-2"><UserCheck size={24} className="text-indigo-500"/> Account Details</CardTitle>
                               <CardDescription>Log in or create an account to associate this order.</CardDescription>
                             </CardHeader>
                             <CardContent>
                                {isAuthenticated ? (
                                     // If user is authenticated, show their info
                                    <UserDisplay />
                                ) : (
                                   // If user is NOT authenticated, always show login/register options
                                   // The initial page load spinner handles the very first auth check.
                                   // Loading during login/register attempts is handled within the forms.
                                   <div className="space-y-4">
                                      <div className="flex border-b border-gray-200">
                                         {/* Login/Register Tabs/Buttons */}
                                        <button 
                                          onClick={() => setAuthFormMode('login')} 
                                          className={`py-3 px-5 font-semibold transition-all 
                                            ${authFormMode === 'login' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-800 hover:border-b-2 hover:border-gray-300'}`}
                                        >
                                          Log In
                                        </button>
                                        <button 
                                          onClick={() => setAuthFormMode('register')} 
                                          className={`py-3 px-5 font-semibold transition-all 
                                            ${authFormMode === 'register' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-800 hover:border-b-2 hover:border-gray-300'}`}
                                        >
                                          Create Account
                                        </button>
                                      </div>
                                      <div className="pt-4">
                                        {authFormMode === 'login' ? 
                                            <LoginForm onLoginSuccess={handleAuthSuccess} /> : 
                                            <RegisterForm onRegisterSuccess={handleAuthSuccess} />
                                        }
                                       </div>
                                    </div>
                                )}
                             </CardContent>
                           </Card>
                         )}
                         
                        {/* --- Step 3: Payment --- */}
                        {currentStep === 'payment' && (
                            <Card className="shadow-lg border-gray-200">
                             <CardHeader>
                               <CardTitle className="text-2xl flex items-center gap-2"><CreditCard size={24} className="text-indigo-500"/> Payment Information</CardTitle>
                               <CardDescription>Select a manual payment method and upload your proof of transaction.</CardDescription>
                             </CardHeader>
                             <CardContent>
                                 {!isAuthenticated ? (
                                    <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-md flex items-center space-x-3 mb-6">
                                        <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0"/>
                                        <div className="flex-grow">
                                            <p className="text-yellow-800 font-medium">Authentication Required</p>
                                            <p className="text-sm text-yellow-700">Please log in or create an account first.</p>
                                        </div>
                                         <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-100" onClick={() => setCurrentStep('account')}>
                                            Go to Account
                                        </Button>
                                    </div>
                                 ) : (
                                    <div className="space-y-6">
                                      <PaymentMethodSelector 
                                        selectedMethodId={selectedPaymentMethodId} 
                                        onMethodSelect={handlePaymentMethodSelect} 
                                      />
                                      <PaymentProofUpload 
                                        onUploadSuccess={handleProofUploadSuccess} 
                                        onUploadError={handleProofUploadError}
                                      />
                                      {paymentStepError && (
                                        <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded-md flex items-start space-x-2 text-red-700">
                                            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm font-medium">{paymentStepError}</p>
                                        </div>
                                      )}
                                    </div>
                                 )}
                              </CardContent>
                           </Card>
                        )}

                        {/* --- Step 4: Review --- */}
                        {currentStep === 'review' && (
                            <Card className="shadow-lg border-gray-200">
                             <CardHeader>
                               <CardTitle className="text-2xl flex items-center gap-2"><ShieldCheck size={24} className="text-indigo-500"/> Review & Confirm Order</CardTitle>
                               <CardDescription>Please review all your order details carefully before placing the order.</CardDescription>
                             </CardHeader>
                             <CardContent>
                                {/* Add checks similar to payment step, but render ReviewSummary if all good */} 
                                {!isAuthenticated ? (
                                    <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-md flex items-center space-x-3 mb-6">
                                       {/* ... Auth required message ... */} 
                                       <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0"/>
                                        <div className="flex-grow">
                                            <p className="text-yellow-800 font-medium">Authentication Required</p>
                                            <p className="text-sm text-yellow-700">Log in to review your order.</p>
                                        </div>
                                         <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-100" onClick={() => setCurrentStep('account')}>
                                            Go to Account
                                        </Button>
                                    </div>
                                ) : !paymentProofUrl || !selectedPaymentMethodId || !selectedLocation ? (
                                    <div className="p-4 bg-orange-50 border border-orange-300 rounded-md flex items-center space-x-3 mb-6">
                                      {/* ... Missing info message ... */} 
                                      <AlertCircle className="h-6 w-6 text-orange-500 flex-shrink-0"/>
                                        <div className="flex-grow">
                                            <p className="text-orange-800 font-medium">Order Incomplete</p>
                                            <p className="text-sm text-orange-700">Please ensure all previous steps are completed.</p>
                                        </div>
                                         <Button size="sm" variant="outline" className="border-orange-600 text-orange-700 hover:bg-orange-100" onClick={() => setCurrentStep('payment')}>
                                            Go Back
                                        </Button>
                                    </div>
                                ) : (
                                   <ReviewSummary 
                                        plan={plan} 
                                        location={selectedLocationDetails || null}
                                        userEmail={user?.email}
                                        paymentMethodId={selectedPaymentMethodId}
                                        paymentProofFilename={paymentProofFilename}
                                        promoCode={promoDiscount > 0 ? promoCode : null}
                                        basePrice={plan.price}
                                        discount={promoDiscount}
                                        totalPrice={calculatedTotal}
                                    />
                                )
                                }
                                {orderSubmissionError && (
                                    <div className="mt-6 p-3 bg-red-50 border border-red-300 rounded-md flex items-start space-x-2 text-red-700">
                                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm font-medium">Error placing order: {orderSubmissionError}</p>
                                    </div>
                                 )}
                              </CardContent>
                           </Card>
                        )}

                        {/* --- Step Navigation --- */}
                        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                            <Button 
                            variant="outline" 
                            onClick={goToPreviousStep} 
                            disabled={currentStepIndex === 0 || isSubmittingOrder}
                            className="disabled:opacity-50"
                            >
                            <ArrowLeft size={18} className="mr-2" /> Previous
                            </Button>
                            {currentStepIndex < orderSteps.length - 1 ? (
                            <Button 
                                onClick={goToNextStep} 
                                disabled={isSubmittingOrder}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                            >
                                Next <ArrowRight size={18} className="ml-2" />
                            </Button>
                            ) : (
                            <Button 
                                onClick={handlePlaceOrder} 
                                className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                                disabled={!isAuthenticated || !paymentProofUrl || !selectedPaymentMethodId || !selectedLocation || isSubmittingOrder || isLoadingPlan || isAuthLoading } 
                            >
                                { isSubmittingOrder ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" /> }
                                { isSubmittingOrder ? 'Placing Order...' : 'Confirm & Place Order' }
                            </Button>
                            )}
                        </div>

                        {/* --- Static How-to Guide --- */}
                        <HowToOrderGuide />
                    </main>

                    {/* --- Order Summary Sidebar --- */}
                    <aside className="lg:col-span-5 xl:col-span-4 h-fit lg:sticky lg:top-8">
                       <Card className="shadow-lg border-gray-200">
                          <CardHeader>
                              <CardTitle className="text-xl">Order Summary</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4 text-sm">
                              {/* Plan details */}
                               <div className="flex justify-between"><span className="text-gray-500">Plan:</span> <span className="font-medium text-right">{plan.name}</span></div>
                               <div className="flex justify-between"><span className="text-gray-500">CPU:</span> <span className="font-medium text-right">{plan.cpu}</span></div>
                               <div className="flex justify-between"><span className="text-gray-500">RAM:</span> <span className="font-medium text-right">{plan.ram}</span></div>
                               <div className="flex justify-between"><span className="text-gray-500">Storage:</span> <span className="font-medium text-right">{plan.storage}</span></div>
                               
                               {/* Location */} 
                               {selectedLocationDetails && (
                                  <div className="flex justify-between">
                                      <span className="text-gray-500">Location:</span>
                                      <span className="font-medium text-right">
                                          {selectedLocationDetails.flag} {selectedLocationDetails.name} {selectedLocationDetails.city ? `(${selectedLocationDetails.city})` : ''}
                                      </span>
                                  </div>
                               )}
                               
                              {/* Payment Info */} 
                              {selectedPaymentMethodId && (
                                  <div className="flex justify-between">
                                      <span className="text-gray-500">Method:</span>
                                      <span className="font-medium capitalize">{selectedPaymentMethodId}</span>
                                  </div>
                              )}
                              {paymentProofFilename && (
                                  <div className="flex justify-between items-center">
                                      <span className="text-gray-500">Proof:</span>
                                      <span className="font-medium text-green-600 text-xs truncate max-w-[120px] sm:max-w-[150px]" title={paymentProofFilename}>{paymentProofFilename}</span>
                                  </div>
                              )}

                              {/* Pricing */} 
                              <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                                  <div className="flex justify-between">
                                      <span className="text-gray-500">Base Price:</span>
                                      <span className="font-medium">{plan.price.toFixed(2)} PKR</span>
                                  </div>
                                  {promoDiscount > 0 && (
                                      <div className="flex justify-between text-green-600">
                                      <span className="text-gray-500">Promo ({promoCode}):</span>
                                      <span className="font-medium">- {promoDiscount.toFixed(2)} PKR</span>
                                      </div>
                                  )}
                                  <div className="flex justify-between text-lg font-bold mt-2 pt-3 border-t border-gray-300">
                                      <span className="text-gray-800">Total:</span>
                                      <span className="text-indigo-700">{calculatedTotal.toFixed(2)} PKR</span>
                                  </div>
                              </div>
                              {/* User Info */} 
                              {user && (
                                  <div className="mt-4 pt-3 border-t border-gray-200">
                                      <p className="text-xs text-gray-500">Order will be placed for: <span className="font-medium text-gray-700">{user.email}</span></p>
                                  </div>
                              )}

                               <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => router.push('/pricing')} 
                                  className="w-full mt-4 text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                                  >
                                  Change Plan
                              </Button>
                          </CardContent>
                       </Card>
                    </aside>
                 </div>
            </> 
         )}
      </div>
    </div>
  );
}
