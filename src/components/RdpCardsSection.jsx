// src/components/RdpCardsSection.jsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductCard from './ProductCard'; // Uses the light green card
import { rdpPlans } from '@/data/plans'; // Removed getOsInfo to fix the error
import { WindowIcon } from '@heroicons/react/24/outline'; // Using Outline icon

// --- Animation Variants DEFINED HERE ---
const sectionVariant = { // For the overall section stagger control (applies to direct motion children)
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};
const itemVariant = { // For individual items like titles, paragraphs
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};
const cardGridVariant = { // For the grid container itself, staggering the cards within
    hidden: {}, // Can be empty if container doesn't animate itself
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } // Controls card stagger
};
// --- End Animation Variants ---

// --- Animated Background Shape Component --- (Keep definition)
const AnimatedBgShape = ({ className, animateProps, transitionProps }) => (
     <motion.div 
        suppressHydrationWarning
        className={`absolute -z-10 rounded-full filter blur-3xl ${className}`} 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, ...animateProps }} 
        transition={{ duration: 25, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', ...transitionProps }}
     />
);
// --- End Component Definition ---


// --- Component Definition ---
// Update RdpCardsSection to handle the showTitle prop
export default function RdpCardsSection({ showTitle = true }) {
  const [isClient, setIsClient] = React.useState(false);
  
  // Only run animations after hydration is complete
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="bg-white font-sans relative isolate overflow-hidden">
        {/* Animated Background Elements */}
        {isClient && (
          <>
            <AnimatedBgShape className="bg-orange-300/10 w-96 h-96 top-[-5rem] left-[-10rem]" animateProps={{ x: [-20, 20, -20], opacity: [0.1, 0.15, 0.1] }} transitionProps={{ delay: 0, duration: 20 }}/>
            <AnimatedBgShape className="bg-sky-300/10 w-[40rem] h-[40rem] top-[15%] right-[-15rem]" animateProps={{ x: [30, -30, 30], opacity: [0.15, 0.25, 0.15] }} transitionProps={{ delay: 5, duration: 28 }}/>
          </>
        )}

        {/* Section content */}
        <section className="relative z-10 py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
               {/* Section Header - Conditionally Rendered */}
               {showTitle && (
                   <motion.div
                     className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
                     // Use sectionVariant here for staggering children h2 and p
                     variants={sectionVariant}
                     initial="hidden"
                     whileInView="visible"
                     viewport={{ once: true, amount: 0.3 }}
                   >
                      <motion.h2 variants={itemVariant} className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">Choose Your RDP Plan</motion.h2>
                      <motion.p variants={itemVariant} className="mt-4 text-lg text-slate-600">Powerful Windows Remote Desktop plans.</motion.p>
                  </motion.div>
               )}

               {/* RDP Cards Grid */}
               <motion.div
                  className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  // Use cardGridVariant to stagger the ProductCard components inside
                  variants={cardGridVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.05 }}
               >
                  {/* Map over all 8 RDP Plans */}
                  {isClient && Array.isArray(rdpPlans) && rdpPlans.length > 0 ? (
                       rdpPlans.map((plan, index) => {
                          if (!plan?.id) { 
                            console.error(`[RdpCardsSection] Invalid plan data at index ${index}.`); 
                            return <div key={`error-${index}`} className="p-4 border border-red-500 bg-red-50 rounded-lg text-red-700 text-sm h-full">Invalid plan data</div>; 
                          }
                          // ProductCard has its own internal 'cardVariant' for its entrance
                          return ( <ProductCard key={plan.id} plan={{ ...plan, os: 'Windows Server' }} /> );
                      })
                  ) : (
                    <>
                      {isClient && (
                        <p className="text-red-500 col-span-full text-center py-10">Could not load RDP plans.</p>
                      )}
                      {!isClient && (
                        <div className="col-span-full flex justify-center py-10">
                          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </>
                  )}
               </motion.div>

               {/* Optional Link below grid */}
               {showTitle && (
                 <div className="mt-16 text-center">
                      <Link href="/rdp" className="inline-flex items-center px-4 py-2 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors shadow-lg hover:shadow-orange-500/20">
                           <WindowIcon className="h-5 w-5 mr-2" />
                           View All RDP Plans
                      </Link>
                  </div>
                )}
            </div>
        </section>
    </div>
  );
}