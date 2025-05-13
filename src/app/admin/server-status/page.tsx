"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ServerIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  ClockIcon,
  BellIcon,
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  CloudIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

// Define the types for our services and incidents
interface Service {
  id: string;
  name: string;
  description: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  lastUpdated: string;
  uptime: number;
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  date: string;
  lastUpdate: string;
  affectedServices: string[];
  updates: {
    time: string;
    status: string;
  message: string;
  }[];
}

export default function ServerStatusPage() {
  // State for services and incidents
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallStatus, setOverallStatus] = useState<'operational' | 'disrupted'>('operational');
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch services and incidents data
  useEffect(() => {
    // This would be replaced with actual API calls
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, you would fetch from your API
        // For now, we're using mock data
        const mockServices: Service[] = [
          {
            id: 'rdp-servers',
            name: 'RDP Servers',
            description: 'Remote Desktop Protocol service infrastructure',
            status: 'operational',
            lastUpdated: new Date().toISOString(),
            uptime: 99.98
          },
          {
            id: 'vps-servers',
            name: 'VPS Servers',
            description: 'Virtual Private Server infrastructure',
            status: 'operational',
            lastUpdated: new Date().toISOString(),
            uptime: 99.95
          },
          {
            id: 'billing-api',
            name: 'Billing System',
            description: 'Payment processing and invoice generation',
            status: 'operational',
            lastUpdated: new Date().toISOString(),
            uptime: 100
          },
          {
            id: 'auth-service',
            name: 'Authentication',
            description: 'User authentication and authorization services',
            status: 'operational',
            lastUpdated: new Date().toISOString(),
            uptime: 99.99
          },
          {
            id: 'dns-service',
            name: 'DNS Services',
            description: 'Domain name resolution services',
            status: 'operational',
            lastUpdated: new Date().toISOString(),
            uptime: 100
          },
          {
            id: 'backup-service',
            name: 'Backup Services',
            description: 'Automated backup and recovery systems',
            status: 'operational',
            lastUpdated: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
            uptime: 99.9
          },
          {
            id: 'api-gateway',
            name: 'API Gateway',
            description: 'API access and rate limiting services',
            status: 'operational',
            lastUpdated: new Date().toISOString(),
            uptime: 99.95
          },
          {
            id: 'admin-panel',
            name: 'Admin Dashboard',
            description: 'Internal management console',
            status: 'maintenance',
            lastUpdated: new Date().toISOString(),
            uptime: 98.5
          }
        ];

        const mockIncidents: Incident[] = [
          {
            id: 'inc-001',
            title: 'Scheduled maintenance on Admin Dashboard',
            status: 'monitoring',
            date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            lastUpdate: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            affectedServices: ['admin-panel'],
            updates: [
              {
                time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
                status: 'investigating',
                message: 'We are beginning scheduled maintenance on the Admin Dashboard. Expected duration is 3 hours.'
              },
              {
                time: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
                status: 'identified',
                message: 'Database migration is in progress. Services operating as expected.'
              },
              {
                time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                status: 'monitoring',
                message: 'Maintenance work completed. We are monitoring the systems to ensure stability.'
              }
            ]
          },
          {
            id: 'inc-002',
            title: 'Brief connectivity issues with VPS Services',
            status: 'resolved',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
            lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 45).toISOString(),
            affectedServices: ['vps-servers'],
            updates: [
              {
                time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
                status: 'investigating',
                message: 'We are investigating reports of connectivity issues affecting some VPS instances.'
              },
              {
                time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 15).toISOString(),
                status: 'identified',
                message: 'The issue has been identified as a network routing problem. Our engineers are implementing a fix.'
              },
              {
                time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 45).toISOString(),
                status: 'resolved',
                message: 'The network routing issue has been resolved. All VPS services are operating normally again.'
              }
            ]
          }
        ];

        // Set the data in state
        setServices(mockServices);
        setIncidents(mockIncidents);
        
        // Calculate overall status
        const hasIssues = mockServices.some(service => service.status !== 'operational');
        setOverallStatus(hasIssues ? 'disrupted' : 'operational');
      } catch (error) {
        console.error("Error fetching status data:", error);
    } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    // In a real app, this would fetch fresh data
    // For demo purposes, we're just adding a delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Helper function to render status badge
  const renderStatusBadge = (status: Service['status']) => {
    const statusConfig = {
      operational: { icon: CheckCircleIcon, color: 'text-green-500 bg-green-100', text: 'Operational' },
      degraded: { icon: ExclamationCircleIcon, color: 'text-yellow-500 bg-yellow-100', text: 'Degraded' },
      outage: { icon: XCircleIcon, color: 'text-red-500 bg-red-100', text: 'Outage' },
      maintenance: { icon: AdjustmentsHorizontalIcon, color: 'text-blue-500 bg-blue-100', text: 'Maintenance' }
    };

    const { icon: Icon, color, text } = statusConfig[status];

    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
        <Icon className="w-4 h-4 mr-1.5" aria-hidden="true" />
        {text}
      </div>
    );
  };

  // Helper function to render incident status badge
  const renderIncidentStatusBadge = (status: Incident['status']) => {
    const statusConfig = {
      investigating: { icon: ExclamationCircleIcon, color: 'text-yellow-500 bg-yellow-100', text: 'Investigating' },
      identified: { icon: CheckCircleIcon, color: 'text-blue-500 bg-blue-100', text: 'Identified' },
      monitoring: { icon: ChartBarIcon, color: 'text-indigo-500 bg-indigo-100', text: 'Monitoring' },
      resolved: { icon: CheckCircleIconSolid, color: 'text-green-500 bg-green-100', text: 'Resolved' }
    };

    const { icon: Icon, color, text } = statusConfig[status];

    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
        <Icon className="w-4 h-4 mr-1.5" aria-hidden="true" />
        {text}
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <ServerIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">System Status</h1>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`mb-8 p-6 rounded-lg ${
            overallStatus === 'operational' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}
        >
          <div className="flex items-center">
            {overallStatus === 'operational' ? (
              <CheckCircleIconSolid className="h-10 w-10 text-green-500 mr-4" />
            ) : (
              <ExclamationCircleIcon className="h-10 w-10 text-yellow-500 mr-4" />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {overallStatus === 'operational' 
                  ? 'All Systems Operational' 
                  : 'Some Systems Experiencing Issues'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Last checked on {new Date().toLocaleString()}
              </p>
                  </div>
                  </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('current')}
              className={`pb-4 px-1 ${
                activeTab === 'current'
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap text-sm font-medium transition-colors`}
            >
              Current Status
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-4 px-1 ${
                activeTab === 'history'
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap text-sm font-medium transition-colors`}
            >
              Incident History
            </button>
          </nav>
                  </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  </div>
        ) : activeTab === 'current' ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Status</h2>
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <ul className="divide-y divide-gray-200">
                {services.map((service) => (
                  <motion.li 
                    key={service.id}
                    variants={itemVariants}
                    className="px-6 py-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{service.name}</h3>
                        <p className="text-sm text-gray-500">{service.description}</p>
                  </div>
                      <div className="ml-6 flex-shrink-0 flex flex-col items-end">
                        {renderStatusBadge(service.status)}
                        <p className="mt-2 text-xs text-gray-500">
                          {service.uptime}% uptime
                        </p>
                  </div>
                    </div>
                  </motion.li>
                  ))}
              </ul>
            </div>

            {/* Active Incidents */}
            {incidents.filter(inc => inc.status !== 'resolved').length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Incidents</h2>
                <div className="space-y-6">
                  {incidents
                    .filter(inc => inc.status !== 'resolved')
                    .map((incident) => (
                      <motion.div 
                        key={incident.id}
                        variants={itemVariants}
                        className="bg-white shadow overflow-hidden rounded-lg"
                      >
                        <div className="px-6 py-5 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">{incident.title}</h3>
                            {renderIncidentStatusBadge(incident.status)}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>Started {formatDate(incident.date)}</span>
                          </div>
                        </div>
                        <div className="px-6 py-5 bg-gray-50">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Affected Services</h4>
                          <div className="flex flex-wrap gap-2">
                            {incident.affectedServices.map(serviceId => {
                              const service = services.find(s => s.id === serviceId);
                              return service ? (
                                <span key={serviceId} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {service.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                        <div className="px-6 py-5">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Updates</h4>
                          <div className="flow-root">
                            <ul className="-mb-4">
                              {incident.updates.map((update, index) => (
                                <li key={index} className="pb-4">
                                  <div className="relative">
                                    {index !== incident.updates.length - 1 && (
                                      <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                    )}
                                    <div className="relative flex items-start space-x-3">
                  <div>
                                        <div className="relative px-1">
                                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center ring-8 ring-white">
                                            <BellIcon className="h-4 w-4 text-blue-500" aria-hidden="true" />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="min-w-0 flex-1 py-1">
                                        <div className="text-sm text-gray-900 font-medium mb-1">
                                          <span className="capitalize">{update.status}</span> - {formatDate(update.time)}
                                        </div>
                                        <div className="text-sm text-gray-500">{update.message}</div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Incident History</h2>
            <div className="space-y-6">
              {incidents.map((incident) => (
                <motion.div 
                  key={incident.id}
                  variants={itemVariants}
                  className="bg-white shadow overflow-hidden rounded-lg"
                >
                  <div className="px-6 py-5 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{incident.title}</h3>
                      {renderIncidentStatusBadge(incident.status)}
                  </div>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        Started {formatDate(incident.date)}
                      </span>
                      {incident.status === 'resolved' && (
                        <span className="flex items-center">
                          <CheckCircleIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          Resolved {formatDate(incident.lastUpdate)}
                        </span>
                      )}
                  </div>
                  </div>
                  <div className="px-6 py-5 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Affected Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {incident.affectedServices.map(serviceId => {
                        const service = services.find(s => s.id === serviceId);
                        return service ? (
                          <span key={serviceId} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {service.name}
                          </span>
                        ) : null;
                      })}
                  </div>
                  </div>
                  <div className="px-6 py-5">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Incident Timeline</h4>
                    <div className="flow-root">
                      <ul className="-mb-4">
                        {incident.updates.map((update, index) => (
                          <li key={index} className="pb-4">
                            <div className="relative">
                              {index !== incident.updates.length - 1 && (
                                <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                              )}
                              <div className="relative flex items-start space-x-3">
                              <div>
                                  <div className="relative px-1">
                                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center ring-8 ring-white">
                                      <BellIcon className="h-4 w-4 text-blue-500" aria-hidden="true" />
                                    </div>
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1 py-1">
                                  <div className="text-sm text-gray-900 font-medium mb-1">
                                    <span className="capitalize">{update.status}</span> - {formatDate(update.time)}
                                  </div>
                                  <div className="text-sm text-gray-500">{update.message}</div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                          </div>
                        </div>
                </motion.div>
              ))}
                      </div>
          </motion.div>
        )}

        {/* System Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 bg-white shadow overflow-hidden rounded-lg"
        >
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">System Information</h2>
          </div>
          <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Security Status</h3>
                <p className="text-sm text-gray-500">All security systems active</p>
                  </div>
            </div>
                          <div className="flex items-center">
              <CloudIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Data Centers</h3>
                <p className="text-sm text-gray-500">All locations operational</p>
                          </div>
                          </div>
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-indigo-500 mr-3" />
                          <div>
                <h3 className="text-sm font-medium text-gray-900">API Requests</h3>
                <p className="text-sm text-gray-500">Normal traffic levels</p>
                            </div>
                            </div>
                          </div>
        </motion.div>

        {/* Subscription */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Stay updated on system status</h3>
              <p className="text-sm text-gray-600">Subscribe to receive notifications about service disruptions and maintenance.</p>
            </div>
            <div className="w-full md:w-auto">
              <Link
                href="/dashboard/settings"
                className="w-full md:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-blue-300 text-sm font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <BellIcon className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
                Manage Notifications
              </Link>
                        </div>
                      </div>
        </motion.div>
                  </div>
    </div>
  );
} 