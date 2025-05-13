import { NextRequest, NextResponse } from "next/server";

// Types for security data
interface SecurityThreat {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'mitigated' | 'investigating';
  detectedAt: string;
  sourceIp?: string;
  location?: string;
  attackVector?: string;
  affectedSystems?: string[];
  recommendedActions?: string[];
  cveIds?: string[];
  impactScore: number;
}

interface SecurityMetrics {
  securityScore: number;
  activeThreats: number;
  criticalVulnerabilities: number;
  vulnerabilitiesCount: number;
  systemsSecured: number;
  totalSystems: number;
  requestsPerMinute: number;
  infrastructureScore: number;
  applicationScore: number;
  dataSecurityScore: number;
  endpointScore: number;
  industryAverage: number;
  scoreChange: number;
}

interface SecurityData {
  metrics: SecurityMetrics;
  threats: SecurityThreat[];
}

export async function GET(req: NextRequest) {
  // Mock security data with type assertions to fix type issues
  const securityData = {
    metrics: {
      securityScore: 78,
      activeThreats: 2,
      criticalVulnerabilities: 1,
      vulnerabilitiesCount: 12,
      systemsSecured: 22,
      totalSystems: 24,
      requestsPerMinute: 8500,
      infrastructureScore: 92,
      applicationScore: 84,
      dataSecurityScore: 65,
      endpointScore: 71,
      industryAverage: 73,
      scoreChange: 5
    } as const,
    threats: [
      {
        id: "T-1023",
        title: "Brute Force Attack Detected",
        description: "Multiple failed login attempts from a single IP address targeting admin accounts.",
        severity: "high" as const,
        status: "active" as const,
        detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sourceIp: "45.227.255.206",
        location: "Buenos Aires, Argentina",
        attackVector: "Authentication endpoint targeting multiple user accounts",
        affectedSystems: ["Authentication Service", "Admin Panel"],
        recommendedActions: [
          "Block the source IP address",
          "Implement rate limiting on authentication endpoints",
          "Enable account lockout after multiple failed attempts",
          "Review logs for compromised accounts"
        ],
        impactScore: 7
      },
      {
        id: "T-1022",
        title: "Suspicious File Upload",
        description: "Potentially malicious file detected during upload scan with known malware signatures.",
        severity: "medium" as const,
        status: "investigating" as const,
        detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        sourceIp: "104.28.210.95",
        location: "Miami, United States",
        attackVector: "File upload functionality",
        affectedSystems: ["Upload Service", "Media Storage"],
        recommendedActions: [
          "Quarantine the uploaded file",
          "Analyze file contents in a sandbox environment",
          "Review user account activities"
        ],
        impactScore: 5
      },
      {
        id: "T-1021",
        title: "Outdated Software Vulnerability",
        description: "Critical vulnerability in outdated npm package 'lodash' version 4.17.15 that allows remote code execution.",
        severity: "critical" as const,
        status: "active" as const,
        detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        attackVector: "Dependency injection attack via outdated package",
        affectedSystems: ["API Server", "Backend Services"],
        recommendedActions: [
          "Update vulnerable package immediately to version 4.17.21 or later",
          "Run comprehensive security scan",
          "Review application for signs of exploitation"
        ],
        impactScore: 9
      }
    ]
  };

  // Return the mock data without authentication checks for development purposes
  return NextResponse.json(securityData);
}

// Helper function to calculate a simulated current request rate
function calculateCurrentRequestRate(): number {
  // Base value
  const baseValue = 8000;
  
  // Add some randomness to simulate real-time fluctuations
  const randomFactor = Math.floor(Math.random() * 500);
  
  // Add time-based variation - more traffic during business hours
  const hour = new Date().getHours();
  const timeFactor = (hour >= 9 && hour <= 17) ? 200 : -100;
  
  return baseValue + randomFactor + timeFactor;
} 