// src/components/FeaturesSection.jsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
// Using Solid icons for impact
import {
  BoltIcon, ClockIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon, CpuChipIcon, MapPinIcon
} from '@heroicons/react/24/solid';

// Feature Data (Keep as before)
const features = [
    { name: 'Blazing Fast NVMe', description: 'Experience rapid load times and responsiveness with cutting-edge NVMe SSD storage.', icon: BoltIcon, themeColor: 'orange' },
    { name: '99.9%+ Uptime SLA', description: 'Our reliable infrastructure and Service Level Agreement guarantee your service stays online.', icon: ClockIcon, themeColor: 'sky' },
    { name: '24/7 Expert Support', description: 'Get friendly, professional help from Ahmad Raza & team via ticket or chat, anytime.', icon: ChatBubbleLeftRightIcon, themeColor: 'green' },
    { name: 'Robust Security Shield', description: 'Services protected with firewalls, regular patching, and optional DDoS mitigation.', icon: ShieldCheckIcon, themeColor: 'sky' },
    { name: 'High-Performance CPU', description: 'Powerful processor cores ensure smooth performance even under demanding workloads.', icon: CpuChipIcon, themeColor: 'green' },
    { name: 'High End VPS', description: 'Get Our Best VPS and Do anything you want to do.', icon: MapPinIcon, themeColor: 'orange' },
];

// Animation Variants
const containerStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const itemFadeInUp = {
    hidden: { opacity: 0, y: 25, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] } }
};

// Theme helper - **VALID JAVASCRIPT/JSX - NO TYPESCRIPT**
const getThemeClasses = (themeColor) => { // <<< NO ': string' HERE
    switch(themeColor) {
      case 'orange': return {
          gradient: 'from-orange-500 to-red-500', text: 'text-orange-600', shadow: 'shadow-orange-500/30',
          hoverShadow: 'hover:shadow-orange-500/50', iconBg: 'bg-orange-100', iconText: 'text-orange-700', border: 'group-hover:border-orange-400/50'
        };
      case 'sky': return {
          gradient: 'from-sky-500 to-blue-600', text: 'text-sky-600', shadow: 'shadow-sky-500/30',
          hoverShadow: 'hover:shadow-sky-500/50', iconBg: 'bg-sky-100', iconText: 'text-sky-700', border: 'group-hover:border-sky-400/50'
       };
      case 'green': return {
          gradient: 'from-green-500 to-emerald-600', text: 'text-green-600', shadow: 'shadow-green-500/30',
          hoverShadow: 'hover:shadow-green-500/50', iconBg: 'bg-green-100', iconText: 'text-green-700', border: 'group-hover:border-green-400/50'
      };
      default: return {
          gradient: 'from-gray-500 to-gray-600', text: 'text-gray-600', shadow: 'shadow-gray-500/20',
          hoverShadow: 'hover:shadow-gray-400/30', iconBg: 'bg-gray-100', iconText: 'text-gray-700', border: 'group-hover:border-gray-300'
       };
    }
};

const FeaturesSection = () => {
  return (
    // Section with animated background
    <section className="py-24 sm:py-32 bg-white font-sans relative overflow-hidden isolate">
        {/* Animated Gradient Background */}
         <motion.div
            className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-orange-100/20 via-sky-100/10 to-green-100/20"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 30, ease: 'linear', repeat: Infinity, repeatType: 'mirror' }}
            style={{ backgroundSize: '400% 400%' }}
        />
         {/* Grid pattern overlay */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
           className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
           initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerStagger}
        >
          <motion.h2 variants={itemFadeInUp} className="font-heading text-sm font-semibold leading-7 text-orange-600 uppercase tracking-widest">
            Why Us?
          </motion.h2>
          <motion.p variants={itemFadeInUp} className="mt-2 font-heading text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            The NextGenRDP Advantage
          </motion.p>
          <motion.p variants={itemFadeInUp} className="mt-6 text-lg leading-8 text-gray-600">
            Experience the difference: Speed, Reliability, and Support combined for the ultimate hosting solution.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerStagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => {
             const theme = getThemeClasses(feature.themeColor);
             const IconComponent = feature.icon;
             return (
                // Feature Card - Enhanced Styling & Hover
                <motion.div
                  key={feature.name}
                  variants={itemFadeInUp}
                  whileHover={{ y: -8, scale: 1.025, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
                  className={`group relative flex flex-col p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-transparent overflow-hidden transition-all duration-300 ease-out hover:shadow-xl ${theme.hoverShadow} hover:border-gray-200/60`} // Using shadow for hover primarily
                >
                    {/* Gradient Glow effect on hover */}
                     <motion.div
                        className={`absolute -inset-px rounded-xl bg-gradient-to-r ${theme.gradient} opacity-0 blur-lg group-hover:opacity-25 transition-opacity duration-400 -z-10`}
                        aria-hidden="true"
                    />
                    {/* Inner content area */}
                    <div className="relative z-10 flex flex-col h-full">
                        {/* Icon Area */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.4, type: 'spring', stiffness: 250, damping: 15 }}
                            className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg ${theme.iconBg} shadow-sm ring-1 ring-inset ring-gray-900/5`}
                        >
                           <IconComponent className={`h-6 w-6 ${theme.iconText}`} aria-hidden="true" />
                        </motion.div>
                       {/* Text Content */}
                       <h3 className="font-heading text-lg font-semibold leading-snug text-gray-800 mb-2">
                         {feature.name}
                       </h3>
                       <p className="text-sm leading-relaxed text-gray-600 flex-grow pb-4">
                         {feature.description}
                       </p>
                   </div>
                </motion.div>
             )
           })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection; // Use default export