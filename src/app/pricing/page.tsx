// src/app/pricing/page.tsx
'use client'; // Required because we use motion for header

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Metadata } from 'next'; // Keep type if using dynamic metadata later
import { motion, useInView, AnimatePresence, useSpring, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
// Import directly with explicit type annotations
import { rdpPlans as rdpPlansData, vpsPlans as vpsPlansData } from '../../data/plans.js';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { 
  ArrowRightIcon, 
  SparklesIcon, 
  ServerIcon, 
  ComputerDesktopIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  GlobeAltIcon,
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  BoltIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';

// Define Plan interface
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
}

// Cast the imported data to our Plan type
const rdpPlans: Plan[] = rdpPlansData as Plan[];
const vpsPlans: Plan[] = vpsPlansData as Plan[];

// Format price in PKR with commas
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Define Testimonial interface
interface Testimonial {
  quote: string;
  author: string;
  role: string;
  color: string;
}

// Advanced PlanSpecs interface for detailed benchmarks
interface PlanSpecs {
  cpuBenchmark: number; // CPU benchmark score
  iopsRead: number; // SSD read IOPS
  iopsWrite: number; // SSD write IOPS
  networkSpeed: number; // Network speed in Mbps
  latency: number; // Average latency in ms
}

// Calculate performance specs for each plan (synthetic data)
const getPlanSpecs = (plan: Plan): PlanSpecs => {
  // Extract numeric values
  const cpuValue = parseInt(plan.cpu.match(/\d+/)?.[0] || '2');
  const ramValue = parseInt(plan.ram.match(/\d+/)?.[0] || '4');
  const storageValue = parseInt(plan.storage.match(/\d+/)?.[0] || '40');
  
  // Calculate synthetic benchmark scores based on plan specs
  return {
    cpuBenchmark: cpuValue * 1500 + (plan.os.includes('Server') ? 500 : 0),
    iopsRead: 10000 + storageValue * 100,
    iopsWrite: 8000 + storageValue * 80,
    networkSpeed: 1000 + ramValue * 50,
    latency: Math.max(5, 20 - cpuValue * 0.5),
  };
};

// Feature comparison data
const featureSet = {
  basic: [
    'Full Administrator Access',
    'Global Network Access',
    'NVMe SSD Storage',
    'Windows OS',
    '24/7 Support',
  ],
  advanced: [
    'DDoS Protection',
    'Daily Backups',
    'Dedicated Resources',
    'Custom Configuration',
  ],
  premium: [
    'Priority Support',
    'High Availability',
    'Hardware Acceleration',
    'Enterprise Security',
  ]
};

// Testimonials data
const testimonials: Testimonial[] = [
  {
    quote: "Switching to these VPS plans has been transformative for our business. The performance is remarkable.",
    author: "Thomas Reynolds",
    role: "CTO, Digital Innovations",
    color: "bg-blue-600"
  },
  {
    quote: "The RDP solutions offer incredible value. I've never experienced such reliability and speed before.",
    author: "Sarah Johnson",
    role: "IT Director, Global Solutions",
    color: "bg-indigo-600"
  },
  {
    quote: "The pricing structure perfectly balances performance and affordability. Exactly what we needed.",
    author: "Michael Chen",
    role: "Developer, TechNova",
    color: "bg-purple-600"
  }
];

// Define color class maps with proper types
type ThemeColor = 'blue' | 'green' | 'sky' | 'orange';

const colorClasses: {
  themeColor: Record<ThemeColor, string>;
  border: Record<ThemeColor, string>;
  button: Record<ThemeColor, string>;
  text: Record<ThemeColor, string>;
} = {
  themeColor: {
    blue: 'from-blue-600 to-indigo-700',
    green: 'from-green-600 to-teal-700',
    sky: 'from-sky-500 to-blue-600',
    orange: 'from-orange-500 to-amber-600',
  },
  border: {
    blue: 'border-blue-200',
    green: 'border-green-200',
    sky: 'border-sky-200',
    orange: 'border-orange-200',
  },
  button: {
    blue: 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20 hover:shadow-blue-600/40',
    green: 'bg-gradient-to-r from-green-600 to-teal-600 shadow-green-500/20 hover:shadow-green-600/40',
    sky: 'bg-gradient-to-r from-sky-500 to-blue-600 shadow-sky-500/20 hover:shadow-sky-600/40',
    orange: 'bg-gradient-to-r from-orange-500 to-amber-600 shadow-orange-500/20 hover:shadow-orange-600/40',
  },
  text: {
    blue: 'text-blue-600',
    green: 'text-green-600',
    sky: 'text-sky-600',
    orange: 'text-orange-600',
  }
};

// 3D Card Component
interface PricingCardProps {
  plan: Plan;
  featured?: boolean;
  planType: 'RDP' | 'VPS';
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, featured = false, planType }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [showDetails, setShowDetails] = useState(false);
  
  // Get performance specs
  const specs = getPlanSpecs(plan);
  
  // Default to 'blue' if the plan's themeColor is not in our predefined colors
  const themeColor = (plan.themeColor as ThemeColor) || 'blue';
  const borderClass = colorClasses.border[themeColor] || colorClasses.border.blue;
  const buttonClass = colorClasses.button[themeColor] || colorClasses.button.blue;
  const textClass = colorClasses.text[themeColor] || colorClasses.text.blue;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: featured ? 0.1 : 0 }}
      whileHover={{ 
        y: -10,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        transition: { duration: 0.3 }
      }}
      className={`relative flex flex-col h-full rounded-2xl overflow-hidden bg-white border ${borderClass} shadow-xl ${
        featured ? 'scale-105 z-10' : ''
      }`}
    >
      {featured && (
        <div className="absolute top-0 right-0 -mt-2 -mr-16 w-32 transform rotate-45 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-1 px-10 text-xs font-medium">
          Best Value
        </div>
      )}
      
      <div className="p-6 pb-0">
        <h3 className={`text-xl font-bold ${textClass}`}>{plan.name}</h3>
        
        <div className="mt-4 flex items-baseline">
          <span className="text-5xl font-extrabold tracking-tight text-gray-900">PKR {formatPrice(plan.price)}</span>
          <span className="ml-1 text-xl font-semibold text-gray-500">/mo</span>
        </div>
        
        <p className="mt-2 text-gray-500">
          {planType === 'RDP' ? 'Remote Desktop Solution' : 'Virtual Private Server'}
        </p>
      </div>
      
      <div className="p-6 flex-grow">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-full overflow-hidden mr-3 bg-gradient-to-br ${colorClasses.themeColor[themeColor]}`}>
            {planType === 'RDP' ? (
              <ComputerDesktopIcon className="w-6 h-6 text-white m-2" />
            ) : (
              <ServerIcon className="w-6 h-6 text-white m-2" />
            )}
          </div>
          <div>
            <div className="flex items-center">
              <CpuChipIcon className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">{plan.cpu}</span>
            </div>
            <div className="flex items-center">
              <ServerIcon className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">{plan.ram}</span>
            </div>
          </div>
        </div>
        
        <ul className="space-y-3 text-sm">
          {[
            { icon: CpuChipIcon, text: plan.cpu, label: "CPU" },
            { icon: ServerIcon, text: plan.ram, label: "RAM" },
            { icon: ServerIcon, text: plan.storage, label: "Storage" },
            { icon: GlobeAltIcon, text: plan.bandwidth, label: "Bandwidth" },
            { icon: ComputerDesktopIcon, text: plan.os, label: "OS" },
          ].map((feature, idx) => (
            <li key={idx} className="flex items-center">
              <feature.icon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-700">
                <span className="font-medium">{feature.label}:</span> {feature.text}
              </span>
            </li>
          ))}
          
          <li className="pt-2">
            <div className="border-t border-gray-200 mt-2 pt-3">
              <h4 className={`${textClass} font-medium mb-2`}>Ideal for:</h4>
              <ul className="space-y-1">
                {plan.useCases.map((useCase: string, idx: number) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
        
        {/* Interactive Performance Benchmarks */}
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 w-full flex items-center justify-center py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200"
        >
          {showDetails ? "Hide Benchmarks" : "Show Benchmarks"}
          <ChartBarIcon className={`ml-1.5 h-4 w-4 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-gray-50 rounded-lg p-4 overflow-hidden"
            >
              <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Benchmarks</h4>
              
              {/* CPU Benchmark */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">CPU Benchmark</span>
                  <span className="font-medium">{specs.cpuBenchmark.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full bg-blue-500`} style={{ width: `${Math.min(100, (specs.cpuBenchmark / 10000) * 100)}%` }}></div>
                </div>
              </div>
              
              {/* Storage IOPS */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Storage IOPS (R/W)</span>
                  <span className="font-medium">{specs.iopsRead.toLocaleString()} / {specs.iopsWrite.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full bg-green-500`} style={{ width: `${Math.min(100, (specs.iopsRead / 50000) * 100)}%` }}></div>
                </div>
              </div>
              
              {/* Network Speed */}
              <div className="mb-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Network Speed</span>
                  <span className="font-medium">{specs.networkSpeed} Mbps</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full bg-purple-500`} style={{ width: `${Math.min(100, (specs.networkSpeed / 3000) * 100)}%` }}></div>
                </div>
              </div>
              
              {/* Real-world application performance */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded border border-gray-200">
                  <CircleStackIcon className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                  <span className="block text-gray-700 font-medium">Database</span>
                  <span className="text-gray-500">Very Good</span>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <DevicePhoneMobileIcon className="h-4 w-4 mx-auto mb-1 text-green-500" />
                  <span className="block text-gray-700 font-medium">Web Apps</span>
                  <span className="text-gray-500">Excellent</span>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <BoltIcon className="h-4 w-4 mx-auto mb-1 text-orange-500" />
                  <span className="block text-gray-700 font-medium">Streaming</span>
                  <span className="text-gray-500">Good</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-6 pt-0">
        <Link
          href={plan.orderLink}
          className={`w-full inline-flex justify-center items-center px-4 py-3 rounded-lg font-medium text-white ${buttonClass} transition-all duration-200 shadow-lg hover:shadow-xl`}
        >
          Order Now
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

// Feature Comparison Component
interface FeatureComparisonProps {
  isVisible: boolean;
}

const FeatureComparison: React.FC<FeatureComparisonProps> = ({ isVisible }) => {
  const allFeatures = [...featureSet.basic, ...featureSet.advanced, ...featureSet.premium];
  const plans = ["Free", "Essential", "Professional", "Enterprise"];
  
  const hasFeature = (planIndex: number, feature: string): boolean => {
    if (planIndex === 0) return featureSet.basic.slice(0, 2).includes(feature);
    if (planIndex === 1) return featureSet.basic.includes(feature);
    if (planIndex === 2) return featureSet.basic.includes(feature) || featureSet.advanced.includes(feature);
    if (planIndex === 3) return true;
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-200"
    >
      <div className="px-6 py-8 bg-gradient-to-r from-gray-50 to-gray-100">
        <h3 className="text-2xl font-bold text-gray-900">Feature Comparison</h3>
        <p className="mt-2 text-gray-600">Compare features across all our plans</p>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                  Feature
                </th>
                {plans.map((plan, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className="py-4 px-6 text-center text-sm font-semibold text-gray-900"
                  >
                    {plan}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allFeatures.map((feature, featureIdx) => (
                <tr key={featureIdx} className={featureIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900">
                    {feature}
                  </td>
                  {plans.map((_, planIdx) => (
                    <td
                      key={planIdx}
                      className="whitespace-nowrap py-4 px-6 text-center text-sm text-gray-500"
                    >
                      {hasFeature(planIdx, feature) ? (
                        <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XMarkIcon className="h-5 w-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

// Testimonial Card Component
interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
    >
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full overflow-hidden mr-4 ring-2 ring-blue-100 flex items-center justify-center text-white font-bold" 
             style={{ background: `linear-gradient(to bottom right, ${testimonial.color}, ${testimonial.color}dd)` }}>
          {testimonial.author.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-gray-900">{testimonial.author}</p>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
        </div>
      </div>
      <p className="text-gray-600 italic">"{testimonial.quote}"</p>
    </motion.div>
  );
};

// Value Proposition Banner
const ValuePropositionBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 shadow-xl"
    >
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-20"></div>
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-40 h-40 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="relative z-10 px-8 py-12 text-center">
        <SparklesIcon className="h-12 w-12 mx-auto text-white/90 mb-6" />
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Enterprise-Grade Infrastructure at Unbeatable Prices
        </h3>
        <p className="text-blue-100 max-w-3xl mx-auto mb-8">
          Our cutting-edge technology stack and optimized infrastructure allow us to offer premium computing resources at prices our competitors can't match.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex flex-col items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg">
            <span className="text-2xl font-bold text-white">99.9%</span>
            <span className="text-sm text-blue-100">Uptime Guarantee</span>
          </div>
          <div className="flex flex-col items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg">
            <span className="text-2xl font-bold text-white">24/7</span>
            <span className="text-sm text-blue-100">Expert Support</span>
          </div>
          <div className="flex flex-col items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg">
            <span className="text-2xl font-bold text-white">Global</span>
            <span className="text-sm text-blue-100">Data Centers</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Advanced Resource Calculator Component
interface ResourceCalculatorProps {
  activeTab: 'rdp' | 'vps';
  onPlanSelect: (planId: string) => void;
}

const ResourceCalculator: React.FC<ResourceCalculatorProps> = ({ activeTab, onPlanSelect }) => {
  const [cpu, setCpu] = useState<number>(4);
  const [ram, setRam] = useState<number>(8);
  const [storage, setStorage] = useState<number>(100);
  const [os, setOs] = useState<string>(activeTab === 'rdp' ? 'Windows Server 2022' : 'Windows 10');
  
  // Calculate the estimated monthly price based on resource selection
  const estimatedPrice = useMemo(() => {
    const basePrice = 1000;
    const cpuPrice = cpu * 100;
    const ramPrice = ram * 50;
    const storagePrice = storage * 0.5;
    const osMultiplier = os.includes('Server') ? 1.2 : 1;
    
    return Math.round((basePrice + cpuPrice + ramPrice + storagePrice) * osMultiplier);
  }, [cpu, ram, storage, os]);
  
  // Find the closest matching plan based on selected resources
  const recommendedPlan = useMemo(() => {
    const plans = activeTab === 'rdp' ? rdpPlans : vpsPlans;
    
    // This is a simplified matching algorithm
    // In a real application, you'd want a more sophisticated matching logic
    let bestMatch = plans[0];
    let bestScore = Number.MAX_SAFE_INTEGER;
    
    plans.forEach(plan => {
      // Extract numeric values from strings with regex
      const planCpu = parseInt(plan.cpu.match(/\d+/)?.[0] || '0');
      const planRam = parseInt(plan.ram.match(/\d+/)?.[0] || '0');
      const planStorage = parseInt(plan.storage.match(/\d+/)?.[0] || '0');
      
      // Calculate a score based on how close the plan is to selected resources
      // Lower score means better match
      const cpuDiff = Math.abs(planCpu - cpu);
      const ramDiff = Math.abs(planRam - ram);
      const storageDiff = Math.abs(planStorage - storage) / 10; // Scale down for balance
      
      const score = cpuDiff + ramDiff + storageDiff;
      
      if (score < bestScore) {
        bestScore = score;
        bestMatch = plan;
      }
    });
    
    return bestMatch;
  }, [cpu, ram, storage, os, activeTab]);
  
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-8 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900">Resource Calculator</h3>
        <p className="mt-2 text-gray-600">Configure your ideal setup and get instant pricing</p>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {/* CPU Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">CPU (vCores)</label>
              <span className="text-sm font-semibold text-blue-600">{cpu} vCores</span>
            </div>
            <input
              type="range"
              min="2"
              max="16"
              step="2"
              value={cpu}
              onChange={(e) => setCpu(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>2</span>
              <span>16</span>
            </div>
          </div>
          
          {/* RAM Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">RAM (GB)</label>
              <span className="text-sm font-semibold text-blue-600">{ram} GB</span>
            </div>
            <input
              type="range"
              min="4"
              max="32"
              step="4"
              value={ram}
              onChange={(e) => setRam(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>4 GB</span>
              <span>32 GB</span>
            </div>
          </div>
          
          {/* Storage Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">NVMe SSD Storage (GB)</label>
              <span className="text-sm font-semibold text-blue-600">{storage} GB</span>
            </div>
            <input
              type="range"
              min="40"
              max="500"
              step="20"
              value={storage}
              onChange={(e) => setStorage(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>40 GB</span>
              <span>500 GB</span>
            </div>
          </div>
          
          {/* OS Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operating System</label>
            <div className="flex flex-wrap gap-3">
              {activeTab === 'rdp' ? (
                <>
                  <button
                    onClick={() => setOs('Windows Server 2022')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                      os === 'Windows Server 2022'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Windows Server 2022
                  </button>
                  <button
                    onClick={() => setOs('Windows Server 2019')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                      os === 'Windows Server 2019'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Windows Server 2019
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setOs('Windows 10')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                      os === 'Windows 10'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Windows 10
                  </button>
                  <button
                    onClick={() => setOs('Windows 11')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                      os === 'Windows 11'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Windows 11
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-gray-900">Estimated Monthly Cost</h4>
            <span className="text-2xl font-bold text-blue-600">${estimatedPrice}</span>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Recommended Plan:</p>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full overflow-hidden mr-3 bg-gradient-to-br ${
                colorClasses.themeColor[recommendedPlan.themeColor as ThemeColor] || colorClasses.themeColor.blue
              }`}>
                {activeTab === 'rdp' ? (
                  <ComputerDesktopIcon className="w-6 h-6 text-white m-2" />
                ) : (
                  <ServerIcon className="w-6 h-6 text-white m-2" />
                )}
              </div>
              <div>
                <h5 className="font-medium text-gray-900">{recommendedPlan.name}</h5>
                <p className="text-sm text-gray-600">{`${recommendedPlan.cpu}, ${recommendedPlan.ram}, ${recommendedPlan.storage}`}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => onPlanSelect(recommendedPlan.id)}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Select This Plan
            </button>
            <Link
              href={recommendedPlan.orderLink}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Plan Comparison Table with Side-by-Side View
interface PlanComparisonProps {
  plans: Plan[];
  planType: 'RDP' | 'VPS';
}

const PlanComparison: React.FC<PlanComparisonProps> = ({ plans, planType }) => {
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  
  const togglePlanSelection = (planId: string) => {
    if (selectedPlans.includes(planId)) {
      setSelectedPlans(selectedPlans.filter(id => id !== planId));
    } else {
      // Limit to maximum 3 plans for comparison
      if (selectedPlans.length < 3) {
        setSelectedPlans([...selectedPlans, planId]);
      }
    }
  };
  
  const filteredPlans = plans.filter(plan => selectedPlans.includes(plan.id));
  
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-8 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900">Advanced Plan Comparison</h3>
        <p className="mt-2 text-gray-600">Select up to 3 plans to compare side-by-side</p>
      </div>
      
      {/* Plan Selection */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {plans.map(plan => (
            <button
              key={plan.id}
              onClick={() => togglePlanSelection(plan.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                selectedPlans.includes(plan.id)
                  ? `bg-${plan.themeColor}-50 border-${plan.themeColor}-300 text-${plan.themeColor}-700`
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {plan.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Comparison Table */}
      {filteredPlans.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                {filteredPlans.map(plan => (
                  <th 
                    key={plan.id} 
                    scope="col" 
                    className={`px-6 py-3 text-left text-xs font-medium text-${plan.themeColor}-700 uppercase tracking-wider`}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Plan Price */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Monthly Price
                </td>
                {filteredPlans.map(plan => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">PKR {formatPrice(plan.price)}</span>
                  </td>
                ))}
              </tr>
              
              {/* CPU */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  CPU
                </td>
                {filteredPlans.map(plan => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.cpu}
                  </td>
                ))}
              </tr>
              
              {/* RAM */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  RAM
                </td>
                {filteredPlans.map(plan => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.ram}
                  </td>
                ))}
              </tr>
              
              {/* Storage */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Storage
                </td>
                {filteredPlans.map(plan => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.storage}
                  </td>
                ))}
              </tr>
              
              {/* Bandwidth */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Bandwidth
                </td>
                {filteredPlans.map(plan => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.bandwidth}
                  </td>
                ))}
              </tr>
              
              {/* OS */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Operating System
                </td>
                {filteredPlans.map(plan => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {plan.os}
                  </td>
                ))}
              </tr>
              
              {/* Actions */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Action
                </td>
                {filteredPlans.map(plan => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      href={plan.orderLink}
                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-white bg-gradient-to-r from-${plan.themeColor}-600 to-${plan.themeColor}-700 hover:shadow-md transition-all duration-200`}
                    >
                      Order Now
                      <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">
          <ServerIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p>Select at least one plan to see comparison</p>
        </div>
      )}
    </div>
  );
};

// 3D Resource Visualization Component
interface ResourceVisualizationProps {
  plan: Plan;
}

const ResourceVisualization: React.FC<ResourceVisualizationProps> = ({ plan }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  
  // Extract numeric values from plan properties for visualization
  const cpuValue = parseInt(plan.cpu.match(/\d+/)?.[0] || '2');
  const ramValue = parseInt(plan.ram.match(/\d+/)?.[0] || '4');
  const storageValue = parseInt(plan.storage.match(/\d+/)?.[0] || '40');
  
  // Calculate visualization sizes based on plan values
  const cpuSize = Math.min(100, (cpuValue / 16) * 100);
  const ramSize = Math.min(100, (ramValue / 32) * 100);
  const storageSize = Math.min(100, (storageValue / 500) * 100);
  
  // Spring animations for resource bars
  const cpuSpring = useSpring(isInView ? cpuSize : 0, { 
    stiffness: 100, 
    damping: 30,
    duration: 1.5
  });
  const ramSpring = useSpring(isInView ? ramSize : 0, { 
    stiffness: 100, 
    damping: 30,
    duration: 1.5
  });
  const storageSpring = useSpring(isInView ? storageSize : 0, { 
    stiffness: 100, 
    damping: 30,
    duration: 1.5
  });
  
  return (
    <div 
      ref={containerRef}
      className="bg-gray-900 rounded-xl overflow-hidden p-6 text-white h-full"
    >
      <h3 className="text-lg font-semibold mb-4">{plan.name} - Resources</h3>
      
      <div className="space-y-6">
        {/* CPU Visualization */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-300">CPU</span>
            <span className="text-xs font-medium text-blue-300">{cpuValue} vCores</span>
          </div>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"
              style={{ width: cpuSpring }}
            />
          </div>
        </div>
        
        {/* RAM Visualization */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-300">RAM</span>
            <span className="text-xs font-medium text-purple-300">{ramValue} GB</span>
          </div>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-full"
              style={{ width: ramSpring }}
            />
          </div>
        </div>
        
        {/* Storage Visualization */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-300">Storage</span>
            <span className="text-xs font-medium text-green-300">{storageValue} GB</span>
          </div>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-green-500 to-green-300 rounded-full"
              style={{ width: storageSpring }}
            />
          </div>
        </div>
      </div>
      
      {/* 3D Server Visualization */}
      <div className="mt-6 relative h-32">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-20 bg-gradient-to-b from-gray-700 to-gray-800 rounded-md relative perspective">
            {/* Fake 3D effect with absolute positioned planes */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-600 transform -translate-y-1 skew-x-12"></div>
            <div className="absolute top-0 right-0 w-1 h-full bg-gray-600 transform translate-x-1 skew-y-12"></div>
            
            {/* Server rack details */}
            <div className="absolute inset-2 flex flex-col justify-between">
              <div className="h-2 bg-gray-600 rounded-sm flex space-x-1 px-1 items-center">
                <div className="w-0.5 h-0.5 rounded-full bg-blue-400 animate-pulse"></div>
                <div className="w-0.5 h-0.5 rounded-full bg-green-400 animate-pulse delay-150"></div>
              </div>
              
              <div className="space-y-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-1.5 bg-gray-600/50 rounded-sm"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Glowing effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-8 bg-blue-500/10 rounded-full blur-xl transform -translate-y-5"></div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
export default function PricingPage() {
  // Define state with specific types
  const [activeTab, setActiveTab] = useState<'rdp' | 'vps'>('rdp');
  const [showComparison, setShowComparison] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'price' | 'performance' | 'value'>('price');
  
  // Handle plan selection from calculator
  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
    const element = document.getElementById(`plan-${planId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Highlight the selected plan
      element.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-50');
      setTimeout(() => {
        element.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-50');
      }, 2000);
    }
  };
  
  // Sort plans based on selected option
  const getSortedPlans = (plans: Plan[]) => {
    if (sortOption === 'price') {
      return [...plans].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'performance') {
      return [...plans].sort((a, b) => {
        // Extract CPU cores for sorting
        const aCores = parseInt(a.cpu.match(/\d+/)?.[0] || '0');
        const bCores = parseInt(b.cpu.match(/\d+/)?.[0] || '0');
        return bCores - aCores;
      });
    } else if (sortOption === 'value') {
      return [...plans].sort((a, b) => {
        // Calculate a value score (lower is better)
        // This is a simplified value calculation
        const aCores = parseInt(a.cpu.match(/\d+/)?.[0] || '1');
        const bCores = parseInt(b.cpu.match(/\d+/)?.[0] || '1');
        const aValue = a.price / aCores;
        const bValue = b.price / bCores;
        return aValue - bValue;
      });
    }
    return plans;
  };
  
  const sortedRdpPlans = getSortedPlans(rdpPlans);
  const sortedVpsPlans = getSortedPlans(vpsPlans);
  
  useEffect(() => {
    // Scroll to selected plan if any
    if (selectedPlanId) {
      const element = document.getElementById(`plan-${selectedPlanId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedPlanId, activeTab]);
  
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });
  
  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <main className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-blue-50 to-indigo-50 -z-10"></div>
      <div className="absolute top-24 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-36 right-1/3 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Header Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={headerRef}
            variants={headerVariants}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={childVariants} className="inline-block mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                <SparklesIcon className="h-4 w-4 mr-1.5" />
                Professional Pricing
              </span>
            </motion.div>
          
            <motion.h1 
              variants={childVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6"
            >
              Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Computing Solutions</span>
            </motion.h1>
            
            <motion.p 
              variants={childVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
            >
              Premium Windows RDP and VPS solutions with dedicated resources, exceptional performance, and 24/7 support at unbeatable prices.
            </motion.p>
            
            <motion.div 
              variants={childVariants}
              className="inline-flex p-1 rounded-lg bg-gray-100 mb-8"
            >
              <button
                onClick={() => setActiveTab('rdp')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'rdp'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                } transition-all duration-200`}
              >
                Windows RDP
              </button>
              <button
                onClick={() => setActiveTab('vps')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'vps'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                } transition-all duration-200`}
              >
                Windows VPS
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Advanced Tools Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-gray-900 mr-2">
                {activeTab === 'rdp' ? 'Windows RDP' : 'Windows VPS'} Solutions
              </h2>
              {activeTab === 'rdp' ? (
                <ComputerDesktopIcon className="h-6 w-6 text-blue-600" />
              ) : (
                <ServerIcon className="h-6 w-6 text-green-600" />
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                Resource Calculator
              </button>
              
              <div className="relative inline-block">
                <label htmlFor="sort" className="sr-only">Sort</label>
                <select
                  id="sort"
                  name="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="price">Sort by Price</option>
                  <option value="performance">Sort by Performance</option>
                  <option value="value">Sort by Value</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ArrowsUpDownIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Resource Calculator (if enabled) */}
          {showCalculator && (
            <div className="mb-12">
              <ResourceCalculator 
                activeTab={activeTab} 
                onPlanSelect={handlePlanSelect}
              />
            </div>
          )}
          
          {/* Main Pricing Section */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                {activeTab === 'rdp' ? (
                  sortedRdpPlans.map((plan) => (
                    <div key={plan.id} id={`plan-${plan.id}`}>
                      <PricingCard
                        plan={plan}
                        featured={plan.label === 'Recommended'}
                        planType="RDP"
                      />
                    </div>
                  ))
                ) : (
                  sortedVpsPlans.map((plan) => (
                    <div key={plan.id} id={`plan-${plan.id}`}>
                      <PricingCard
                        plan={plan}
                        featured={plan.label === 'Most Selling'}
                        planType="VPS"
                      />
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      
      {/* Advanced Comparison Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Comparison</h2>
            <p className="text-lg text-gray-600">
              Compare plans side-by-side to find the perfect solution for your needs
            </p>
          </div>
          
          <PlanComparison 
            plans={activeTab === 'rdp' ? rdpPlans : vpsPlans}
            planType={activeTab === 'rdp' ? 'RDP' : 'VPS'}
          />
        </div>
      </section>
      
      {/* Resource Visualization Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Visualize Your Resources</h2>
            <p className="text-lg text-blue-100">
              See exactly what you get with each plan in our interactive visualization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'rdp' ? (
              rdpPlans.slice(0, 3).map(plan => (
                <ResourceVisualization key={plan.id} plan={plan} />
              ))
            ) : (
              vpsPlans.slice(0, 3).map(plan => (
                <ResourceVisualization key={plan.id} plan={plan} />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Value Proposition Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 shadow-xl">
            <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-20"></div>
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-40 h-40 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
            
            <div className="relative z-10 px-8 py-12 text-center">
              <SparklesIcon className="h-12 w-12 mx-auto text-white/90 mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Enterprise-Grade Infrastructure at Unbeatable Prices
              </h3>
              <p className="text-blue-100 max-w-3xl mx-auto mb-8">
                Our cutting-edge technology stack and optimized infrastructure allow us to offer premium computing resources at prices our competitors can't match.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex flex-col items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <span className="text-2xl font-bold text-white">99.9%</span>
                  <span className="text-sm text-blue-100">Uptime Guarantee</span>
                </div>
                <div className="flex flex-col items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <span className="text-2xl font-bold text-white">24/7</span>
                  <span className="text-sm text-blue-100">Expert Support</span>
                </div>
                <div className="flex flex-col items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <span className="text-2xl font-bold text-white">Global</span>
                  <span className="text-sm text-blue-100">Data Centers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Add floating chat indicator */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </div>
    </main>
  );
}