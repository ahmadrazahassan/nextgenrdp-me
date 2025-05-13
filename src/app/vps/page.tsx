// src/app/vps/page.tsx
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
import { FaWindows, FaServer, FaShieldAlt, FaHeadset, FaDatabase, FaLock } from 'react-icons/fa';

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

// Import plans module
import * as plansModule from '@/data/plans.js';
// Access the vpsPlans array directly from the module
const vpsPlans = plansModule.vpsPlans || [];

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

// VPS Features
const features: FeatureProps[] = [
  {
    icon: RocketLaunchIcon,
    title: "High-Performance Resources",
    description: "Enterprise-grade infrastructure with dedicated vCPUs, fast RAM, and NVMe SSD storage for maximum performance.",
    color: "bg-gradient-to-r from-blue-600 to-indigo-600"
  },
  {
    icon: FaWindows,
    title: "Windows OS Options",
    description: "Choose from Windows 10 or Windows Server 2022 with full administrator access and complete customization control.",
    color: "bg-gradient-to-r from-sky-500 to-blue-600"
  },
  {
    icon: FaDatabase,
    title: "Scalable Storage",
    description: "NVMe SSD storage solutions with the ability to scale as your needs grow, supporting any workload.",
    color: "bg-gradient-to-r from-indigo-500 to-purple-600"
  },
  {
    icon: GlobeAltIcon,
    title: "Global Network Access",
    description: "Connect from anywhere with minimal latency through our global network infrastructure and high bandwidth allocation.",
    color: "bg-gradient-to-r from-green-500 to-teal-600"
  },
  {
    icon: FaLock,
    title: "Advanced Security",
    description: "Enterprise-level security with DDoS protection, firewalls, and automated security updates to keep your VPS safe.",
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
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
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
export default function VpsPage() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Card grid styles that change based on number of plans
  const gridColsClass = vpsPlans.length <= 3 
    ? "md:grid-cols-2 lg:grid-cols-3" 
    : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  // Add scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scrollIndicatorWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // FAQs data
  const faqs = [
    {
      question: "What is a VPS and how does it differ from shared hosting?",
      answer: "A Virtual Private Server (VPS) is a virtualized server that simulates a dedicated server within a shared hosting environment. Unlike shared hosting, a VPS gives you dedicated resources (CPU, RAM, storage) and complete control over your server environment, including choice of operating system, software installations, and configurations."
    },
    {
      question: "Can I install any software on my VPS?",
      answer: "Yes, with full administrator access, you can install virtually any software that's compatible with your chosen operating system. This includes web servers, databases, custom applications, development tools, and more."
    },
    {
      question: "How secure are your VPS solutions?",
      answer: "Our VPS solutions come with enterprise-grade security including DDoS protection, advanced firewalls, regular security patches, and the option for custom security configurations. We also provide tools for implementing additional security measures like 2FA."
    },
    {
      question: "What's the difference between your Windows 10 and Windows Server VPS options?",
      answer: "Windows 10 VPS is ideal for desktop applications, remote work, and personal use, offering a familiar interface. Windows Server VPS is optimized for server applications, supports more concurrent connections, and includes features specifically designed for server workloads and business applications."
    }
  ];
  
  // Testimonials data
  const testimonials = [
    {
      quote: "The performance of NextGen's VPS has been outstanding for our digital marketing tools. The ability to scale resources as needed has been a game-changer for our business.",
      author: "Thomas Reynolds",
      role: "Marketing Director",
      company: "Digital Innovations"
    },
    {
      quote: "Running multiple development environments on these VPS instances has been smooth and reliable. The NVMe storage makes everything lightning fast.",
      author: "Alicia Zhang",
      role: "Lead Developer",
      company: "TechSoft Solutions"
    },
    {
      quote: "The customer support team helped us migrate our entire infrastructure to their VPS platform with zero downtime. Truly impressive service.",
      author: "Robert Wilson",
      role: "IT Manager",
      company: "Global Retail Group"
    }
  ];

  return (
    <div className="bg-gray-50 font-sans">
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-green-600 z-50 origin-left"
        style={{ scaleX: scrollIndicatorWidth }}
      />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-green-200/30 mix-blend-multiply blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-teal-200/30 mix-blend-multiply blur-3xl"></div>
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
              <span className="bg-green-50 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full inline-flex items-center">
                <BoltIcon className="w-4 h-4 mr-1.5" />
                Powerful Virtual Infrastructure
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Premium <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600">VPS Solutions</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
            >
              High-performance Virtual Private Servers with dedicated resources, 
              multiple OS options, and enterprise-grade security for any workload.
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
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium rounded-lg shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-200"
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
              
              {/* Server visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 p-6">
                  {[1, 2, 3].map((server) => (
                    <div key={server} className="h-[200px] bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg shadow-md overflow-hidden border border-gray-300 flex flex-col">
                      {/* Server header */}
                      <div className="h-6 bg-gradient-to-r from-green-600 to-teal-700 px-2 flex items-center">
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
                            <div className={`w-1.5 h-1.5 rounded-full ${slot % 2 === 0 ? 'bg-green-500' : 'bg-teal-500'} animate-pulse`}></div>
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
                  <line x1="30%" y1="40%" x2="70%" y2="40%" stroke="rgba(20, 184, 166, 0.2)" strokeWidth="2" strokeDasharray="4 2" />
                  <line x1="30%" y1="60%" x2="70%" y2="60%" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="2" strokeDasharray="4 2" />
                </svg>
              </div>
              
              {/* Pulse effects */}
              <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-green-600/10"></div>
              <div className="absolute bottom-1/3 right-1/3 w-12 h-12 rounded-full bg-green-600/10 animate-ping" style={{ animationDuration: '3s' }}></div>
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

      {/* "Why Choose Us" section */}
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
                    Why Choose Our <span className="text-green-600">VPS Solutions</span>
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Our Virtual Private Servers are designed for professionals who demand flexibility, performance, and reliability.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      { icon: BoltIcon, text: "Optimized for maximum performance with NVMe SSD storage", color: "text-green-600" },
                      { icon: ShieldCheckIcon, text: "Advanced security measures with DDoS protection", color: "text-teal-600" },
                      { icon: ClockIcon, text: "99.9% uptime guarantee with redundant infrastructure", color: "text-emerald-600" },
                      { icon: ArrowPathIcon, text: "Flexible scaling options to grow with your needs", color: "text-cyan-600" }
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
                  className="bg-gradient-to-br from-green-600 to-teal-700 rounded-xl overflow-hidden shadow-xl p-6 md:p-8"
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
                    <PerformanceMetric label="CPU Performance" value="Up to 16 vCores" color="bg-green-500" />
                    <PerformanceMetric label="Memory Speed" value="3200MHz DDR4" color="bg-teal-500" />
                    <PerformanceMetric label="SSD Storage" value="NVMe Technology" color="bg-emerald-500" />
                    <PerformanceMetric label="Network Throughput" value="10 Gbps" color="bg-cyan-500" />
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
              className="inline-block text-green-600 font-semibold mb-2"
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
              Virtual Server Excellence
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Our high-performance VPS solutions deliver exceptional flexibility, power, 
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
          <div className="bg-green-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md">
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
              VPS Plans for Every Need
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              From small business applications to high-traffic websites and applications, 
              we have the perfect VPS solution for you.
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
              vpsPlans.map((plan) => (
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
      <PromoCtaSection promoCode="VPS20" discount="20%" />

      {/* Testimonials section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.span 
              className="inline-block text-green-600 font-semibold mb-2"
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
      
      {/* FAQ section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <motion.span 
                className="inline-block text-green-600 font-semibold mb-2"
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
      <section className="py-24 bg-gradient-to-r from-green-600 to-teal-700 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-green-500/30 mix-blend-overlay blur-3xl"></div>
          <div className="absolute bottom-1/3 -right-32 w-64 h-64 rounded-full bg-teal-500/30 mix-blend-overlay blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready for High-Performance Virtual Computing?
            </motion.h2>
            
            <motion.p 
              className="text-xl text-green-100 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Get started with our VPS solutions today and experience the power of dedicated virtual resources.
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
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 font-medium text-lg rounded-lg shadow-lg shadow-green-700/25 hover:shadow-xl hover:shadow-green-700/30 hover:-translate-y-0.5 transition-all duration-300"
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
                <div className="mb-4 p-3 bg-green-100 rounded-full">
                  <SparklesIcon className="h-7 w-7 text-green-600" />
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
                <div className="mb-4 p-3 bg-teal-100 rounded-full">
                  <CheckBadgeIcon className="h-7 w-7 text-teal-600" />
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
                <div className="mb-4 p-3 bg-emerald-100 rounded-full">
                  <ShieldCheckIcon className="h-7 w-7 text-emerald-600" />
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