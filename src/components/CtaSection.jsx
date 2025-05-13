// src/components/CtaSection.jsx
'use client';

import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon, RocketLaunchIcon, ShieldCheckIcon, BoltIcon } from '@heroicons/react/24/outline';

// Optimized MemoizedIcon component to prevent re-renders
const MemoizedIcon = memo(({ Icon, className }) => <Icon className={className} />);
MemoizedIcon.displayName = 'MemoizedIcon';

// Performance-optimized feature item component
const FeatureItem = memo(({ icon: Icon, text }) => (
  <div className="flex items-center space-x-2">
    <div className="flex-shrink-0 rounded-full bg-indigo-50 p-1.5">
      <Icon className="h-4 w-4 text-indigo-600" />
    </div>
    <span className="text-sm text-gray-600">{text}</span>
  </div>
));
FeatureItem.displayName = 'FeatureItem';

// Optimized CTA button component
const CtaButton = memo(({ href, children, className = "" }) => (
  <Link 
    href={href} 
    className={`inline-flex items-center justify-center gap-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white
    bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
    shadow-md hover:shadow-lg transform transition-all duration-200 ease-out ${className}`}
  >
    {children}
  </Link>
));
CtaButton.displayName = 'CtaButton';

// Main CtaSection component with performance optimizations
const CtaSection = () => {
  // Memoize content to prevent re-creation on renders
  const features = useMemo(() => [
    { icon: RocketLaunchIcon, text: "Instant Activation" },
    { icon: ShieldCheckIcon, text: "99.9% Uptime Guarantee" },
    { icon: BoltIcon, text: "High-Performance Servers" }
  ], []);
  
  // Simplified animation variants for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="relative bg-white overflow-hidden border-t border-gray-100">      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white opacity-50 pointer-events-none"></div>
      
      {/* Compact content container */}
      <div className="container mx-auto px-4 py-10 relative z-10">
        <motion.div
          className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            {/* Left gradient accent */}
            <div className="hidden md:block md:col-span-1 h-full w-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
            
            {/* Content area */}
            <div className="p-6 md:p-8 md:col-span-11">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-5 md:space-y-0 md:space-x-8">
                {/* Text content */}
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                    Ready to elevate your digital experience?
                  </h2>
                  
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {features.map((feature, index) => (
                      <FeatureItem 
                        key={index}
                        icon={feature.icon}
                        text={feature.text}
                      />
                    ))}
                  </div>
                </div>
                
                {/* CTA button */}
                <div className="flex-shrink-0">
                  <CtaButton href="/pricing" className="w-full md:w-auto">
                    Get Started
                    <ArrowRightIcon className="h-4 w-4" />
                  </CtaButton>
                  <p className="mt-2 text-xs text-center text-gray-500">No credit card required</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(CtaSection);