'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  ServerIcon, 
  CommandLineIcon, 
  WrenchScrewdriverIcon, 
  ShieldCheckIcon, 
  CreditCardIcon,
  QuestionMarkCircleIcon,
  ArrowLongRightIcon,
  ArrowUturnLeftIcon,
  ChevronRightIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { BookOpenIcon } from '@heroicons/react/24/solid';

// Document category and items interface
interface DocCategory {
  id: string;
  name: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  description: string;
  documents: DocItem[];
}

interface DocItem {
  id: string;
  title: string;
  excerpt: string;
  lastUpdated: string;
  slug: string;
}

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredDocs, setFilteredDocs] = useState<DocItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<DocItem[]>([]);

  // Mock categories and documentation items
  const docCategories: DocCategory[] = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: DocumentTextIcon,
      description: 'Essential guides to begin using our platform',
      documents: [
        {
          id: 'gs-1',
          title: 'Platform Overview',
          excerpt: 'Learn the basics of NextGenRDP platform and its capabilities.',
          lastUpdated: '2023-12-15',
          slug: 'platform-overview'
        },
        {
          id: 'gs-2',
          title: 'Creating Your Account',
          excerpt: 'Step-by-step guide to setting up your NextGenRDP account.',
          lastUpdated: '2023-12-10',
          slug: 'create-account'
        },
        {
          id: 'gs-3',
          title: 'First-Time Setup',
          excerpt: 'Configure your environment for the first time use.',
          lastUpdated: '2023-11-28',
          slug: 'first-time-setup'
        }
      ]
    },
    {
      id: 'rdp-solutions',
      name: 'RDP Solutions',
      icon: ServerIcon,
      description: 'Everything about our Remote Desktop services',
      documents: [
        {
          id: 'rdp-1',
          title: 'Connecting to Your RDP',
          excerpt: 'Learn how to connect to your remote desktop from different devices.',
          lastUpdated: '2023-12-12',
          slug: 'connect-to-rdp'
        },
        {
          id: 'rdp-2',
          title: 'RDP Security Best Practices',
          excerpt: 'Keep your remote desktop secure with these recommended settings.',
          lastUpdated: '2023-11-20',
          slug: 'rdp-security'
        },
        {
          id: 'rdp-3',
          title: 'Performance Optimization',
          excerpt: 'Tips to maximize your RDP performance and reduce latency.',
          lastUpdated: '2023-10-15',
          slug: 'rdp-performance'
        }
      ]
    },
    {
      id: 'vps-solutions',
      name: 'VPS Solutions',
      icon: CommandLineIcon,
      description: 'Guides for managing your Virtual Private Servers',
      documents: [
        {
          id: 'vps-1',
          title: 'VPS Management Basics',
          excerpt: 'Essential commands and procedures for managing your VPS.',
          lastUpdated: '2023-12-01',
          slug: 'vps-basics'
        },
        {
          id: 'vps-2',
          title: 'Setting Up Web Hosting',
          excerpt: 'Configure your VPS for hosting websites and web applications.',
          lastUpdated: '2023-11-10',
          slug: 'vps-web-hosting'
        },
        {
          id: 'vps-3',
          title: 'Server Monitoring Tools',
          excerpt: 'Monitor your VPS performance and uptime using our recommended tools.',
          lastUpdated: '2023-10-22',
          slug: 'vps-monitoring'
        }
      ]
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      icon: WrenchScrewdriverIcon,
      description: 'Solutions for common issues and errors',
      documents: [
        {
          id: 'ts-1',
          title: 'Connection Problems',
          excerpt: 'Diagnose and fix common connection issues with your services.',
          lastUpdated: '2023-12-05',
          slug: 'connection-problems'
        },
        {
          id: 'ts-2',
          title: 'Performance Issues',
          excerpt: 'Solutions for slow performance or high resource usage.',
          lastUpdated: '2023-11-15',
          slug: 'performance-issues'
        },
        {
          id: 'ts-3',
          title: 'Error Messages Explained',
          excerpt: 'Common error messages and how to resolve them.',
          lastUpdated: '2023-10-30',
          slug: 'error-messages'
        }
      ]
    },
    {
      id: 'security',
      name: 'Security',
      icon: ShieldCheckIcon,
      description: 'Protecting your services and data',
      documents: [
        {
          id: 'sec-1',
          title: 'Two-Factor Authentication',
          excerpt: 'Setting up and using 2FA to secure your account.',
          lastUpdated: '2023-12-03',
          slug: 'two-factor-auth'
        },
        {
          id: 'sec-2',
          title: 'Firewall Configuration',
          excerpt: 'Configuring firewalls to protect your servers from unauthorized access.',
          lastUpdated: '2023-11-08',
          slug: 'firewall-config'
        },
        {
          id: 'sec-3',
          title: 'Security Auditing',
          excerpt: 'Performing security audits to identify vulnerabilities.',
          lastUpdated: '2023-10-17',
          slug: 'security-auditing'
        }
      ]
    },
    {
      id: 'billing',
      name: 'Billing & Payments',
      icon: CreditCardIcon,
      description: 'Information about billing cycles, payments, and invoices',
      documents: [
        {
          id: 'bill-1',
          title: 'Payment Methods',
          excerpt: 'Available payment methods and how to update your payment information.',
          lastUpdated: '2023-12-07',
          slug: 'payment-methods'
        },
        {
          id: 'bill-2',
          title: 'Understanding Your Invoice',
          excerpt: 'A guide to reading and understanding your monthly invoice.',
          lastUpdated: '2023-11-12',
          slug: 'understand-invoice'
        },
        {
          id: 'bill-3',
          title: 'Billing Cycles Explained',
          excerpt: 'How our billing cycles work and when to expect charges.',
          lastUpdated: '2023-10-25',
          slug: 'billing-cycles'
        }
      ]
    }
  ];

  // Get all docs across all categories
  const allDocs = docCategories.flatMap(category => category.documents);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDocs([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase();
    const results = allDocs.filter(
      doc => 
        doc.title.toLowerCase().includes(query) || 
        doc.excerpt.toLowerCase().includes(query)
    );
    
    setFilteredDocs(results);
  }, [searchQuery]);

  // Simulate loading recently viewed docs from local storage
  useEffect(() => {
    // In a real app, you would get this from localStorage or a user's profile
    const mockRecentlyViewed = [
      allDocs[0],
      allDocs[5],
      allDocs[10]
    ];
    
    setRecentlyViewed(mockRecentlyViewed);
  }, []);

  // Get documents to display based on active category or search
  const getDisplayedDocs = () => {
    if (isSearching) {
      return filteredDocs;
    }
    
    if (activeCategory) {
      const category = docCategories.find(cat => cat.id === activeCategory);
      return category ? category.documents : [];
    }
    
    return [];
  };

  const displayedDocs = getDisplayedDocs();

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
      transition: { duration: 0.3 }
    }
  };

  const pageTitle = isSearching 
    ? `Search Results for "${searchQuery}"`
    : activeCategory
      ? docCategories.find(cat => cat.id === activeCategory)?.name || "Documentation"
      : "Documentation";

  const pageDescription = isSearching
    ? `Found ${filteredDocs.length} result${filteredDocs.length === 1 ? '' : 's'}`
    : activeCategory
      ? docCategories.find(cat => cat.id === activeCategory)?.description || ""
      : "Comprehensive guides and documentation for NextGenRDP platform";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <BookOpenIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
                <p className="text-sm text-gray-500">
                  Find guides and answers to help you get the most from our services
                </p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="w-full md:w-auto md:min-w-[300px]">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Breadcrumbs */}
          <nav className="flex mt-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-gray-700">
                  <HomeIcon className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Home</span>
                </Link>
              </li>
              <li>
                <ChevronRightIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              </li>
              <li>
                <Link href="/documentation" className="hover:text-gray-700">
                  Documentation
                </Link>
              </li>
              {activeCategory && !isSearching && (
                <>
                  <li>
                    <ChevronRightIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  </li>
                  <li>
                    <span className="text-gray-900">
                      {docCategories.find(cat => cat.id === activeCategory)?.name}
                    </span>
                  </li>
                </>
              )}
              {isSearching && (
                <>
                  <li>
                    <ChevronRightIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  </li>
                  <li>
                    <span className="text-gray-900">Search Results</span>
                  </li>
                </>
              )}
            </ol>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Categories</h2>
              <nav className="space-y-2">
                {docCategories.map((category) => {
                  const isActive = category.id === activeCategory;
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setSearchQuery('');
                        setIsSearching(false);
                      }}
                      className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <category.icon className={`h-5 w-5 mr-2 ${isActive ? 'text-indigo-500' : 'text-gray-400'}`} />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </nav>
              
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h2>
                <Link 
                  href="/dashboard/support/tickets/new" 
                  className="flex items-center w-full px-3 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                >
                  <QuestionMarkCircleIcon className="h-5 w-5 mr-2 text-indigo-500" />
                  <span>Contact Support</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-grow">
            {/* Content header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <h2 className="text-xl font-bold text-gray-900">{pageTitle}</h2>
              <p className="text-gray-500">{pageDescription}</p>
            </motion.div>
            
            {/* Documents */}
            {(activeCategory || isSearching) ? (
              displayedDocs.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {displayedDocs.map((doc) => (
                    <motion.div
                      key={doc.id}
                      variants={itemVariants}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <Link 
                        href={`/documentation/${doc.slug}`}
                        className="block p-5"
                      >
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{doc.title}</h3>
                        <p className="text-gray-500 text-sm mb-3">{doc.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">Last updated: {doc.lastUpdated}</span>
                          <div className="flex items-center text-indigo-600 font-medium text-sm">
                            Read more <ArrowLongRightIcon className="ml-1 h-4 w-4" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
                  <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
                  <p className="text-gray-500">
                    {isSearching
                      ? `No results found for "${searchQuery}". Try a different search term.`
                      : "No documents available in this category yet."}
                  </p>
                  {isSearching && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearching(false);
                      }}
                      className="mt-4 inline-flex items-center text-indigo-600 font-medium"
                    >
                      <ArrowUturnLeftIcon className="mr-1 h-4 w-4" />
                      Clear search
                    </button>
                  )}
                </div>
              )
            ) : (
              <div>
                {/* Featured Categories */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-10"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse By Category</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {docCategories.map((category) => (
                      <motion.div
                        key={category.id}
                        variants={itemVariants}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                      >
                        <button
                          onClick={() => setActiveCategory(category.id)}
                          className="block p-5 w-full text-left"
                        >
                          <div className="flex items-center mb-3">
                            <div className="p-2 rounded-md bg-indigo-50">
                              <category.icon className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="ml-3 text-lg font-medium text-gray-900">{category.name}</h3>
                          </div>
                          <p className="text-gray-500 text-sm">{category.description}</p>
                          <div className="mt-3 flex items-center text-indigo-600 font-medium text-sm">
                            View documents <ArrowLongRightIcon className="ml-1 h-4 w-4" />
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Recently Viewed */}
                {recentlyViewed.length > 0 && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-8"
                  >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Viewed</h2>
                    <div className="space-y-4">
                      {recentlyViewed.map((doc) => (
                        <motion.div
                          key={doc.id}
                          variants={itemVariants}
                          className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <Link 
                            href={`/documentation/${doc.slug}`}
                            className="block p-5"
                          >
                            <h3 className="text-lg font-medium text-gray-900 mb-1">{doc.title}</h3>
                            <p className="text-gray-500 text-sm mb-3">{doc.excerpt}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">Last updated: {doc.lastUpdated}</span>
                              <div className="flex items-center text-indigo-600 font-medium text-sm">
                                Continue reading <ArrowLongRightIcon className="ml-1 h-4 w-4" />
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Need specific technical assistance?
              </h2>
              <p className="mt-3 text-lg text-indigo-100">
                Our support team is ready to help you with any questions or issues you may have.
              </p>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/dashboard/support/tickets/new"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Open a support ticket
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 