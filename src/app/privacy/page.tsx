'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LockClosedIcon, DocumentTextIcon, EyeIcon, ServerIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PrivacyPage() {
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
      id: 'information',
      title: 'Information We Collect',
      content: [
        'We collect personal information that you voluntarily provide when registering for an account, including your name, email address, billing information, and any other information you choose to provide.',
        'We automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring website, pages viewed, and the dates/times of your visits.',
        'For service monitoring and improvement, we collect usage data such as resource utilization, connection timestamps, and performance metrics of our RDP and VPS services.'
      ]
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      content: [
        'We use your information to provide and improve our services, process payments, send administrative emails, and respond to your inquiries and support requests.',
        'Your usage data helps us monitor system health, optimize performance, detect unusual patterns that may indicate security issues, and develop new features based on user behavior.',
        'We may use your email address to send you promotional content about our services, but you can opt out of marketing communications at any time while still receiving essential service notifications.'
      ]
    },
    {
      id: 'sharing',
      title: 'Information Sharing and Disclosure',
      content: [
        'We do not sell, rent, or trade your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and services, but they are obligated to keep your information confidential.',
        'We may disclose your information if required by law or if we believe that such action is necessary to comply with legal processes or protect our rights, property, or safety.',
        'In the event of a business transition (such as a merger or acquisition), your information may be transferred as part of the company assets, but subject to the same privacy commitments.'
      ]
    },
    {
      id: 'security',
      title: 'Data Security',
      content: [
        'We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.',
        'Data transmitted between your browser and our service is encrypted using TLS/SSL technology. Access to our internal systems is restricted and governed by our security protocols.',
        'While we strive to use commercially acceptable means to protect your data, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.'
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking Technologies',
      content: [
        'We use cookies and similar tracking technologies to collect information about your browsing activities and to remember your preferences. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.',
        'We use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device until you delete them or they expire) to provide you with a more personalized and efficient experience.',
        'Our website may use third-party analytics services that use cookies to help us analyze how users use our site and to enhance your experience when visiting our website.'
      ]
    },
    {
      id: 'rights',
      title: 'Your Data Rights',
      content: [
        'You have the right to access, correct, update, or request deletion of your personal information. You can manage your account settings or contact us directly to exercise these rights.',
        'Depending on your location, you may have additional rights under applicable data protection laws, such as the right to object to processing or the right to data portability.',
        'We retain your personal information only for as long as necessary to provide the services you have requested, or for other essential purposes such as complying with our legal obligations or resolving disputes.'
      ]
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 py-20 px-4">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-5">
              <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                <LockClosedIcon className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">Privacy Policy</h1>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              How we handle your data and protect your privacy. We are committed to transparency and the security of your information.
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
              At NextGenRDP, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
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
                    className="text-blue-600 hover:text-blue-800 flex items-center"
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
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  {index === 0 ? (
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  ) : index === 1 ? (
                    <EyeIcon className="h-6 w-6 text-blue-600" />
                  ) : index === 3 ? (
                    <LockClosedIcon className="h-6 w-6 text-blue-600" />
                  ) : index === 4 ? (
                    <ServerIcon className="h-6 w-6 text-blue-600" />
                  ) : (
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
            <p className="text-gray-700 mt-4">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@nextgenrdp.com" className="text-blue-600 hover:text-blue-800">
                privacy@nextgenrdp.com
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
              href="/terms" 
              className="p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition duration-300"
            >
              <h4 className="text-lg font-bold text-gray-800 mb-2">Terms of Service</h4>
              <p className="text-gray-600">Read our terms and conditions for using NextGenRDP services.</p>
            </Link>
            <Link 
              href="/security" 
              className="p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition duration-300"
            >
              <h4 className="text-lg font-bold text-gray-800 mb-2">Security Practices</h4>
              <p className="text-gray-600">Learn about our security measures and data protection protocols.</p>
            </Link>
            <Link 
              href="/contact" 
              className="p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition duration-300"
            >
              <h4 className="text-lg font-bold text-gray-800 mb-2">Contact Support</h4>
              <p className="text-gray-600">Questions about your data? Our team is ready to help.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 