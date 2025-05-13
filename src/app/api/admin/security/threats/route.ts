import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

// Types for threat data
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

// In-memory store for threats (in a real app, this would be in a database)
let securityThreats: SecurityThreat[] = [
  {
    id: "T-1023",
    title: "Brute Force Attack Detected",
    description: "Multiple failed login attempts from a single IP address targeting admin accounts.",
    severity: "high",
    status: "active",
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
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
    severity: "medium",
    status: "investigating",
    detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    sourceIp: "104.28.210.95",
    location: "Miami, United States",
    attackVector: "File upload functionality",
    affectedSystems: ["Upload Service", "Media Storage"],
    recommendedActions: [
      "Quarantine the uploaded file",
      "Analyze file contents in a sandbox environment",
      "Review user account activities"
    ],
    cveIds: ["CVE-2022-34721"],
    impactScore: 5
  },
  {
    id: "T-1021",
    title: "Outdated Software Vulnerability",
    description: "Critical vulnerability in outdated npm package 'lodash' version 4.17.15 that allows remote code execution.",
    severity: "critical",
    status: "active",
    detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    attackVector: "Dependency injection attack via outdated package",
    affectedSystems: ["API Server", "Backend Services"],
    recommendedActions: [
      "Update vulnerable package immediately to version 4.17.21 or later",
      "Run comprehensive security scan",
      "Review application for signs of exploitation"
    ],
    cveIds: ["CVE-2021-23337", "CVE-2020-8203"],
    impactScore: 9
  }
];

// GET all threats
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");
    
    // Filter threats based on query parameters
    let filteredThreats = [...securityThreats];
    
    if (status) {
      filteredThreats = filteredThreats.filter(threat => threat.status === status);
    }
    
    if (severity) {
      filteredThreats = filteredThreats.filter(threat => threat.severity === severity);
    }
    
    return NextResponse.json(filteredThreats);
  } catch (error) {
    console.error("Error fetching threats:", error);
    return NextResponse.json(
      { error: "Failed to fetch threats" },
      { status: 500 }
    );
  }
}

// POST to create a new threat (for demo purposes)
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await req.json();
    
    // Validate required fields
    if (!data.title || !data.description || !data.severity) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, severity" },
        { status: 400 }
      );
    }
    
    // Create a new threat
    const newThreat: SecurityThreat = {
      id: `T-${1024 + securityThreats.length}`,
      title: data.title,
      description: data.description,
      severity: data.severity,
      status: data.status || "active",
      detectedAt: data.detectedAt || new Date().toISOString(),
      sourceIp: data.sourceIp,
      location: data.location,
      attackVector: data.attackVector,
      affectedSystems: data.affectedSystems,
      recommendedActions: data.recommendedActions,
      cveIds: data.cveIds,
      impactScore: data.impactScore || Math.floor(Math.random() * 10) + 1
    };
    
    // Add to the list of threats
    securityThreats.push(newThreat);
    
    return NextResponse.json(newThreat, { status: 201 });
  } catch (error) {
    console.error("Error creating threat:", error);
    return NextResponse.json(
      { error: "Failed to create threat" },
      { status: 500 }
    );
  }
}

// Route handler for individual threat actions
export const dynamic = 'force-dynamic'; 