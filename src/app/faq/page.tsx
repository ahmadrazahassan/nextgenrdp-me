'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  QuestionMarkCircleIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  HomeIcon,
  ServerIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UserIcon,
  WrenchScrewdriverIcon,
  ArrowLongRightIcon
} from '@heroicons/react/24/outline';

// Type definitions for FAQ items
interface FAQCategory {
  id: string;
  name: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  description: string;
  faqs: FAQItem[];
}

interface FAQItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQs, setExpandedFAQs] = useState<string[]>([]);
  const [filteredFAQs, setFilteredFAQs] = useState<{category: string, faqs: FAQItem[]}[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Toggle FAQ expansion
  const toggleFAQ = (id: string) => {
    setExpandedFAQs(prev => 
      prev.includes(id) 
        ? prev.filter(faqId => faqId !== id) 
        : [...prev, id]
    );
  };

  // Mock FAQ categories and items
  const faqCategories: FAQCategory[] = [
    {
      id: 'general',
      name: 'General Questions',
      icon: QuestionMarkCircleIcon,
      description: 'Basic information about our services',
      faqs: [
        {
          id: 'general-1',
          question: 'What is NextGenRDP?',
          answer: 'NextGenRDP is a premium provider of Remote Desktop Protocol (RDP) and Virtual Private Server (VPS) solutions designed for individuals and businesses looking for reliable, high-performance remote computing resources. We offer various plans tailored to different needs and budgets.'
        },
        {
          id: 'general-2',
          question: 'How do I get started with NextGenRDP?',
          answer: 'Getting started is simple: 1) Create an account on our website, 2) Choose a plan that fits your needs, 3) Complete the checkout process, and 4) Receive your access credentials via email. You can then connect to your remote desktop or VPS using the instructions provided in the welcome email.'
        },
        {
          id: 'general-3',
          question: 'What is the difference between RDP and VPS?',
          answer: 'RDP (Remote Desktop Protocol) provides access to a Windows-based remote desktop environment, allowing you to use Windows applications remotely. VPS (Virtual Private Server) gives you a dedicated virtual server with root access, allowing you to install any operating system and software. RDP is easier to use for most users, while VPS offers more control and customization options.'
        },
        {
          id: 'general-4',
          question: 'Do you offer a free trial?',
          answer: 'Yes, we offer a 3-day trial for new customers to test our services. The trial has limited resources but gives you a good sense of our performance and reliability. You can upgrade to a full plan at any time during or after the trial period.'
        }
      ]
    },
    {
      id: 'technical',
      name: 'Technical Support',
      icon: WrenchScrewdriverIcon,
      description: 'Help with technical issues and configurations',
      faqs: [
        {
          id: 'tech-1',
          question: 'How do I connect to my RDP server?',
          answer: 'To connect to your RDP server: 1) On Windows, use the built-in Remote Desktop Connection app. 2) On Mac, download Microsoft Remote Desktop from the App Store. 3) On mobile devices, use the RD Client app. Enter the server address, username, and password provided in your welcome email. For detailed instructions, please refer to our documentation.'
        },
        {
          id: 'tech-2',
          question: 'I can\'t connect to my server. What should I do?',
          answer: 'If you cannot connect to your server, please try these troubleshooting steps: 1) Verify your internet connection is working. 2) Check that you\'re using the correct server address, username, and password. 3) Ensure your firewall isn\'t blocking RDP connections (port 3389). 4) Try connecting from a different device or network. If you still cannot connect, please open a support ticket for assistance.'
        },
        {
          id: 'tech-3',
          question: 'How do I reset my server password?',
          answer: 'You can reset your server password through your client dashboard. Log in to your account, navigate to "Services" > "My Servers", select the relevant server, and click on "Reset Password". A new password will be generated and sent to your email address. For security reasons, you cannot specify a custom password through this process.'
        },
        {
          id: 'tech-4',
          question: 'Can I install custom software on my server?',
          answer: 'Yes, you can install custom software on your server. For RDP services, you have administrator access to install Windows-compatible software. For VPS services, you have root access to install any software compatible with your chosen operating system. Please note that installing unauthorized or illegal software violates our Terms of Service.'
        }
      ]
    },
    {
      id: 'billing',
      name: 'Billing & Payments',
      icon: CreditCardIcon,
      description: 'Information about payments, invoices and subscriptions',
      faqs: [
        {
          id: 'billing-1',
          question: 'What payment methods do you accept?',
          answer: 'We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express), PayPal, cryptocurrency (Bitcoin, Ethereum), and bank transfers for annual plans. Payment options may vary by region. All transactions are secured with industry-standard encryption.'
        },
        {
          id: 'billing-2',
          question: 'How does your billing cycle work?',
          answer: 'Our services are billed on a recurring basis according to the plan you select (monthly, quarterly, or annually). The billing date is set to the day you initially purchased the service. We send invoice reminders 3 days before the next billing cycle. You can view your billing history and upcoming invoices in your client dashboard.'
        },
        {
          id: 'billing-3',
          question: 'Do you offer refunds?',
          answer: "We offer a 7-day money-back guarantee for new customers if you're not satisfied with our service. After this period, we do not provide refunds for unused service time. If you experience significant service issues, please contact our support team, and we will address your concerns on a case-by-case basis."
        },
        {
          id: 'billing-4',
          question: 'How do I cancel my subscription?',
          answer: 'You can cancel your subscription at any time through your client dashboard. Navigate to "Billing" > "Subscriptions", select the subscription you wish to cancel, and click "Cancel Subscription". Your service will remain active until the end of the current billing period. We do not offer partial refunds for mid-cycle cancellations.'
        }
      ]
    },
    {
      id: 'security',
      name: 'Security',
      icon: ShieldCheckIcon,
      description: 'Security measures and best practices',
      faqs: [
        {
          id: 'security-1',
          question: 'How secure are your RDP and VPS services?',
          answer: 'Our services incorporate multiple security layers including: 1) Enterprise-grade firewalls and DDoS protection, 2) Regular security patches and updates, 3) Data encryption for all connections, 4) Isolated virtual environments to prevent cross-contamination between servers. Additionally, we monitor for suspicious activities 24/7 and implement industry best practices for server security.'
        },
        {
          id: 'security-2',
          question: 'Is my data backed up?',
          answer: 'Basic plans include weekly backups of your server data, retained for 7 days. Premium and Business plans include daily backups retained for 30 days. You can also create manual backups at any time through your client dashboard for an additional fee. We recommend maintaining your own backups of critical data as an extra precaution.'
        },
        {
          id: 'security-3',
          question: 'What should I do if I suspect a security breach?',
          answer: 'If you suspect a security breach: 1) Immediately change your account password and server credentials, 2) Contact our security team through the emergency support channel in your dashboard, 3) Temporarily disconnect any sensitive systems from your server, 4) Review recent account activities and server logs. Our security team will investigate promptly and provide guidance on securing your server.'
        },
        {
          id: 'security-4',
          question: 'Do you offer two-factor authentication (2FA)?',
          answer: 'Yes, we strongly recommend enabling two-factor authentication (2FA) for your client account. We support authenticator apps (Google Authenticator, Authy), SMS verification, and hardware security keys. You can set up 2FA in your account security settings. For server access, we also offer the option to implement 2FA on RDP and VPS connections for enhanced security.'
        }
      ]
    },
    {
      id: 'account',
      name: 'Account Management',
      icon: UserIcon,
      description: 'Managing your account and settings',
      faqs: [
        {
          id: 'account-1',
          question: 'How do I update my account information?',
          answer: 'You can update your account information by logging into your client dashboard and navigating to "Account Settings". Here, you can modify your personal details, contact information, notification preferences, and security settings. Some changes to critical information may require verification for security purposes.'
        },
        {
          id: 'account-2',
          question: 'Can I have multiple users access my server?',
          answer: 'Yes, our Business and Enterprise plans support multiple user accounts with customizable permission levels. You can manage users through your client dashboard under "Access Management". Each user can have their own login credentials and specific access permissions. Standard and Premium plans can be upgraded to include this feature for an additional fee.'
        },
        {
          id: 'account-3',
          question: 'How do I reset my account password?',
          answer: 'To reset your account password, click the "Forgot Password" link on the login page. Enter the email address associated with your account, and we\'ll send you a password reset link. For security reasons, the link expires after 30 minutes. If you don\'t receive the email, please check your spam folder or contact customer support.'
        },
        {
          id: 'account-4',
          question: 'What happens if my account becomes inactive?',
          answer: 'If your account becomes inactive due to non-payment, your services will be suspended after 3 days. Your data will be retained for 14 days, during which you can reactivate your account by paying any outstanding invoices. After 14 days of suspension, your server and data may be permanently deleted. We send multiple notifications before taking any action on your account.'
        }
      ]
    },
    {
      id: 'services',
      name: 'Services & Plans',
      icon: ServerIcon,
      description: 'Details about our service offerings and plans',
      faqs: [
        {
          id: 'services-1',
          question: 'What RDP and VPS plans do you offer?',
          answer: 'We offer a range of plans to suit different needs and budgets. Our RDP plans include Standard, Premium, and Business options with varying CPU, RAM, and storage allocations. Our VPS plans include Basic, Advanced, and Enterprise tiers with different performance specifications. Visit our Pricing page for detailed information about each plan\'s specifications and pricing.'
        },
        {
          id: 'services-2',
          question: 'Can I upgrade or downgrade my plan?',
          answer: 'Yes, you can upgrade your plan at any time through your client dashboard. The price difference will be prorated for the remainder of your billing cycle. Downgrades are processed at the end of your current billing cycle to avoid service disruptions. Some downgrades may require data migration if the new plan has less storage than your current usage.'
        },
        {
          id: 'services-3',
          question: 'What operating systems are available for VPS?',
          answer: 'For VPS services, we offer a variety of operating systems including: 1) Windows Server (2016, 2019, 2022), 2) Ubuntu (18.04, 20.04, 22.04), 3) CentOS (7, 8, Stream), 4) Debian (10, 11), 5) Fedora, and other popular Linux distributions. Custom OS installations may be available upon request for Business and Enterprise plans.'
        },
        {
          id: 'services-4',
          question: 'Do you offer managed services?',
          answer: 'Yes, we offer managed services for both RDP and VPS plans at an additional cost. Our managed services include regular maintenance, security updates, performance optimization, and priority technical support. You can add managed services to any plan during checkout or later through your client dashboard. We also offer custom management solutions for business clients.'
        }
      ]
    }
  ];

  // Get all FAQs across all categories
  const allFAQs = faqCategories.flatMap(category => 
    category.faqs.map(faq => ({
      ...faq,
      categoryId: category.id,
      categoryName: category.name
    }))
  );

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFAQs([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase();
    
    const results = faqCategories.map(category => {
      const matchingFaqs = category.faqs.filter(
        faq => 
          faq.question.toLowerCase().includes(query) || 
          (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(query))
      );
      
      return {
        category: category.name,
        categoryId: category.id,
        faqs: matchingFaqs
      };
    }).filter(result => result.faqs.length > 0);
    
    setFilteredFAQs(results);
  }, [searchQuery]);

  // Filter FAQs by category
  const getCategoryFAQs = (categoryId: string) => {
    const category = faqCategories.find(cat => cat.id === categoryId);
    return category ? category.faqs : [];
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <QuestionMarkCircleIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h1>
                <p className="text-sm text-gray-500">
                  Find answers to common questions about our services
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
                  placeholder="Search FAQs..."
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
                <Link href="/faq" className="hover:text-gray-700">
                  FAQ
                </Link>
              </li>
              {activeCategory && !isSearching && (
                <>
                  <li>
                    <ChevronRightIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  </li>
                  <li>
                    <span className="text-gray-900">
                      {faqCategories.find(cat => cat.id === activeCategory)?.name}
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
        {isSearching ? (
          // Search Results
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <h2 className="text-xl font-bold text-gray-900">Search Results for "{searchQuery}"</h2>
              <p className="text-gray-500">
                Found {filteredFAQs.reduce((count, category) => count + category.faqs.length, 0)} result{filteredFAQs.reduce((count, category) => count + category.faqs.length, 0) === 1 ? '' : 's'}
              </p>
            </motion.div>

            {filteredFAQs.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {filteredFAQs.map((categoryResult) => (
                  <div key={categoryResult.categoryId} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">{categoryResult.category}</h3>
                    {categoryResult.faqs.map((faq) => (
                      <motion.div
                        key={faq.id}
                        variants={itemVariants}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
                        >
                          <h3 className="text-base font-medium text-gray-900">{faq.question}</h3>
                          {expandedFAQs.includes(faq.id) ? (
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        
                        <AnimatePresence>
                          {expandedFAQs.includes(faq.id) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-6 pb-4 text-gray-500"
                            >
                              {typeof faq.answer === 'string' ? (
                                <p>{faq.answer}</p>
                              ) : (
                                faq.answer
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
                <QuestionMarkCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No questions found</h3>
                <p className="text-gray-500">
                  No results found for "{searchQuery}". Try a different search term.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearching(false);
                  }}
                  className="mt-4 inline-flex items-center text-indigo-600 font-medium"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        ) : activeCategory ? (
          // Category View
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Categories</h2>
                <nav className="space-y-2">
                  {faqCategories.map((category) => {
                    const isActive = category.id === activeCategory;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
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
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Need More Help?</h2>
                  <Link 
                    href="/documentation" 
                    className="flex items-center w-full px-3 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors mb-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <span>Documentation</span>
                  </Link>
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
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <div className="flex items-center">
                  {(() => {
                    const category = faqCategories.find(cat => cat.id === activeCategory);
                    if (!category) return null;
                    const CategoryIcon = category.icon;
                    return (
                      <>
                        <div className="p-2 rounded-md bg-indigo-50 mr-3">
                          <CategoryIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
                          <p className="text-gray-500">{category.description}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {getCategoryFAQs(activeCategory).map((faq) => (
                  <motion.div
                    key={faq.id}
                    variants={itemVariants}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
                    >
                      <h3 className="text-base font-medium text-gray-900">{faq.question}</h3>
                      {expandedFAQs.includes(faq.id) ? (
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {expandedFAQs.includes(faq.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-6 pb-4 text-gray-500"
                        >
                          {typeof faq.answer === 'string' ? (
                            <p>{faq.answer}</p>
                          ) : (
                            faq.answer
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        ) : (
          // Category Overview
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <h2 className="text-xl font-bold text-gray-900">Browse FAQ Categories</h2>
              <p className="text-gray-500">Select a category to find answers to your questions</p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {faqCategories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                >
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className="block p-6 w-full text-left h-full"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-2 rounded-md bg-indigo-50">
                        <category.icon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <h3 className="ml-3 text-lg font-medium text-gray-900">{category.name}</h3>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">{category.description}</p>
                    <p className="text-gray-400 text-xs mb-3">{category.faqs.length} question{category.faqs.length === 1 ? '' : 's'}</p>
                    <div className="flex items-center text-indigo-600 font-medium text-sm">
                      View questions <ArrowLongRightIcon className="ml-1 h-4 w-4" />
                    </div>
                  </button>
                </motion.div>
              ))}
            </motion.div>

            {/* Popular Questions Section */}
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Questions</h2>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {[
                    faqCategories[0].faqs[0],
                    faqCategories[1].faqs[0],
                    faqCategories[2].faqs[0],
                    faqCategories[3].faqs[0]
                  ].map((faq) => (
                    <div key={faq.id} className="p-6">
                      <h3 className="text-base font-medium text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-500 mb-3 line-clamp-2">
                        {typeof faq.answer === 'string' 
                          ? faq.answer.length > 150 
                            ? `${faq.answer.substring(0, 150)}...` 
                            : faq.answer
                          : 'Click to view the full answer.'}
                      </p>
                      <button
                        onClick={() => {
                          const category = faqCategories.find(cat => 
                            cat.faqs.some(f => f.id === faq.id)
                          );
                          if (category) {
                            setActiveCategory(category.id);
                            setTimeout(() => {
                              setExpandedFAQs(prev => [...prev, faq.id]);
                            }, 300);
                          }
                        }}
                        className="text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors"
                      >
                        Read more
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Couldn't find the answer you need?
              </h2>
              <p className="mt-3 text-lg text-indigo-100">
                Our support team is ready to assist you with any specific questions.
              </p>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/documentation"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Browse Documentation
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  href="/dashboard/support/tickets/new"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 