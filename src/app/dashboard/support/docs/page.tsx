"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BookOpenIcon, 
  ComputerDesktopIcon, 
  ServerIcon,
  LockClosedIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function DashboardDocsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Define documentation categories
  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn how to use your dashboard and manage your services',
      icon: BookOpenIcon,
      color: 'bg-blue-100 text-blue-600',
      articles: [
        { id: 'dashboard-overview', title: 'Dashboard Overview', popular: true },
        { id: 'account-settings', title: 'Account Settings', popular: false },
        { id: 'understanding-metrics', title: 'Understanding Your Metrics', popular: true },
      ]
    },
    {
      id: 'rdp-services',
      title: 'RDP Services',
      description: 'Manage and configure your remote desktop servers',
      icon: ComputerDesktopIcon,
      color: 'bg-purple-100 text-purple-600',
      articles: [
        { id: 'rdp-connection', title: 'Connecting to Your RDP Server', popular: true },
        { id: 'rdp-performance', title: 'Optimizing RDP Performance', popular: false },
        { id: 'rdp-software', title: 'Installing Software on RDP', popular: false },
      ]
    },
    {
      id: 'vps-services',
      title: 'VPS Services',
      description: 'Configure and manage your virtual private servers',
      icon: ServerIcon,
      color: 'bg-emerald-100 text-emerald-600',
      articles: [
        { id: 'vps-ssh', title: 'SSH Access to Your VPS', popular: true },
        { id: 'vps-backup', title: 'Backing Up Your VPS', popular: false },
        { id: 'vps-scaling', title: 'Scaling Your VPS Resources', popular: true },
      ]
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Secure your account and services',
      icon: LockClosedIcon,
      color: 'bg-red-100 text-red-600',
      articles: [
        { id: 'security-2fa', title: 'Setting Up Two-Factor Authentication', popular: true },
        { id: 'security-passwords', title: 'Password Best Practices', popular: false },
        { id: 'security-access', title: 'Managing Access Controls', popular: false },
      ]
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      description: 'Manage your subscriptions, invoices, and payment methods',
      icon: CreditCardIcon,
      color: 'bg-amber-100 text-amber-600',
      articles: [
        { id: 'billing-invoices', title: 'Understanding Your Invoices', popular: false },
        { id: 'billing-payment-methods', title: 'Managing Payment Methods', popular: true },
        { id: 'billing-subscriptions', title: 'Subscription Management', popular: false },
      ]
    },
    {
      id: 'support',
      title: 'Support',
      description: 'Get help and create support tickets',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-sky-100 text-sky-600',
      articles: [
        { id: 'support-tickets', title: 'Creating Support Tickets', popular: true },
        { id: 'support-priority', title: 'Support Priority Levels', popular: false },
        { id: 'support-faq', title: 'Frequently Asked Questions', popular: true },
      ]
    }
  ];

  // Get all articles across categories
  const allArticles = categories.flatMap(category => 
    category.articles.map(article => ({
      ...article,
      categoryId: category.id,
      categoryTitle: category.title,
      icon: category.icon,
      color: category.color
    }))
  );

  // Filter categories and articles based on search
  const filteredCategories = searchQuery 
    ? categories.filter(category => 
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.articles.some(article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : categories;

  const filteredArticles = searchQuery
    ? allArticles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.categoryTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allArticles.filter(article => article.popular);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentation</h1>
        <p className="text-gray-600 max-w-3xl">
          Find answers to your questions about using NextGenRDP services and managing your account.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </motion.div>

      {/* Popular Articles - Only shown when not searching */}
      {!searchQuery && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <motion.h2 variants={itemVariants} className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <StarIcon className="h-5 w-5 text-amber-400 mr-2" />
            Popular Articles
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <motion.div
                key={`${article.categoryId}-${article.id}`}
                variants={itemVariants}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <Link href={`/dashboard/support/docs/${article.categoryId}/${article.id}`}>
                  <div className="p-5">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-md ${article.color} mr-4`}>
                        {React.createElement(article.icon, { className: "h-5 w-5" })}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{article.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{article.categoryTitle}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Categories and Articles */}
      <div>
        {searchQuery ? (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Search Results for "{searchQuery}"
            </h2>
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <motion.div
                    key={`${article.categoryId}-${article.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Link href={`/dashboard/support/docs/${article.categoryId}/${article.id}`}>
                      <div className="p-5">
                        <div className="flex items-start">
                          <div className={`p-2 rounded-md ${article.color} mr-4`}>
                            {React.createElement(article.icon, { className: "h-5 w-5" })}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{article.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{article.categoryTitle}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-500 mb-4">No articles found matching your search criteria.</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear search
                </button>
              </div>
            )}
          </>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.h2 variants={itemVariants} className="text-xl font-semibold text-gray-900 mb-6">
              Browse by Category
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-md ${category.color} mr-4`}>
                        {React.createElement(category.icon, { className: "h-6 w-6" })}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-5">{category.description}</p>
                    <ul className="space-y-3 mb-5">
                      {category.articles.map((article) => (
                        <li key={article.id}>
                          <Link
                            href={`/dashboard/support/docs/${category.id}/${article.id}`}
                            className="flex items-center text-gray-700 hover:text-blue-600 group"
                          >
                            <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-500 mr-2" />
                            <span>{article.title}</span>
                            {article.popular && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                Popular
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/dashboard/support/docs/${category.id}`}
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                    >
                      View all articles
                      <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Can't find what you need section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200"
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Need more help?</h3>
            <p className="text-gray-600">
              If you can't find what you're looking for, our support team is ready to help.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/support/tickets/new"
              className="inline-flex justify-center items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create a Support Ticket
            </Link>
            <Link
              href="/support/help-docs"
              className="inline-flex justify-center items-center px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Full Documentation
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 