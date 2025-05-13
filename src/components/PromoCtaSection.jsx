// src/components/PromoCtaSection.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon, SparklesIcon, TagIcon } from '@heroicons/react/24/solid'; // Using Solid icons

// Animation Variants
const containerStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const itemFadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const buttonVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.3, type: 'spring', stiffness: 150, damping: 15 } }
};

// Button Style (Matches Hero Section)
const ctaButtonClasses = `inline-flex items-center justify-center gap-x-2 px-8 py-3.5 rounded-full text-base font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-orange-500 shadow-lg hover:shadow-xl hover:shadow-orange-500/40 transform hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 ease-in-out`;

// Floating Shape for background interest (Adjusted for light theme)
const FloatingShape = ({ className, duration, delay, size }) => (
     <motion.div
        className={`absolute rounded-full filter blur-3xl ${className}`} // Opacity set via BG color
        style={{ width: size, height: size }}
        animate={{
            scale: [1, 1.08, 1],
            x: [0, Math.random() * 30 - 15, 0],
            y: [0, Math.random() * 25 - 12, 0],
        }}
        transition={{ duration: duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: delay }}
    />
);

const PromoCtaSection = ({ promoCode = "RDP30", discount = "30%" }) => {
  return (
    // Light background for the section
    <section className="relative font-sans bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50 py-24 sm:py-32 overflow-hidden isolate">
        {/* Animated Background Shapes (Lighter) */}
        <FloatingShape className="bg-orange-200/30 top-[5%] left-[5%] opacity-60" duration={18} delay={0} size="30rem" />
        <FloatingShape className="bg-sky-200/30 bottom-[5%] right-[5%] opacity-50" duration={22} delay={2} size="35rem" />
        <FloatingShape className="bg-green-200/20 top-[30%] right-[15%] opacity-40" duration={20} delay={4} size="25rem" />

         {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]"></div>

      {/* Content Container with max-width for "shorter" feel */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
           className="max-w-4xl mx-auto text-center bg-white/70 backdrop-blur-lg p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-200/60" // Added Card style
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, amount: 0.4 }}
           variants={containerStagger}
        >
            {/* Icon */}
            <motion.div variants={itemFadeInUp} className="mb-5">
                 <SparklesIcon className="h-10 w-10 mx-auto text-orange-500" />
            </motion.div>
            {/* Headline */}
            <motion.h2 variants={itemFadeInUp} className="font-heading text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Ready to Boost Your Project?
            </motion.h2>
            {/* Description */}
            <motion.p variants={itemFadeInUp} className="mt-4 text-base leading-relaxed text-gray-600 max-w-2xl mx-auto"> {/* Slightly smaller text */}
                 Get started with Pakistan's premium RDP & VPS provider today! Claim your <strong className="text-orange-600 font-semibold">{discount} discount</strong> on the first month using code:
            </motion.p>
             {/* Promo Code Display */}
             <motion.div variants={itemFadeInUp} transition={{ delay: 0.1 }} className="mt-6 inline-block bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg px-4 py-1.5 shadow-sm border border-orange-200/80">
                <p className="font-sans text-sm font-medium text-orange-900 flex items-center gap-2">
                    <TagIcon className="h-4 w-4 text-orange-600 inline-block"/>
                    Promo Code: <span className="font-bold text-orange-700 text-base tracking-wider">{promoCode}</span>
                </p>
             </motion.div>

            {/* CTA Button */}
             <motion.div variants={buttonVariant} className="mt-10">
                 <motion.div whileHover={{ scale: 1.03, y:-2 }} whileTap={{ scale: 0.97 }} transition={{type:'spring', stiffness: 300}}>
                     <Link href="/pricing" className={ctaButtonClasses}>
                         {/* Shine effect */}
                         <span className="absolute left-0 top-0 w-full h-full transition-all duration-700 transform -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent ease"></span>
                         <span className="relative z-10">Claim Discount & View Plans</span>
                         <ArrowRightIcon className="relative z-10 h-5 w-5 ml-1.5 transition-transform duration-200 group-hover:translate-x-1"/>
                     </Link>
                 </motion.div>
            </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Helper component definition (keep as before)
// const FloatingShape = ({ ... }) => ( ... );

export default PromoCtaSection;