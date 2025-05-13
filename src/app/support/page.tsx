'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  QuestionMarkCircleIcon, 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  PaperAirplaneIcon,
  ArrowRightIcon
} from '@heroicons/react/24/solid';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

// Enhanced FAQ data with more technical details
const faqItems = [
  {
    question: "How do I connect to my NextGen RDP environment?",
    answer: "After provisioning, you'll receive secure login credentials via encrypted email. For Windows users, utilize the built-in Remote Desktop Connection application (mstsc.exe). macOS users should download Microsoft Remote Desktop from the App Store. For enhanced security, we recommend configuring multi-factor authentication through our client portal before your first connection."
  },
  {
    question: "What distinguishes NextGen RDP from standard VPS solutions?",
    answer: "NextGen RDP provides an optimized Windows Server environment with dedicated resources and our proprietary performance enhancements. Unlike traditional VPS solutions, our RDP environments feature GPU acceleration options, enterprise-grade security protocols, and guaranteed resource allocation. Our infrastructure is built on enterprise-grade hardware with NVMe storage, ensuring superior performance for demanding applications."
  },
  {
    question: "What is your infrastructure redundancy architecture?",
    answer: "Our enterprise infrastructure implements N+1 redundancy across all critical systems. We utilize multiple tier-1 bandwidth providers with automatic failover, redundant power systems with UPS and generator backup, and enterprise-grade storage solutions with real-time replication. All customer environments are backed up daily with 30-day retention, and we maintain a 99.9% uptime SLA for all services."
  },
  {
    question: "Can I customize my RDP environment beyond standard configurations?",
    answer: "Absolutely. Our Enterprise and Premium tier customers can request custom configurations including specialized software pre-installation, custom security policies, dedicated VLAN setup, and resource allocation adjustments. Contact our solutions architecture team for a personalized consultation on your specific requirements."
  },
  {
    question: "What security measures protect my NextGen RDP environment?",
    answer: "We implement comprehensive security at multiple levels: network-level DDoS protection, enterprise firewall systems, intrusion detection/prevention systems, and regular security audits. All connections are encrypted with TLS 1.3, and we enforce strong password policies. Our SOC team monitors systems 24/7 for suspicious activities, and all infrastructure receives security patches within 24 hours of release."
  },
  {
    question: "What is your service level agreement (SLA) for technical support?",
    answer: "Our Premium Support tier guarantees initial response within 30 minutes for critical issues, 2 hours for high-priority issues, and 8 hours for standard requests. We provide 24/7/365 technical support through multiple channels including our ticketing system, live chat, and emergency phone support. All support is handled by certified technicians with extensive experience in Windows Server environments and remote desktop technologies."
  }
];

// Support tiers with premium offerings
const supportTiers = [
  {
    name: "Standard Support",
    description: "Included with all plans",
    features: [
      "Email support (business hours)",
      "Knowledge base access",
      "Community forum access",
      "48-hour response time"
    ],
    icon: QuestionMarkCircleIcon,
    color: "bg-slate-100 text-slate-700"
  },
  {
    name: "Premium Support",
    description: "Available with Business plans",
    features: [
      "24/7 priority email support",
      "Live chat assistance",
      "4-hour response guarantee",
      "Dedicated support agent"
    ],
    icon: ShieldCheckIcon,
    color: "bg-sky-100 text-sky-700"
  },
  {
    name: "Enterprise Support",
    description: "For mission-critical deployments",
    features: [
      "24/7 phone & email support",
      "30-minute response for critical issues",
      "Dedicated technical account manager",
      "Monthly system health reviews"
    ],
    icon: ClockIcon,
    color: "bg-orange-100 text-orange-700"
  }
];

export default function SupportPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'Normal'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  // Add client-side rendering control
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'Normal'
      });
      setFormSubmitted(false);
    }, 5000);
  };

  // Return a simplified version during server-side rendering
  if (!isClient) {
    return <div className="min-h-screen bg-white font-sans">Loading...</div>;
  }

  return (
    <div className="bg-white font-sans">
      {/* Hero Section with more premium styling */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-full bg-orange-500 blur-xl opacity-20 animate-pulse"></div>
              <ChatBubbleLeftRightIcon className="relative h-16 w-16 text-orange-500 mx-auto mb-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-heading">
              Enterprise Support Solutions
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Dedicated technical expertise and resources to ensure your mission-critical RDP environments operate at peak performance.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a 
                href="#contact-form"
                className="inline-flex items-center justify-center rounded-md bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Support <ArrowRightIcon className="ml-2 h-4 w-4" />
              </motion.a>
              <motion.a 
                href="#faq"
                className="inline-flex items-center justify-center rounded-md bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 transition-all duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                View FAQs
              </motion.a>
            </div>
          </motion.div>
        </div>
        <div className="h-1 bg-gradient-to-r from-orange-500 via-sky-500 to-emerald-500"></div>
      </div>

      {/* Support Tiers Section */}
      <div className="py-20 sm:py-28 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Enterprise-Grade Support Tiers
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg leading-8 text-slate-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Choose the support level that matches your operational requirements
            </motion.p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {supportTiers.map((tier, index) => (
              <motion.div 
                key={tier.name}
                className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 rounded-xl ${tier.color} flex items-center justify-center mb-6`}>
                  <tier.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                <p className="text-sm text-slate-500 mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Support Channels Section */}
      <div className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Technical Support Card */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <PhoneIcon className="h-10 w-10 text-sky-600 mb-6 relative z-10" />
              <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">Technical Support</h3>
              <p className="text-slate-600 mb-6 relative z-10">
                Our certified engineers provide expert assistance for all technical issues.
              </p>
              <div className="space-y-4 mt-6 relative z-10">
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-slate-500 mr-3" />
                  <span className="text-slate-700 font-medium">+1 (800) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-slate-500 mr-3" />
                  <span className="text-slate-700 font-medium">support@nextgenrdp.com</span>
                </div>
                <div className="pt-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">Response time</span>
                  <p className="text-slate-700 mt-1">30 minutes (critical issues)</p>
                </div>
              </div>
            </motion.div>

            {/* Knowledge Base Card */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <DocumentTextIcon className="h-10 w-10 text-emerald-600 mb-6 relative z-10" />
              <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">Knowledge Resources</h3>
              <p className="text-slate-600 mb-6 relative z-10">
                Comprehensive documentation and guides for self-service solutions.
              </p>
              <div className="space-y-3 mt-6 relative z-10">
                <a href="#" className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium group">
                  <span>RDP Administration Guide</span>
                  <ArrowRightIcon className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </a>
                <a href="#" className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium group">
                  <span>Security Best Practices</span>
                  <ArrowRightIcon className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </a>
                <a href="#" className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium group">
                  <span>Performance Optimization</span>
                  <ArrowRightIcon className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>

            {/* Client Portal Card */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <QuestionMarkCircleIcon className="h-10 w-10 text-orange-600 mb-6 relative z-10" />
              <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">Client Portal</h3>
              <p className="text-slate-600 mb-6 relative z-10">
                Manage your services, view analytics, and access support tickets in one place.
              </p>
              <div className="mt-6 relative z-10">
                <a 
                  href="/client-area" 
                  className="inline-flex items-center justify-center rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200"
                >
                  Access Client Portal
                </a>
                <p className="text-xs text-slate-500 mt-3">
                  24/7 access to your account, billing, and support resources
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section with enhanced styling */}
      <div id="faq" className="py-20 sm:py-28 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-heading">
                Technical FAQs
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
                Detailed answers to common technical questions about our enterprise solutions
              </p>
            </motion.div>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqItems.map((faq, index) => (
              <motion.div 
                key={index}
                className="border-b border-slate-700/50 last:border-b-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <button
                  className="flex justify-between items-center w-full py-6 text-left"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-lg font-medium text-white">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${openFaqIndex === index ? 'bg-orange-500' : 'bg-slate-700'}`}>
                    {openFaqIndex === index ? (
                      <ChevronUpIcon className="h-5 w-5 text-white" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-white" />
                    )}
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                  }`}
                >
                  <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form Section with premium styling */}
      <div id="contact-form" className="py-20 sm:py-28 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-heading">
                Enterprise Support Request
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Submit your technical inquiry and our specialists will respond according to your service level agreement
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-xl border border-slate-200 p-8 sm:p-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {formSubmitted ? (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-3">Support Request Received</h3>
                  <p className="text-slate-600 text-lg max-w-md mx-auto">
                    Your request has been logged with our technical team. You will receive a confirmation email with your ticket number shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                      >
                        <option value="">Select issue type</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Account Management">Account Management</option>
                        <option value="Billing Inquiry">Billing Inquiry</option>
                        <option value="Security Concern">Security Concern</option>
                        <option value="Performance Issue">Performance Issue</option>
                        <option value="Feature Request">Feature Request</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-2">
                        Priority Level
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        required
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                      >
                        <option value="Low">Low - General Inquiry</option>
                        <option value="Normal">Normal - Minor Issue</option>
                        <option value="High">High - Service Degradation</option>
                        <option value="Critical">Critical - Service Outage</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      Detailed Description
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                      placeholder="Please provide as much detail as possible about your issue..."
                    />
                    <p className="mt-2 text-sm text-slate-500">
                      Include any relevant error messages, timestamps, and steps to reproduce the issue
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-slate-600">
                      I understand that support response times are based on my service level agreement
                    </label>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg hover:from-orange-500 hover:to-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200"
                    >
                      <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                      Submit Support Request
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enterprise Commitment Section */}
      <div className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-heading mb-6">
                Our Enterprise Support Commitment
              </h2>
              <p className="text-slate-300 leading-relaxed mb-8">
                NextGen RDP is committed to providing world-class technical support for businesses that depend on our infrastructure for mission-critical operations. Our support team consists of certified engineers with extensive experience in Windows Server environments, virtualization technologies, and enterprise networking.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4">
                  <div className="text-orange-400 font-bold text-4xl mb-2">99.9%</div>
                  <div className="text-slate-300">Uptime Guarantee</div>
                </div>
                <div className="p-4">
                  <div className="text-orange-400 font-bold text-4xl mb-2">24/7</div>
                  <div className="text-slate-300">Technical Support</div>
                </div>
                <div className="p-4">
                  <div className="text-orange-400 font-bold text-4xl mb-2">30min</div>
                  <div className="text-slate-300">Critical Response Time</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Technical Resources Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-heading">
                Technical Resources
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
                Access our comprehensive knowledge base to optimize your RDP environment
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Resource Card 1 */}
            <motion.div
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="h-40 bg-slate-100 rounded-lg mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">RDP Configuration Guide</h3>
              <p className="text-slate-600 mb-4">
                Comprehensive guide to optimizing your RDP environment for maximum performance and security.
              </p>
              <a href="#" className="text-orange-600 font-medium hover:text-orange-700 inline-flex items-center">
                View Guide
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>

            {/* Resource Card 2 */}
            <motion.div
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="h-40 bg-slate-100 rounded-lg mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Security Best Practices</h3>
              <p className="text-slate-600 mb-4">
                Learn how to secure your RDP environment against common threats and vulnerabilities.
              </p>
              <a href="#" className="text-orange-600 font-medium hover:text-orange-700 inline-flex items-center">
                View Guide
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>

            {/* Resource Card 3 */}
            <motion.div
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="h-40 bg-slate-100 rounded-lg mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Troubleshooting Guide</h3>
              <p className="text-slate-600 mb-4">
                Step-by-step solutions for common RDP connection and performance issues.
              </p>
              <a href="#" className="text-orange-600 font-medium hover:text-orange-700 inline-flex items-center">
                View Guide
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Support Team Section */}
      <div className="py-16 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-heading">
                Our Support Team
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
                Meet our certified technical experts dedicated to your success
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {/* Team Member 1 */}
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-32 h-32 bg-slate-200 rounded-full mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Alex Johnson</h3>
              <p className="text-orange-600 font-medium mb-2">Technical Support Lead</p>
              <p className="text-slate-600 text-sm max-w-xs">
                Microsoft Certified Solutions Expert with 10+ years of experience in Windows Server environments.
              </p>
            </motion.div>

            {/* Team Member 2 */}
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-32 h-32 bg-slate-200 rounded-full mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Sarah Chen</h3>
              <p className="text-orange-600 font-medium mb-2">Security Specialist</p>
              <p className="text-slate-600 text-sm max-w-xs">
                Certified Information Systems Security Professional specializing in remote desktop security.
              </p>
            </motion.div>

            {/* Team Member 3 */}
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-32 h-32 bg-slate-200 rounded-full mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Michael Rodriguez</h3>
              <p className="text-orange-600 font-medium mb-2">Network Engineer</p>
              <p className="text-slate-600 text-sm max-w-xs">
                Cisco Certified Network Professional with expertise in optimizing network performance for RDP.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 sm:py-24 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-heading mb-6">
                Ready for Enterprise-Grade Support?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses that trust NextGen RDP for their mission-critical remote desktop infrastructure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a 
                  href="#contact-form"
                  className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-orange-600 shadow-lg hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Support
                </motion.a>
                <motion.a 
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-md bg-orange-700 px-6 py-3 text-base font-semibold text-white hover:bg-orange-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 transition-all duration-200"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Enterprise Plans
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}