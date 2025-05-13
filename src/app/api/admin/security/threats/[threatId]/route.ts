import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

// Types for security threats
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

// In-memory store for threats - in a real app, this would be in a database
// This should ideally be imported from a shared service, but for simplicity,
// we're redefining it here (would be a database query in a real app)
let securityThreats: SecurityThreat[] = [
  {
    id: "T-1023",
    title: "Brute Force Attack Detected",
    description: "Multiple failed login attempts from a single IP address targeting admin accounts.",
    severity: "high",
    status: "active",
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
    severity: "medium",
    status: "investigating",
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
    cveIds: ["CVE-2022-34721"],
    impactScore: 5
  },
  {
    id: "T-1021",
    title: "Outdated Software Vulnerability",
    description: "Critical vulnerability in outdated npm package 'lodash' version 4.17.15 that allows remote code execution.",
    severity: "critical",
    status: "active",
    detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
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

// GET a specific threat
export async function GET(
  req: NextRequest,
  { params }: { params: { threatId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { threatId } = params;
    
    // Find the specified threat
    const threat = securityThreats.find(t => t.id === threatId);
    
    if (!threat) {
      return NextResponse.json(
        { error: "Threat not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(threat);
  } catch (error) {
    console.error("Error fetching threat:", error);
    return NextResponse.json(
      { error: "Failed to fetch threat" },
      { status: 500 }
    );
  }
}

// PATCH to update a threat status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { threatId: string } }
) {
  try {
    const { threatId } = params;
    const body = await req.json();
    const { status } = body;

    // In a real application, this would update the threat in a database
    // For the demo, we'll just return success

    return NextResponse.json({ 
      success: true, 
      message: `Threat ${threatId} status updated to ${status}` 
    });
  } catch (error) {
    console.error('Error updating threat:', error);
    return NextResponse.json(
      { error: 'Failed to update threat status' },
      { status: 500 }
    );
  }
}

// DELETE a threat
export async function DELETE(
  req: NextRequest,
  { params }: { params: { threatId: string } }
) {
  try {
    const { threatId } = params;

    // In a real application, this would delete or archive the threat in a database
    // For the demo, we'll just return success

    return NextResponse.json({ 
      success: true, 
      message: `Threat ${threatId} has been deleted/ignored` 
    });
  } catch (error) {
    console.error('Error deleting threat:', error);
    return NextResponse.json(
      { error: 'Failed to delete threat' },
      { status: 500 }
    );
  }
}

// Route handler for dynamic routes
export const dynamic = 'force-dynamic'; 