// src/components/FaqSection.jsx
'use client';

import React, { useState, useCallback } from 'react'; // Import useCallback
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionMarkCircleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// --- Placeholder FAQ Data (REPLACE!) ---
const faqs = [
    { id: 1, question: "What is RDP?", answer: "RDP (Remote Desktop Protocol) allows you to connect to and control another Windows computer remotely, providing a full desktop experience. Ideal for specific apps or secure browsing." },
    { id: 2, question: "RDP vs VPS?", answer: "RDP provides Windows desktop access. A VPS (Virtual Private Server) offers a complete virtual machine (Windows in our case) with admin access for hosting websites, apps, etc." },
    { id: 3, question: "Payment Methods?", answer: "We accept EasyPaisa/JazzCash (via screenshot), Bank Transfer, Wise, Payoneer, and Crypto (BTC/USDT). Details provided at checkout." },
    { id: 4, question: "Setup Time?", answer: "Typically 1-3 hours after payment verification during business hours. Details emailed upon completion." },
    { id: 5, question: "Server Locations?", answer: "Primary datacenter in US,Global locations include USA (Dallas), UK (London), Germany, Singapore, and India." },
    { id: 6, question: "Included Support?", answer: "24/7 support via ticketing system and direct WhatsApp chat with our expert team." },
];
// --- End Placeholder Data ---

// --- Animation Variants ---
const containerStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemFadeIn = { hidden: { opacity: 0, x: -15 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } } };
const answerVariant = {
    hidden: { opacity: 0, y: 10, filter: 'blur(3px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -10, filter: 'blur(3px)', transition: { duration: 0.2, ease: 'easeIn' } }
};

const FaqSection = () => {
  // State to track the index of the selected question
  const [selectedIndex, setSelectedIndex] = useState(0); // Default to showing the first answer

  const selectedFaq = faqs[selectedIndex]; // Get the currently selected FAQ object

  // Memoize handler for stability if passed deeper
  const handleSelect = useCallback((index) => {
      setSelectedIndex(index);
  }, []);

  return (
    // Section styling - integrated background feel
    <section className="py-24 sm:py-32 font-sans relative overflow-hidden isolate bg-gradient-to-b from-gray-50/50 to-white">
       {/* Subtle background decorations */}
       <div className="absolute -top-16 -left-16 w-96 h-96 bg-gradient-radial from-orange-100/50 to-transparent rounded-full filter blur-3xl opacity-60 -z-10"></div>
       <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-gradient-radial from-sky-100/50 to-transparent rounded-full filter blur-3xl opacity-50 -z-10"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
         <motion.div
           className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
           initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerStagger}
         >
            <motion.div variants={itemFadeIn} className="inline-block p-3 bg-gradient-to-r from-orange-100 to-sky-100 rounded-full mb-4 shadow-sm">
                <QuestionMarkCircleIcon className="h-8 w-8 text-orange-600 opacity-90"/>
            </motion.div>
            <motion.h2 variants={itemFadeIn} className="font-heading text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
               Common Questions
            </motion.h2>
            <motion.p variants={itemFadeIn} className="mt-4 text-lg leading-8 text-gray-600">
               Answers to frequently asked questions. Need more help? Contact our support team.
            </motion.p>
         </motion.div>

        {/* FAQ Layout Grid */}
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-10 max-w-6xl mx-auto"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerStagger}
        >
            {/* Column 1: Question List */}
            <div className="md:col-span-1 lg:col-span-1 space-y-2">
                {faqs.map((faq, index) => (
                    <motion.button
                        key={faq.id}
                        variants={itemFadeIn} // Stagger question buttons
                        onClick={() => handleSelect(index)}
                        className={`w-full text-left p-3.5 rounded-lg transition-all duration-200 ease-in-out group flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-1 ${
                            selectedIndex === index
                            ? 'bg-white shadow-md border border-gray-200/80 ring-1 ring-orange-200/70' // Active style
                            : 'bg-white/60 border border-transparent hover:bg-white hover:border-gray-200/80 hover:shadow-sm' // Inactive style
                        }`}
                        aria-selected={selectedIndex === index}
                     >
                        <span className={`text-sm font-semibold ${selectedIndex === index ? 'text-orange-600' : 'text-gray-700'} group-hover:text-orange-600`}>
                            {faq.question}
                        </span>
                         {/* Simple indicator */}
                         <ChevronRightIcon className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-300 ${selectedIndex === index ? 'rotate-90 text-orange-500' : 'group-hover:translate-x-0.5'}`} />
                     </motion.button>
                 ))}
            </div>

            {/* Column 2: Answer Display Area */}
            <div className="md:col-span-2 lg:col-span-3 min-h-[300px] md:min-h-[350px]"> {/* Min height */}
                 {/* Use AnimatePresence to animate answer changes */}
                 <AnimatePresence mode="wait">
                    {/* Render content based on selectedFaq */}
                    {selectedFaq ? (
                        <motion.div
                            key={selectedFaq.id} // Change key triggers animation
                            variants={answerVariant}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white p-6 rounded-lg shadow-lg border border-gray-200/60 h-full" // Style the answer container
                        >
                            <h3 className="font-heading text-lg font-semibold text-gray-800 mb-3">
                                {selectedFaq.question}
                            </h3>
                            <p className="text-base leading-relaxed text-gray-600">
                                {selectedFaq.answer}
                            </p>
                        </motion.div>
                     ) : (
                        // Should not happen if selectedIndex starts at 0, but good fallback
                        <motion.div key="empty" variants={answerVariant} initial="hidden" animate="visible" exit="hidden" className="flex items-center justify-center h-full text-gray-400 italic">
                            Select a question from the left.
                        </motion.div>
                     )}
                 </AnimatePresence>
            </div>
        </motion.div>

         {/* Optional: Link to support page */}
         {/* ... (Keep Contact Support link as before) ... */}

      </div>
    </section>
  );
};

export default FaqSection;