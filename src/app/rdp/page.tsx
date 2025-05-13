// src/app/rdp/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ServerIcon, 
  CpuChipIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  ChevronDoubleDownIcon,
  ArrowPathIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { 
  CheckBadgeIcon, 
  BoltIcon, 
  SparklesIcon
} from '@heroicons/react/24/solid';
import { FaWindows, FaServer, FaShieldAlt, FaHeadset } from 'react-icons/fa';

// Define the Plan type first
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

// Import all exports from plans.js
import * as plansModule from '@/data/plans.js';
// Access the rdpPlans array directly from the module
const rdpPlans = plansModule.rdpPlans || [];

// Use type assertion for ProductCard
const ProductCard = dynamic(() => import('@/components/ProductCard'), {
  loading: () => <PlanCardSkeleton />,
  ssr: false
}) as React.ComponentType<{plan: Plan}>;

const PromoCtaSection = dynamic(() => import('@/components/PromoCtaSection'), {
  loading: () => <div className="flex justify-center py-10">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>,
  ssr: false
});

// Types definition
interface FeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, color }: FeatureProps) => (
  <motion.div 
    className="relative overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100 p-6 h-full"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true, amount: 0.2 }}
    whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1)" }}
  >
    {/* Feature icon */}
    <div className={`mb-5 inline-flex items-center justify-center rounded-xl p-3 ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    
    {/* Content */}
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
    </div>
  </motion.div>
);

// Plan Card Skeleton
const PlanCardSkeleton = () => (
  <div className="bg-white h-[600px] rounded-xl shadow-lg border border-gray-200 p-6 animate-pulse">
    <div className="h-7 bg-gray-200 rounded-md w-3/4 mb-6"></div>
    <div className="h-28 bg-gray-200 rounded-md mb-6"></div>
    <div className="space-y-4 mb-6">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-gray-200"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
        </div>
      ))}
    </div>
    <div className="mt-auto space-y-4">
      <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
    </div>
  </div>
);

// Tech Logo Component
const TechLogo = ({ name }: { name: string }) => (
  <motion.div 
    className="h-14 flex items-center justify-center"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="text-xl font-bold tracking-tight text-gray-400/80">{name}</div>
  </motion.div>
);

// RDP Features
const features: FeatureProps[] = [
  {
    icon: RocketLaunchIcon,
    title: "High-Performance Resources",
    description: "Enterprise-grade infrastructure with dedicated vCPUs, fast RAM, and NVMe SSD storage for maximum performance.",
    color: "bg-gradient-to-r from-blue-600 to-indigo-600"
  },
  {
    icon: FaWindows,
    title: "Windows Server 2022",
    description: "Latest Windows Server OS with full administrator access, regular updates, and complete customization control.",
    color: "bg-gradient-to-r from-sky-500 to-blue-600"
  },
  {
    icon: FaShieldAlt,
    title: "Enterprise-Grade Security",
    description: "Advanced security protections including DDoS mitigation, SSL encryption, and automated backup systems.",
    color: "bg-gradient-to-r from-indigo-500 to-purple-600"
  },
  {
    icon: GlobeAltIcon,
    title: "Global Network Access",
    description: "Connect from anywhere with minimal latency through our global network infrastructure and high bandwidth allocation.",
    color: "bg-gradient-to-r from-green-500 to-teal-600"
  },
  {
    icon: FaServer,
    title: "99.9% Uptime Guarantee",
    description: "Redundant infrastructure, automated failover systems, and constant monitoring ensure your RDP remains online.",
    color: "bg-gradient-to-r from-orange-500 to-amber-600"
  },
  {
    icon: FaHeadset,
    title: "24/7 Technical Support",
    description: "Our experienced team provides round-the-clock assistance with fast response times for any technical issues.",
    color: "bg-gradient-to-r from-purple-500 to-pink-600"
  }
];

// Comparison specs for the table
const comparisonItems = [
  { name: "CPU", icon: CpuChipIcon },
  { name: "RAM", icon: ServerIcon },
  { name: "Storage", icon: ServerIcon },
  { name: "Bandwidth", icon: GlobeAltIcon },
  { name: "Security", icon: ShieldCheckIcon },
];

// Add a new performance metric visualization component
const PerformanceMetric = ({ label, value, color }: { label: string; value: string; color: string }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div 
      ref={ref}
      className="flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className={`w-full h-2 ${color} rounded-full mb-2`}>
        <motion.div 
          className="h-full bg-white/30 rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: "100%" } : { width: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between w-full text-sm">
        <span className="text-gray-100/80 font-medium">{label}</span>
        <span className="text-white font-bold">{value}</span>
      </div>
    </motion.div>
  );
};

// Add an interactive FAQ section
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 py-5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <span className={`ml-6 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pt-4 pb-2">
          <p className="text-gray-600">{answer}</p>
        </div>
      </motion.div>
    </div>
  );
};

// Add a testimonial component
const Testimonial = ({ quote, author, role, company }: { 
  quote: string; 
  author: string; 
  role: string; 
  company: string 
}) => (
  <motion.div 
    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ y: -5, boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1)" }}
  >
    <div className="flex items-center mb-4">
      <div className="flex-shrink-0 mr-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
          {author.charAt(0)}
        </div>
      </div>
      <div>
        <h4 className="text-lg font-bold text-gray-900">{author}</h4>
        <p className="text-sm text-gray-600">{role}, {company}</p>
      </div>
    </div>
    <p className="text-gray-800 italic">"{quote}"</p>
  </motion.div>
);

// Add server status component
const ServerStatusIndicator = () => {
  return (
    <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
      <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
      <span className="text-sm font-medium text-green-700">All Systems Operational</span>
    </div>
  );
};

// Main component
export default function RdpPage() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Card grid styles that change based on number of plans
  const gridColsClass = rdpPlans.length <= 3 
    ? "md:grid-cols-2 lg:grid-cols-3" 
    : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  // Add scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scrollIndicatorWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // FAQs data
  const faqs = [
    {
      question: "What is an RDP and how does it work?",
      answer: "Remote Desktop Protocol (RDP) is a proprietary protocol developed by Microsoft that provides a user with a graphical interface to connect to another computer over a network connection. Our RDP solutions allow you to securely access a Windows desktop environment hosted on our powerful servers from anywhere in the world."
    },
    {
      question: "How secure are your RDP solutions?",
      answer: "Our RDP solutions feature enterprise-grade security including DDoS protection, SSL encryption, 2FA authentication, regular security updates, and advanced firewall protection. We implement industry best practices to ensure your data and access remain secure."
    },
    {
      question: "Can I install my own software on the RDP?",
      answer: "Yes, you have full administrator access to your RDP environment. You can install any software you need, customize settings, and configure the environment to meet your specific requirements."
    },
    {
      question: "What's your uptime guarantee?",
      answer: "We guarantee 99.9% uptime for all our RDP solutions. Our infrastructure is built with redundancy in mind, and we utilize automatic failover systems to minimize any potential downtime."
    }
  ];
  
  // Testimonials data
  const testimonials = [
    {
      quote: "Switching to NextGenRDP has dramatically improved our remote work capabilities. The performance is outstanding, and the uptime is rock-solid.",
      author: "Sarah Johnson",
      role: "IT Director",
      company: "Global Solutions Inc."
    },
    {
      quote: "I've tried many RDP providers, but none matched the speed and reliability I get with NextGenRDP. Customer support is also exceptional.",
      author: "Michael Chen",
      role: "Software Developer",
      company: "TechNova Systems"
    },
    {
      quote: "The security features offered by NextGenRDP give me peace of mind when working with sensitive client data remotely.",
      author: "Jessica Williams",
      role: "Financial Analyst",
      company: "Capital Advisors Group"
    }
  ];

  return (
    <div className="bg-gray-50 font-sans">
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-50 origin-left"
        style={{ scaleX: scrollIndicatorWidth }}
      />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-blue-200/30 mix-blend-multiply blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-purple-200/30 mix-blend-multiply blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/images/grid.svg')] bg-repeat opacity-[0.015]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 flex justify-center"
            >
              <span className="bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full inline-flex items-center">
                <BoltIcon className="w-4 h-4 mr-1.5" />
                Enterprise-Grade Technology
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Premium <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">RDP Solutions</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
            >
              High-performance Windows Remote Desktop environments with dedicated resources, 
              advanced security, and 24/7 technical support.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link 
                href="#plans"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                View Plans
              </Link>
              
              <Link 
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white text-gray-800 font-medium rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-gray-200"
              >
                Explore Features
              </Link>
            </motion.div>
          </motion.div>

          {/* Server visualization */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <div className="relative h-[300px] w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              {/* Visual elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100"></div>
              
              {/* Server racks visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 p-6">
                  {[1, 2, 3].map((server) => (
                    <div key={server} className="h-[200px] bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg shadow-md overflow-hidden border border-gray-300 flex flex-col">
                      {/* Server header */}
                      <div className="h-6 bg-gradient-to-r from-blue-600 to-indigo-700 px-2 flex items-center">
                        <div className="flex space-x-1">
                          {[1, 2, 3].map((dot) => (
                            <div key={dot} className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Server body */}
                      <div className="flex-grow p-2 flex flex-col gap-2">
                        {[1, 2, 3, 4, 5].map((slot) => (
                          <div key={slot} className="h-4 bg-gray-400/30 rounded flex items-center px-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${slot % 2 === 0 ? 'bg-green-500' : 'bg-blue-500'} animate-pulse`}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Connection lines */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <line x1="30%" y1="40%" x2="70%" y2="40%" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="2" strokeDasharray="4 2" />
                  <line x1="30%" y1="60%" x2="70%" y2="60%" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="2" strokeDasharray="4 2" />
                </svg>
              </div>
              
              {/* Pulse effects */}
              <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-blue-600/10"></div>
              <div className="absolute bottom-1/3 right-1/3 w-12 h-12 rounded-full bg-blue-600/10 animate-ping" style={{ animationDuration: '3s' }}></div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
              className="flex flex-col items-center"
            >
              <span className="text-sm text-gray-500 mb-2">Scroll to explore</span>
              <ChevronDoubleDownIcon className="h-5 w-5 text-gray-400" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Technology Partners */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 text-sm uppercase font-semibold tracking-wider mb-8">
            POWERED BY LEADING TECHNOLOGY
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
            {['Microsoft', 'Intel', 'AMD', 'Cisco', 'Cloudflare'].map((name) => (
              <TechLogo key={name} name={name} />
            ))}
          </div>
        </div>
      </section>

      {/* Add a "Why Choose Us" section after Technology Partners */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Why Choose Our <span className="text-blue-600">RDP Solutions</span>
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Our Remote Desktop services are designed for professionals who demand performance, security, and reliability.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      { icon: BoltIcon, text: "High-performance infrastructure with minimal latency", color: "text-blue-600" },
                      { icon: ShieldCheckIcon, text: "Enterprise-grade security with DDoS protection", color: "text-green-600" },
                      { icon: ClockIcon, text: "99.9% uptime guarantee with 24/7 monitoring", color: "text-purple-600" },
                      { icon: ArrowPathIcon, text: "Regular updates and maintenance included", color: "text-orange-600" }
                    ].map((item, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className={`mt-1 p-1.5 rounded-full bg-gray-100 ${item.color}`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="ml-3 text-gray-700">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
              
              <div className="md:w-1/2">
                <motion.div
                  className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl overflow-hidden shadow-xl p-6 md:p-8"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl text-white font-bold">Performance Metrics</h3>
                    <ServerStatusIndicator />
                  </div>
                  
                  <div className="space-y-4">
                    <PerformanceMetric label="CPU Performance" value="Up to 128 vCores" color="bg-blue-500" />
                    <PerformanceMetric label="Memory Speed" value="3200MHz DDR4" color="bg-indigo-500" />
                    <PerformanceMetric label="SSD Storage" value="NVMe Technology" color="bg-purple-500" />
                    <PerformanceMetric label="Network Throughput" value="10 Gbps" color="bg-pink-500" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.span 
              className="inline-block text-blue-600 font-semibold mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              ENTERPRISE FEATURES
            </motion.span>
            
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Remote Computing Excellence
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Our high-performance RDP solutions deliver exceptional speed, security, 
              and reliability for businesses and professionals.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <div className="absolute -top-5 left-0 right-0 flex justify-center">
          <div className="bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md">
            Choose Your Plan
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              RDP Plans for Every Need
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              From basic workstations to high-performance computing environments, 
              we have the perfect RDP solution for you.
            </motion.p>
          </div>

          <motion.div 
            className={`grid grid-cols-1 ${gridColsClass} gap-8`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            {isClient ? 
              rdpPlans.map((plan) => (
                <ProductCard key={plan.id} plan={plan} />
              ))
              :
              Array(4).fill(0).map((_, index) => (
                <PlanCardSkeleton key={`skeleton-${index}`} />
              ))
            }
          </motion.div>
        </div>
      </section>

      {/* Promo CTA Section */}
      <PromoCtaSection promoCode="RDP20" discount="20%" />

      {/* Comparison Table Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.span 
              className="inline-block text-blue-600 font-semibold mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              PLAN COMPARISON
            </motion.span>
            
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Compare RDP Specifications
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Find the perfect balance of performance and value for your needs
            </motion.p>
          </div>

          <div className="overflow-x-auto">
            <motion.div 
              className="inline-block min-w-full"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                <div className="grid grid-cols-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium">
                  <div className="py-4 px-6 col-span-2 text-left">Plan Features</div>
                  <div className="py-4 px-4 text-center">Starter</div>
                  <div className="py-4 px-4 text-center">Basic</div>
                  <div className="py-4 px-4 text-center">Standard</div>
                  <div className="py-4 px-4 text-center">Ultimate</div>
                </div>
                
                {comparisonItems.map((item, rowIndex) => (
                  <div key={item.name} className={`grid grid-cols-6 ${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <div className="py-4 px-6 col-span-2 border-b border-gray-200">
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                    </div>
                    <div className="py-4 px-4 text-center border-b border-gray-200 text-gray-700">
                      {item.name === "CPU" && "2 vCores"}
                      {item.name === "RAM" && "4 GB"}
                      {item.name === "Storage" && "40 GB SSD"}
                      {item.name === "Bandwidth" && "1 TB"}
                      {item.name === "Security" && "Standard"}
                    </div>
                    <div className="py-4 px-4 text-center border-b border-gray-200 text-gray-700">
                      {item.name === "CPU" && "4 vCores"}
                      {item.name === "RAM" && "8 GB"}
                      {item.name === "Storage" && "60 GB SSD"}
                      {item.name === "Bandwidth" && "1 TB"}
                      {item.name === "Security" && "Enhanced"}
                    </div>
                    <div className="py-4 px-4 text-center border-b border-gray-200 text-gray-700">
                      {item.name === "CPU" && "8 vCores"}
                      {item.name === "RAM" && "16 GB"}
                      {item.name === "Storage" && "100 GB SSD"}
                      {item.name === "Bandwidth" && "2 TB"}
                      {item.name === "Security" && "Advanced"}
                    </div>
                    <div className="py-4 px-4 text-center border-b border-gray-200 text-gray-700">
                      {item.name === "CPU" && "16+ vCores"}
                      {item.name === "RAM" && "32+ GB"}
                      {item.name === "Storage" && "250+ GB SSD"}
                      {item.name === "Bandwidth" && "3+ TB"}
                      {item.name === "Security" && "Enterprise"}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Add Testimonials section before final CTA */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.span 
              className="inline-block text-blue-600 font-semibold mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              CLIENT TESTIMONIALS
            </motion.span>
            
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              What Our Customers Say
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Trusted by businesses and professionals worldwide
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Add FAQ section before final CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <motion.span 
                className="inline-block text-blue-600 font-semibold mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                FREQUENTLY ASKED QUESTIONS
              </motion.span>
              
              <motion.h2 
                className="text-4xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Common Questions
              </motion.h2>
            </div>
            
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <FaqItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-blue-500/30 mix-blend-overlay blur-3xl"></div>
          <div className="absolute bottom-1/3 -right-32 w-64 h-64 rounded-full bg-indigo-500/30 mix-blend-overlay blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready for High-Performance Remote Computing?
            </motion.h2>
            
            <motion.p 
              className="text-xl text-blue-100 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Get started with our RDP solutions today and transform the way you work remotely.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link 
                href="#plans" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-medium text-lg rounded-lg shadow-lg shadow-blue-700/25 hover:shadow-xl hover:shadow-blue-700/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Choose Your Plan
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 p-3 bg-blue-100 rounded-full">
                  <SparklesIcon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600 text-sm">Enterprise-grade hardware and software for reliable performance</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 p-3 bg-green-100 rounded-full">
                  <CheckBadgeIcon className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">99.9% Uptime</h3>
                <p className="text-gray-600 text-sm">Guaranteed reliability with redundant systems and constant monitoring</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 p-3 bg-purple-100 rounded-full">
                  <ShieldCheckIcon className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Access</h3>
                <p className="text-gray-600 text-sm">Enterprise-grade security with advanced protection and monitoring</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}