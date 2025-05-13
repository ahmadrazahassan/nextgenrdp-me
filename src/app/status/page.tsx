'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ServerIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  BellIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

interface Service {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
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

interface Timeframe {
  id: string;
  name: string;
  days: number;
}

export default function StatusPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallStatus, setOverallStatus] = useState<'operational' | 'disrupted'>('operational');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('7d');
  const [expandedIncidentId, setExpandedIncidentId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Available timeframes for historical view
  const timeframes: Timeframe[] = [
    { id: '24h', name: '24 hours', days: 1 },
    { id: '7d', name: '7 days', days: 7 },
    { id: '30d', name: '30 days', days: 30 },
    { id: '90d', name: '90 days', days: 90 }
  ];

  // Fetch status data
  useEffect(() => {
    fetchStatusData();
    
    // Set up auto-refresh every 60 seconds
    const intervalId = setInterval(() => {
      fetchStatusData(false);
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchStatusData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    if (!showLoading) setRefreshing(true);
    
    try {
      // In a production environment, this would call your actual API
      // For now, we'll simulate a fetch with mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const mockServices: Service[] = [
        {
          id: 'web-platform',
          name: 'Web Platform',
          status: 'operational',
          uptime: 99.99
        },
        {
          id: 'rdp-services',
          name: 'RDP Services',
          status: 'operational',
          uptime: 99.97
        },
        {
          id: 'vps-services',
          name: 'VPS Services',
          status: 'operational',
          uptime: 99.95
        },
        {
          id: 'authentication',
          name: 'Authentication',
          status: 'operational',
          uptime: 100
        },
        {
          id: 'billing-system',
          name: 'Billing System',
          status: 'operational',
          uptime: 99.98
        },
        {
          id: 'api-services',
          name: 'API Services',
          status: 'operational',
          uptime: 99.96
        },
        {
          id: 'backup-system',
          name: 'Backup System',
          status: 'maintenance',
          uptime: 99.5
        }
      ];

      const mockIncidents: Incident[] = [
        {
          id: 'inc-001',
          title: 'Scheduled maintenance on Backup Systems',
          status: 'monitoring',
          date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          lastUpdate: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          affectedServices: ['backup-system'],
          updates: [
            {
              time: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
              status: 'investigating',
              message: 'Scheduled maintenance has begun on our backup infrastructure. No service disruptions are expected.'
            },
            {
              time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              status: 'identified',
              message: 'Database upgrades are in progress. All systems operating as expected.'
            },
            {
              time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              status: 'monitoring',
              message: 'Maintenance work is now complete. We are monitoring the systems to ensure everything is operating correctly.'
            }
          ]
        },
        {
          id: 'inc-002',
          title: 'Brief API performance degradation',
          status: 'resolved',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
          lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 45).toISOString(),
          affectedServices: ['api-services'],
          updates: [
            {
              time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
              status: 'investigating',
              message: 'We are investigating reports of slower than normal API response times.'
            },
            {
              time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 15).toISOString(),
              status: 'identified',
              message: 'The root cause has been identified as an incorrect configuration in one of our load balancers. A fix is being implemented.'
            },
            {
              time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 45).toISOString(),
              status: 'resolved',
              message: 'The configuration has been corrected and API response times have returned to normal. We will continue to monitor for any further issues.'
            }
          ]
        }
      ];

      setServices(mockServices);
      setIncidents(mockIncidents);
      
      // Calculate overall status
      const hasIssues = mockServices.some(service => service.status !== 'operational');
      setOverallStatus(hasIssues ? 'disrupted' : 'operational');
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching status data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchStatusData(false);
  };

  const toggleIncidentDetails = (id: string) => {
    if (expandedIncidentId === id) {
      setExpandedIncidentId(null);
    } else {
      setExpandedIncidentId(id);
    }
  };

  const getStatusProps = (status: Service['status']) => {
    switch (status) {
      case 'operational':
        return {
          icon: CheckCircleIcon,
          iconColor: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          label: 'Operational'
        };
      case 'degraded':
        return {
          icon: ExclamationTriangleIcon,
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-700',
          label: 'Degraded Performance'
        };
      case 'outage':
        return {
          icon: XCircleIcon,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          label: 'Service Outage'
        };
      case 'maintenance':
        return {
          icon: InformationCircleIcon,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700',
          label: 'Maintenance'
        };
    }
  };

  const getIncidentStatusProps = (status: Incident['status']) => {
    switch (status) {
      case 'investigating':
        return {
          icon: ExclamationTriangleIcon,
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-700',
          label: 'Investigating'
        };
      case 'identified':
        return {
          icon: EyeIcon,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700',
          label: 'Identified'
        };
      case 'monitoring':
        return {
          icon: ClockIcon,
          iconColor: 'text-purple-500',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-700',
          label: 'Monitoring'
        };
      case 'resolved':
        return {
          icon: CheckCircleIconSolid,
          iconColor: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          label: 'Resolved'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get active incidents (non-resolved)
  const activeIncidents = incidents.filter(incident => incident.status !== 'resolved');
  // Get past incidents (resolved)
  const pastIncidents = incidents.filter(incident => incident.status === 'resolved');

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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center mr-6">
                <ServerIcon className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">NextGenRDP Status</span>
              </Link>
              <nav className="hidden md:flex space-x-8">
                <a 
                  href="#current-status" 
                  className="text-gray-500 hover:text-gray-900 font-medium"
                >
                  Current Status
                </a>
                <a 
                  href="#incidents" 
                  className="text-gray-500 hover:text-gray-900 font-medium"
                >
                  Incidents
                </a>
                <a 
                  href="#history" 
                  className="text-gray-500 hover:text-gray-900 font-medium"
                >
                  History
                </a>
              </nav>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4 hidden sm:block">
                {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Updating...'}
              </span>
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
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Overall Status Banner */}
            <section id="current-status">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`mb-8 p-8 rounded-xl shadow-sm border ${
                  overallStatus === 'operational' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    {overallStatus === 'operational' ? (
                      <CheckCircleIconSolid className="h-10 w-10 text-green-500 mr-4" />
                    ) : (
                      <ExclamationTriangleIcon className="h-10 w-10 text-yellow-500 mr-4" />
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {overallStatus === 'operational' 
                          ? 'All Systems Operational' 
                          : 'Some Systems Experiencing Issues'}
                      </h2>
                      <p className={`text-sm mt-1 ${overallStatus === 'operational' ? 'text-green-700' : 'text-yellow-700'}`}>
                        {overallStatus === 'operational' 
                          ? 'All services are operating normally.' 
                          : 'Some services are currently experiencing issues or undergoing maintenance.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center md:text-right">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 text-sm font-medium">
                      <span className="text-gray-500 mr-2">Status as of</span>
                      <span className="text-gray-900 font-semibold">{new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Services Status */}
            <section className="mb-12">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 
                  variants={itemVariants}
                  className="text-xl font-semibold text-gray-900 mb-6"
                >
                  Services Status
                </motion.h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => {
                    const statusProps = getStatusProps(service.status);
                    return (
                      <motion.div
                        key={service.id}
                        variants={itemVariants}
                        className={`flex items-center justify-between p-5 rounded-lg shadow-sm border ${statusProps.borderColor} ${statusProps.bgColor}`}
                      >
                        <div className="flex items-center">
                          <statusProps.icon className={`h-6 w-6 ${statusProps.iconColor} mr-3`} />
                          <span className="font-medium text-gray-900">{service.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${statusProps.textColor} mr-3`}>
                            {statusProps.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {service.uptime}% uptime
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </section>

            {/* Active Incidents */}
            <section id="incidents" className="mb-12">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 
                  variants={itemVariants}
                  className="text-xl font-semibold text-gray-900 mb-6"
                >
                  Active Incidents
                </motion.h2>
                
                {activeIncidents.length > 0 ? (
                  <div className="space-y-4">
                    {activeIncidents.map((incident) => {
                      const statusProps = getIncidentStatusProps(incident.status);
                      const isExpanded = expandedIncidentId === incident.id;
                      
                      return (
                        <motion.div
                          key={incident.id}
                          variants={itemVariants}
                          className="border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white"
                        >
                          <button
                            onClick={() => toggleIncidentDetails(incident.id)}
                            className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none"
                          >
                            <div className="flex items-center">
                              <statusProps.icon className={`h-5 w-5 ${statusProps.iconColor} mr-3`} />
                              <div>
                                <h3 className="font-medium text-gray-900">{incident.title}</h3>
                                <p className="text-sm text-gray-500">Started {formatDate(incident.date)}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusProps.bgColor} ${statusProps.textColor} mr-3`}>
                                {statusProps.label}
                              </span>
                              {isExpanded ? (
                                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </button>
                          
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                  <h4 className="text-sm font-medium text-gray-900 mb-3">Affected Services</h4>
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {incident.affectedServices.map(serviceId => {
                                      const service = services.find(s => s.id === serviceId);
                                      return service ? (
                                        <span key={serviceId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                          {service.name}
                                        </span>
                                      ) : null;
                                    })}
                                  </div>
                                  
                                  <h4 className="text-sm font-medium text-gray-900 mb-3">Updates</h4>
                                  <div className="flow-root">
                                    <ul className="space-y-4">
                                      {incident.updates.map((update, index) => (
                                        <li key={index} className="relative pb-4">
                                          {index !== incident.updates.length - 1 && (
                                            <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                          )}
                                          <div className="relative flex items-start space-x-3">
                                            <div>
                                              <div className="relative px-1">
                                                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center ring-4 ring-white">
                                                  <BellIcon className="h-4 w-4 text-blue-500" aria-hidden="true" />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <div className="text-sm font-medium text-gray-900 mb-1">
                                                <span className="capitalize">{update.status}</span> - {formatDate(update.time)}
                                              </div>
                                              <div className="text-sm text-gray-500">{update.message}</div>
                                            </div>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div
                    variants={itemVariants}
                    className="bg-white border border-gray-200 rounded-lg p-8 text-center"
                  >
                    <CheckCircleIconSolid className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Incidents</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      There are currently no active incidents. All systems are operating normally.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </section>

            {/* Past Incidents */}
            <section id="history" className="mb-12">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <motion.h2 
                    variants={itemVariants}
                    className="text-xl font-semibold text-gray-900 mb-4 md:mb-0"
                  >
                    Past Incidents
                  </motion.h2>
                  
                  <motion.div variants={itemVariants} className="flex space-x-2">
                    {timeframes.map((timeframe) => (
                      <button
                        key={timeframe.id}
                        onClick={() => setSelectedTimeframe(timeframe.id)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          selectedTimeframe === timeframe.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {timeframe.name}
                      </button>
                    ))}
                  </motion.div>
                </div>
                
                {pastIncidents.length > 0 ? (
                  <div className="space-y-4">
                    {pastIncidents.map((incident) => {
                      const statusProps = getIncidentStatusProps(incident.status);
                      const isExpanded = expandedIncidentId === incident.id;
                      
                      return (
                        <motion.div
                          key={incident.id}
                          variants={itemVariants}
                          className="border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white"
                        >
                          <button
                            onClick={() => toggleIncidentDetails(incident.id)}
                            className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none"
                          >
                            <div className="flex items-center">
                              <statusProps.icon className={`h-5 w-5 ${statusProps.iconColor} mr-3`} />
                              <div>
                                <h3 className="font-medium text-gray-900">{incident.title}</h3>
                                <div className="flex flex-wrap text-sm text-gray-500 gap-x-4 mt-1">
                                  <span className="flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    {formatDate(incident.date)}
                                  </span>
                                  <span className="flex items-center">
                                    <ClockIcon className="h-4 w-4 mr-1" />
                                    Resolved: {formatDate(incident.lastUpdate)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusProps.bgColor} ${statusProps.textColor} mr-3`}>
                                {statusProps.label}
                              </span>
                              {isExpanded ? (
                                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </button>
                          
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                  <h4 className="text-sm font-medium text-gray-900 mb-3">Affected Services</h4>
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {incident.affectedServices.map(serviceId => {
                                      const service = services.find(s => s.id === serviceId);
                                      return service ? (
                                        <span key={serviceId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                          {service.name}
                                        </span>
                                      ) : null;
                                    })}
                                  </div>
                                  
                                  <h4 className="text-sm font-medium text-gray-900 mb-3">Incident Timeline</h4>
                                  <div className="flow-root">
                                    <ul className="space-y-4">
                                      {incident.updates.map((update, index) => (
                                        <li key={index} className="relative pb-4">
                                          {index !== incident.updates.length - 1 && (
                                            <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                          )}
                                          <div className="relative flex items-start space-x-3">
                                            <div>
                                              <div className="relative px-1">
                                                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center ring-4 ring-white">
                                                  <BellIcon className="h-4 w-4 text-blue-500" aria-hidden="true" />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <div className="text-sm font-medium text-gray-900 mb-1">
                                                <span className="capitalize">{update.status}</span> - {formatDate(update.time)}
                                              </div>
                                              <div className="text-sm text-gray-500">{update.message}</div>
                                            </div>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div
                    variants={itemVariants}
                    className="bg-white border border-gray-200 rounded-lg p-8 text-center"
                  >
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                      <CalendarIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Past Incidents</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      There are no resolved incidents in the past {timeframes.find(t => t.id === selectedTimeframe)?.days} days.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </section>

            {/* Subscription Box */}
            <section>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100"
              >
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-6 md:mb-0">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Stay Updated</h2>
                    <p className="text-gray-600 max-w-xl">
                      Subscribe to receive notifications about service disruptions and get real-time updates on incidents.
                    </p>
                  </div>
                  <div>
                    <Link
                      href="/dashboard/settings"
                      className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <BellIcon className="mr-2 -ml-1 h-5 w-5" />
                      Subscribe to Updates
                    </Link>
                  </div>
                </div>
              </motion.div>
            </section>
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <Link href="/support/help-docs" className="text-gray-500 hover:text-gray-900">
                Documentation
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-900">
                Contact Support
              </Link>
              <Link href="/dashboard/support/tickets/new" className="text-gray-500 hover:text-gray-900">
                Submit a Ticket
              </Link>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} NextGenRDP. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 