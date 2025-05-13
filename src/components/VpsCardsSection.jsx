// src/components/VpsCardsSection.jsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { vpsPlans } from '@/data/plans';
import { ServerStackIcon } from '@heroicons/react/24/outline';

// --- Animation Variants DEFINED HERE ---
const containerStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } }};
const sectionVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};
const itemVariant = { // For individual items like titles, paragraphs
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};
const cardGridVariant = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
};

// --- Animated Background Shape Component ---
const AnimatedBgShape = ({ className, animateProps, transitionProps }) => (
     <motion.div 
        suppressHydrationWarning
        className={`absolute -z-10 rounded-full filter blur-3xl ${className}`} 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, ...animateProps }} 
        transition={{ duration: 25, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', ...transitionProps }}
     />
);

export default function VpsCardsSection({ showTitle = true }) {
  const [isClient, setIsClient] = React.useState(false);
  const [plansLoaded, setPlansLoaded] = React.useState(false);
  
  // Only run animations after hydration is complete
  React.useEffect(() => {
    setIsClient(true);
    
    // Check if vpsPlans is available and set state
    if (Array.isArray(vpsPlans) && vpsPlans.length > 0) {
      setPlansLoaded(true);
    } else {
      console.error("[VpsCardsSection] VPS plans data is not available or empty");
    }
  }, []);

  return (
    <div className="bg-white font-sans relative isolate overflow-hidden">
      {/* Animated Background Elements - Only render on client */}
      {isClient && (
        <>
          <AnimatedBgShape className="bg-green-300/10 w-96 h-96 top-[-5rem] right-[-10rem]" animateProps={{ x: [-20, 20, -20], opacity: [0.1, 0.15, 0.1] }} transitionProps={{ delay: 1, duration: 22 }}/>
          <AnimatedBgShape className="bg-sky-300/10 w-[40rem] h-[40rem] bottom-[-10rem] left-[-15rem]" animateProps={{ x: [30, -30, 30], opacity: [0.15, 0.25, 0.15] }} transitionProps={{ delay: 6, duration: 26 }}/>
        </>
      )}

      {/* Page Header - Only show if showTitle is true */}
      {showTitle && (
        <motion.div
          className="relative z-10 bg-gradient-to-b from-slate-100/80 via-white/70 to-transparent pt-24 pb-16 sm:pt-32 sm:pb-20 text-center backdrop-blur-sm"
          initial="hidden" 
          animate={isClient ? "visible" : "hidden"}
          variants={containerStagger}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={itemVariant} className="mb-4">
              <motion.div
                animate={{ y: [0, -5, 0], scale: [1, 1.04, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
              >
                <ServerStackIcon className="h-12 w-12 mx-auto text-green-600 opacity-90 drop-shadow-lg"/>
              </motion.div>
            </motion.div>
            <motion.h2 variants={itemVariant} className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              High-Performance VPS Plans
            </motion.h2>
            <motion.p variants={itemVariant} className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-slate-600">
              Scalable Linux & Windows Virtual Private Servers for demanding applications.
            </motion.p>
          </div>
        </motion.div>
      )}

      {/* VPS Plans Grid Section */}
      <div className="relative z-10 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={cardGridVariant} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.1 }}
          >
            {isClient && Array.isArray(vpsPlans) && vpsPlans.length > 0 ? (
              vpsPlans.map((plan, index) => {
                if (!plan?.id) { 
                  console.error(`[VpsCardsSection] Invalid plan data at index ${index}.`); 
                  return <div key={`error-${index}`} className="p-4 border border-red-500 bg-red-50 rounded-lg text-red-700 text-sm h-full">Invalid plan data</div>; 
                }
                
                // Determine OS without using getOsInfo function
                const osInfo = plan.os || (plan.id.toLowerCase().includes('win') ? 'Windows Server' : 'Linux');
                
                return (
                  <ProductCard key={plan.id} plan={{ ...plan, os: osInfo }} />
                );
              })
            ) : (
              <>
                {isClient && !plansLoaded && (
                  <p className="text-red-500 col-span-full text-center py-10">Could not load VPS plans. Please check your data source.</p>
                )}
                {!isClient && (
                  <div className="col-span-full flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}