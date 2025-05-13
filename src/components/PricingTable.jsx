// src/components/PricingTable.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CpuChipIcon, ServerIcon as RamIcon, CircleStackIcon, WifiIcon, CheckBadgeIcon, ArrowRightIcon, StarIcon, FireIcon, SparklesIcon as SparklesSolid
} from '@heroicons/react/24/solid';
import { FaWindows } from 'react-icons/fa';

// --- Helper Functions (Validated JSX compatible) ---
const getLabelInfoInternal = (label) => {
    const lowerLabel = label?.toLowerCase();
    // Enhanced styles for labels
    switch (lowerLabel) {
        case 'recommended': return { text: 'Recommended', styles: 'bg-emerald-500 text-white border-emerald-600 shadow-sm', icon: StarIcon, theme: 'green', highlightRow: 'bg-emerald-50/50' };
        case 'most selling': return { text: 'Most Selling', styles: 'bg-orange-500 text-white border-orange-600 shadow-sm', icon: FireIcon, theme: 'orange', highlightRow: 'bg-amber-50/50' };
        case 'high end': return { text: 'High End', styles: 'bg-sky-500 text-white border-sky-600 shadow-sm', icon: SparklesSolid, theme: 'sky', highlightRow: 'bg-sky-50/50' };
        default: return null;
    }
};
const getButtonClassesInternal = (label) => {
    const labelInfo = getLabelInfoInternal(label);
    const theme = labelInfo?.theme;
     // Bolder, slightly larger button
     const baseClasses = 'inline-flex items-center justify-center gap-x-1.5 px-5 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-[1.04] hover:-translate-y-0.5 transition-all duration-250 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
     switch (theme) {
        case 'green': return `${baseClasses} text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 focus:ring-emerald-500`;
        case 'orange': return `${baseClasses} text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:ring-orange-500`;
        case 'sky': return `${baseClasses} text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 focus:ring-sky-500`;
        default: return `${baseClasses} text-white bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-black focus:ring-gray-500`;
    }
};
const formatCurrency = (amount) => `Rs. ${amount.toLocaleString('en-PK')}`;
const OsIcon = FaWindows;
const osIconColor = 'text-blue-600';
const getProfessionalName = (name) => name.replace(/^(RDP|VPS)\s*/i, '').replace(/\s*PK$/i, '').replace(/linux/i, 'Win').trim();
// --- End Helper Functions ---

// --- Animation Variants ---
const tableVariant = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }; // Slightly faster stagger
const rowVariant = {
    hidden: { opacity: 0, y: 20 }, // Start lower
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } } // Sine easing
};

const PricingTable = ({ plans, planType = 'RDP' }) => {

    if (!plans || plans.length === 0) {
        return <p className="text-center text-gray-500 py-10">No {planType} plans defined yet.</p>;
    }
    const osDisplayName = planType === 'VPS' ? 'Windows 10/Server' : 'Windows Server 2022';

    return (
        // Scroll container
        <div className="overflow-x-auto relative scrollbar-thin scrollbar-thumb-gray-400/60 scrollbar-track-gray-100 scrollbar-thumb-rounded-full pb-5 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <motion.table
                className="min-w-full border-collapse rounded-xl shadow-xl bg-white overflow-hidden border border-gray-200/50" // More prominent shadow/border
                variants={tableVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {/* "Heavy Duty" Header */}
                <thead className="bg-gradient-to-b from-gray-800 to-gray-900 text-white sticky top-0 z-10 ">
                   {/* NO WHITESPACE */}
                   <tr>
                        {/* NO WHITESPACE */}
                        <th scope="col" className="sticky left-0 bg-gray-800 px-5 py-4 text-left text-xs font-bold uppercase tracking-wider w-44 lg:w-auto z-20 border-b border-gray-700">Plan</th>
                        <th scope="col" className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center border-b border-gray-700">CPU</th>
                        <th scope="col" className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center border-b border-gray-700">RAM</th>
                        <th scope="col" className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center border-b border-gray-700">Storage</th>
                        <th scope="col" className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center border-b border-gray-700">Bandwidth</th>
                        <th scope="col" className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider border-b border-gray-700">OS</th>
                        <th scope="col" className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider min-w-[180px] border-b border-gray-700">Good For</th>
                        <th scope="col" className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center border-b border-gray-700">Price/Month</th>
                        <th scope="col" className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center min-w-[110px] border-b border-gray-700">Action</th>
                        {/* NO WHITESPACE */}
                    </tr>
                    {/* NO WHITESPACE */}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200/90">
                     {/* NO WHITESPACE */}
                    {plans.map((plan, index) => {
                        if (!plan?.id) return null;
                        const labelInfo = getLabelInfoInternal(plan.label);
                        const buttonClasses = getButtonClassesInternal(plan.label);
                        const professionalName = getProfessionalName(plan.name);
                        // Alternating row colors + highlight for labeled plans
                        const baseRowBg = index % 2 === 0 ? 'bg-white' : 'bg-gray-50/70';
                        const rowBgClass = labelInfo?.highlightRow ? labelInfo.highlightRow : baseRowBg;

                        return (
                            <motion.tr key={plan.id} variants={rowVariant} className={`group hover:bg-sky-50/40 transition-colors duration-150 ${rowBgClass}`}>
                                 {/* NO WHITESPACE */}
                                <td className={`sticky left-0 px-5 py-4 whitespace-nowrap text-sm font-semibold font-heading text-gray-900 z-10 ${rowBgClass || 'bg-white group-hover:bg-sky-50/40 transition-colors duration-150'}`}> {/* Sticky BG matches row */}
                                    {professionalName}
                                    {labelInfo && (
                                        <span className={`ml-1.5 relative -top-px inline-block px-2 py-0.5 rounded text-[10px] font-bold border ring-1 ring-inset ${labelInfo.styles}`}>
                                             <labelInfo.icon className="h-3 w-3 inline-block mr-0.5 relative -top-px" /> {labelInfo.text}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{plan.cpu}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{plan.ram}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{plan.storage}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{plan.bandwidth}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <div className='flex items-center gap-1.5'>
                                        <OsIcon title={osDisplayName} className={`flex-shrink-0 h-4 w-4 ${osIconColor}`} />
                                        <span>{osDisplayName}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-xs text-gray-500 leading-relaxed max-w-[180px]">
                                    {plan.useCases?.join(', ') || '-'}
                                </td>
                                {/* Price - Enhanced */}
                                <td className="px-4 py-4 whitespace-nowrap text-base text-gray-900 font-extrabold font-heading text-center">
                                    {/* Bolder Price */}
                                    <span className="text-xl lg:text-2xl">{formatCurrency(plan.price)}</span>
                                    <span className="text-xs text-gray-500 font-medium">/mo</span>
                                </td>
                                {/* Action Button */}
                                <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link href={`/order/${plan.id}`} className={`${buttonClasses} w-full justify-center sm:w-auto`}>
                                            Order Now <ArrowRightIcon className="h-3.5 w-3.5 ml-1"/>
                                        </Link>
                                    </motion.div>
                                </td>
                                 {/* NO WHITESPACE */}
                            </motion.tr>
                        );
                    })}
                     {/* NO WHITESPACE */}
                </tbody>
            {/* Correct Closing Tag */}
            </motion.table>
        </div>
    );
};

export default PricingTable;