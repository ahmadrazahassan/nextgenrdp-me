'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, DocumentTextIcon, ScaleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function TermsPage() {
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
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const sections = [
    {
      id: 'services',
      title: 'Services and Subscriptions',
      content: [
        'NextGenRDP provides Remote Desktop Protocol (RDP) and Virtual Private Server (VPS) hosting services. By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.',
        'Subscription to our services will commence upon receipt of payment and provision of the service. All subscriptions are pre-paid, and renewal is contingent upon receipt of payment for the upcoming service period.',
        'We reserve the right to modify service offerings, introduce new features, or discontinue existing features at our discretion to maintain quality and security standards.'
      ]
    },
    {
      id: 'payments',
      title: 'Payments and Billing',
      content: [
        'All fees are due in advance of the service period. Subscription fees are non-refundable except as expressly provided in these Terms.',
        'We accept payments via major credit cards, PayPal, and select cryptocurrencies. Payment processing is handled by trusted third-party payment processors.',
        'Price changes will be communicated to customers at least 30 days in advance of implementation. Continued use of our services following a price change constitutes acceptance of the new pricing.'
      ]
    },
    {
      id: 'usage',
      title: 'Acceptable Use Policy',
      content: [
        'You agree not to use our services for any illegal activities or in any manner that could damage, disable, overburden, or impair our services.',
        'Prohibited activities include but are not limited to: distribution of malware, unauthorized access to other systems, distribution of illegal content, spamming, crypto mining without explicit permission, and any activities that violate applicable laws.',
        'We reserve the right to suspend or terminate services without notice if we reasonably believe you have violated these terms.'
      ]
    },
    {
      id: 'data',
      title: 'Data and Privacy',
      content: [
        'We collect and process your data in accordance with our Privacy Policy. By using our services, you consent to such processing and you warrant that all data provided by you is accurate.',
        'You maintain ownership of your data. We do not monitor the content of your virtual machines or RDP sessions except when required for troubleshooting or as required by law.',
        'We implement reasonable security measures to protect your data, but no system is perfectly secure. You are responsible for maintaining backups of your critical data.'
      ]
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      content: [
        'Our services are provided "as is" without any warranties, expressed or implied. We do not guarantee that our services will be uninterrupted, timely, secure, or error-free.',
        'In no event shall NextGenRDP be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.',
        'Our total liability for any claims under these terms shall not exceed the amount paid by you to NextGenRDP for the service period in which the claim arises.'
      ]
    },
    {
      id: 'termination',
      title: 'Term and Termination',
      content: [
        'These Terms remain in effect for the duration of your use of our services. Either party may terminate these Terms by providing written notice to the other party.',
        'Upon termination, your access to the services will cease, and we may delete your data after a reasonable retention period as outlined in our data retention policy.',
        'Sections related to intellectual property rights, limitation of liability, and any other terms that by their nature should survive termination shall survive.'
      ]
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-20 px-4">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-5">
              <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                <DocumentTextIcon className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">Terms of Service</h1>
            <p className="text-lg text-indigo-100 max-w-3xl mx-auto">
              Our commitment to transparency, security, and exceptional service. Please read these terms carefully.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Last Updated */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-4xl py-4 px-4">
          <p className="text-sm text-gray-500">
            Last updated: July 1, 2025
          </p>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="prose prose-lg max-w-none"
        >
          <motion.div variants={itemVariants}>
            <p className="text-gray-700 mb-8">
              These Terms of Service ("Terms") govern your access to and use of NextGenRDP's website, products, and services. By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.
            </p>
          </motion.div>
          
          {/* Table of Contents */}
          <motion.div 
            variants={itemVariants}
            className="my-8 p-5 bg-gray-50 rounded-lg border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Table of Contents</h2>
            <ul className="space-y-2">
              {sections.map(section => (
                <li key={section.id}>
                  <a 
                    href={`#${section.id}`} 
                    className="text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <span className="mr-2">→</span> {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Sections */}
          {sections.map((section, index) => (
            <motion.section 
              key={section.id} 
              id={section.id}
              variants={itemVariants}
              className="mb-12 scroll-mt-20"
            >
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                  {index === 0 ? (
                    <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />
                  ) : index === 2 ? (
                    <ScaleIcon className="h-6 w-6 text-indigo-600" />
                  ) : (
                    <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
              </div>
              <div className="space-y-4 pl-12">
                {section.content.map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.section>
          ))}
          
          {/* Closing */}
          <motion.div variants={itemVariants} className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@nextgenrdp.com" className="text-indigo-600 hover:text-indigo-800">
                legal@nextgenrdp.com
              </a>
              .
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Related Links */}
      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Related Resources</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link 
              href="/privacy" 
              className="p-6 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition duration-300"
            >
              <h4 className="text-lg font-bold text-gray-800 mb-2">Privacy Policy</h4>
              <p className="text-gray-600">Learn how we handle your data and protect your privacy.</p>
            </Link>
            <Link 
              href="/about" 
              className="p-6 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition duration-300"
            >
              <h4 className="text-lg font-bold text-gray-800 mb-2">About Us</h4>
              <p className="text-gray-600">Our mission, vision, and the team behind NextGenRDP.</p>
            </Link>
            <Link 
              href="/contact" 
              className="p-6 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition duration-300"
            >
              <h4 className="text-lg font-bold text-gray-800 mb-2">Contact Support</h4>
              <p className="text-gray-600">Need help? Our support team is ready to assist you.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 