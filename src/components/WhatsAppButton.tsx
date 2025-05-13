// src/components/WhatsAppButton.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon

const WhatsAppButton = () => {
    // Ensure this link is correct
    const whatsappLink = "https://wa.link/ty3ydp";
    const [showMessage, setShowMessage] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex items-end gap-3">
            {/* Message bubble that appears on hover */}
            <AnimatePresence>
                {showMessage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 max-w-[200px] mr-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 pointer-events-none"
                        style={{ 
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            transformOrigin: 'bottom right'
                        }}
                    >
                        <div className="relative">
                            <div className="mb-1 font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                                Need help?
                            </div>
                            <p>Chat with us on WhatsApp for instant support</p>
                            {/* Triangle pointer */}
                            <div className="absolute bottom-[-16px] right-2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-white dark:border-gray-800 border-r-[8px] border-r-transparent"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Main button with pulse effect */}
            <div className="relative">
                {/* Pulse animation */}
                <div className="absolute inset-0 rounded-full animate-ping bg-green-500 opacity-30"></div>
                <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-r from-green-500 to-emerald-600 opacity-70 blur-sm"></div>
                
                <motion.a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    title="Chat on WhatsApp"
                    onMouseEnter={() => setShowMessage(true)}
                    onMouseLeave={() => setShowMessage(false)}
                    // Animation
                    initial={{ scale: 0, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.5 }}
                    whileHover={{ 
                        scale: 1.1, 
                        transition: { type: 'spring', stiffness: 300 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    // Styling with enhanced appearance
                    className="relative block p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_25px_rgba(0,170,0,0.3)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green-500 z-10"
                >
                    {/* Icon with larger size */}
                    <FaWhatsapp className="h-7 w-7 sm:h-8 sm:w-8" />
                    
                    {/* Badge showing "online" status */}
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-300 border-2 border-white rounded-full"></span>
                </motion.a>
            </div>
        </div>
    );
};

export default WhatsAppButton;