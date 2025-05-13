import { NextRequest, NextResponse } from "next/server";
import os from "os";

// Simulating a real server status fetch
// In a real environment, you'd interface with monitoring tools like Prometheus,
// Datadog, New Relic, etc., or custom monitoring systems

// Define types for our services and incidents
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

// In a real application, this would fetch from a database
// For demonstration, we're using mock data
const getServices = (): Service[] => {
  return [
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
};

const getIncidents = (): Incident[] => {
  return [
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
};

// Calculate the overall status based on service statuses
const calculateOverallStatus = (services: Service[]): 'operational' | 'disrupted' => {
  const hasIssues = services.some(service => service.status !== 'operational');
  return hasIssues ? 'disrupted' : 'operational';
};

export async function GET() {
  try {
    const services = getServices();
    const incidents = getIncidents();
    const overallStatus = calculateOverallStatus(services);

    return NextResponse.json(
      {
        status: 'success',
        data: {
          overallStatus,
    services,
          incidents,
          lastUpdated: new Date().toISOString()
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching system status:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to retrieve system status'
      },
      { status: 500 }
    );
  }
}

// In a real application, you would have additional endpoints:
// - POST /api/admin/server-status/services - Create or update a service
// - PATCH /api/admin/server-status/services/{id} - Update a specific service status
// - POST /api/admin/server-status/incidents - Create a new incident
// - PATCH /api/admin/server-status/incidents/{id} - Update an incident
// - POST /api/admin/server-status/incidents/{id}/updates - Add an update to an incident

// Helper functions
function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

function generateTimePoints(count: number): string[] {
  const result = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000); // hourly points
    result.push(time.toISOString());
  }
  
  return result;
}

function generateRandomDataPoints(count: number, min: number, max: number, isPercentage: boolean = true): number[] {
  const result = [];
  let lastValue = Math.random() * (max - min) + min;
  
  for (let i = 0; i < count; i++) {
    // Generate a value that's somewhat related to the previous value (for a natural flow)
    const change = (Math.random() - 0.5) * (max - min) * 0.2;
    lastValue = Math.max(min, Math.min(max, lastValue + change));
    
    if (isPercentage) {
      result.push(Math.round(lastValue));
    } else {
      result.push(parseFloat(lastValue.toFixed(2)));
    }
  }
  
  return result;
} 