"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpenIcon, 
  ServerIcon, 
  QuestionMarkCircleIcon, 
  CommandLineIcon, 
  ShieldCheckIcon, 
  CreditCardIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  TagIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Define documentation categories
  const categories = [
    { id: 'all', name: 'All Docs', icon: BookOpenIcon },
    { id: 'getting-started', name: 'Getting Started', icon: TagIcon },
    { id: 'rdp', name: 'RDP Services', icon: ServerIcon },
    { id: 'vps', name: 'VPS Services', icon: CommandLineIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: QuestionMarkCircleIcon },
  ];
  
  // Define documentation articles
  const articles = [
    {
      id: 1,
      title: 'Introduction to NextGenRDP',
      description: 'Learn about our platform and the available services',
      category: 'getting-started',
      popular: true,
      timeToRead: '3 min'
    },
    {
      id: 2,
      title: 'Creating Your First RDP Instance',
      description: 'Step-by-step guide to setting up your first remote desktop',
      category: 'rdp',
      popular: true,
      timeToRead: '5 min'
    },
    {
      id: 3,
      title: 'VPS Configuration Best Practices',
      description: 'Optimize your virtual private server for performance and security',
      category: 'vps',
      popular: true,
      timeToRead: '7 min'
    },
    {
      id: 4,
      title: 'Setting Up Two-Factor Authentication',
      description: 'Enhance your account security with 2FA',
      category: 'security',
      popular: false,
      timeToRead: '4 min'
    },
    {
      id: 5,
      title: 'Understanding Your Invoice',
      description: 'Detailed explanation of billing items and charges',
      category: 'billing',
      popular: false,
      timeToRead: '3 min'
    },
    {
      id: 6,
      title: 'Troubleshooting Connection Issues',
      description: 'Common connection problems and how to resolve them',
      category: 'troubleshooting',
      popular: true,
      timeToRead: '6 min'
    },
    {
      id: 7,
      title: 'RDP Security Hardening',
      description: 'Advanced security configurations for your remote desktop',
      category: 'security',
      popular: false,
      timeToRead: '8 min'
    },
    {
      id: 8,
      title: 'Upgrading Your Service Plan',
      description: 'How to upgrade or downgrade your subscription',
      category: 'billing',
      popular: false,
      timeToRead: '2 min'
    },
    {
      id: 9,
      title: 'Installing Software on Your VPS',
      description: 'Best practices for installing and managing software',
      category: 'vps',
      popular: false,
      timeToRead: '5 min'
    },
    {
      id: 10,
      title: 'Backup and Restore Procedures',
      description: 'How to backup and restore your data',
      category: 'troubleshooting',
      popular: false,
      timeToRead: '4 min'
    },
    {
      id: 11,
      title: 'RDP Performance Optimization',
      description: 'Tips to improve the performance of your remote desktop',
      category: 'rdp',
      popular: false,
      timeToRead: '5 min'
    },
    {
      id: 12,
      title: 'Account Management',
      description: 'Managing users, permissions, and account settings',
      category: 'getting-started',
      popular: false,
      timeToRead: '4 min'
    }
  ];
  
  // Filter articles based on search query and active category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
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
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };
  
  // Group documentation for popular section
  const popularArticles = articles.filter(article => article.popular);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 p-4 rounded-full">
                <DocumentTextIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-extrabold mb-6">Documentation</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Find comprehensive guides and documentation to help you start working with NextGenRDP as quickly as possible.
            </p>
            
            {/* Search Box */}
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-blue-300" />
              </div>
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Categories Navigation */}
        <div className="mb-12 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 pb-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === category.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {React.createElement(category.icon, { className: "h-5 w-5 mr-2" })}
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Popular Documentation - Only shown when not filtering */}
        {(activeCategory === 'all' && !searchQuery) && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-800 mb-6">
              Popular Documentation
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-6">
              {popularArticles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <Link 
                    href={`/support/help-docs/${article.category}/${article.id}`}
                    className="block p-6"
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        {React.createElement(
                          categories.find(c => c.id === article.category)?.icon || DocumentTextIcon, 
                          { className: "h-6 w-6 text-blue-600" }
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{article.title}</h3>
                        <p className="text-gray-600 mb-3">{article.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {article.timeToRead} read
                          </span>
                          <span className="flex items-center ml-4">
                            <TagIcon className="h-4 w-4 mr-1" />
                            {categories.find(c => c.id === article.category)?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* All Documentation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-800 mb-6">
            {searchQuery ? 'Search Results' : activeCategory === 'all' ? 'All Documentation' : categories.find(c => c.id === activeCategory)?.name + ' Documentation'}
          </motion.h2>
          
          {filteredArticles.length === 0 ? (
            <motion.div variants={itemVariants} className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                <QuestionMarkCircleIcon className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No documentation found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any documentation matching your search criteria.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <Link 
                    href={`/support/help-docs/${article.category}/${article.id}`}
                    className="block p-6"
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        {React.createElement(
                          categories.find(c => c.id === article.category)?.icon || DocumentTextIcon, 
                          { className: "h-6 w-6 text-blue-600" }
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{article.title}</h3>
                        <p className="text-gray-600 mb-3">{article.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {article.timeToRead} read
                          </span>
                          <span className="flex items-center ml-4">
                            <TagIcon className="h-4 w-4 mr-1" />
                            {categories.find(c => c.id === article.category)?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Need Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Can't find what you need?
              </h3>
              <p className="text-gray-600">
                Our support team is ready to assist you with any questions.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/contact" 
                className="bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center"
              >
                Contact Support
              </Link>
              <Link 
                href="/dashboard/support/tickets/new" 
                className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Create Ticket
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ClockIcon component since it wasn't imported
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      {...props}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
  );
} 