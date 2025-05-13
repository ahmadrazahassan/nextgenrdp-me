import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

// Type for security log entry
interface SecurityLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  ipAddress?: string;
  userId?: string;
  action?: string;
  details?: Record<string, any>;
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const level = searchParams.get("level");
    const source = searchParams.get("source");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // In a real application, these logs would be fetched from:
    // 1. Database logs table
    // 2. Log aggregation service (like ELK stack)
    // 3. Server logs parsed and stored in structured format
    
    // For this demo, we'll generate representative logs that simulate real security events
    const logs = generateSecurityLogs(200);
    
    // Apply filters
    let filteredLogs = logs;
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    
    if (source) {
      filteredLogs = filteredLogs.filter(log => log.source === source);
    }
    
    if (from) {
      const fromDate = new Date(from);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= fromDate);
    }
    
    if (to) {
      const toDate = new Date(to);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= toDate);
    }
    
    // Calculate pagination
    const totalLogs = filteredLogs.length;
    const totalPages = Math.ceil(totalLogs / limit);
    const offset = (page - 1) * limit;
    const paginatedLogs = filteredLogs.slice(offset, offset + limit);
    
    return NextResponse.json({
      logs: paginatedLogs,
      pagination: {
        total: totalLogs,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error("Error fetching security logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch security logs" },
      { status: 500 }
    );
  }
}

// Generate mock security logs
function generateSecurityLogs(count: number): SecurityLog[] {
  const logs: SecurityLog[] = [];
  const sources = ["authentication", "api", "database", "fileupload", "admin", "user"];
  const actions = ["login", "logout", "create", "update", "delete", "upload", "download", "access"];
  
  const generateIp = () => {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  };
  
  const levels: Array<'info' | 'warning' | 'error' | 'critical'> = ["info", "warning", "error", "critical"];
  const levelDistribution = [0.7, 0.2, 0.08, 0.02]; // 70% info, 20% warning, 8% error, 2% critical
  
  // User IDs - in a real system these would be actual user IDs
  const userIds = ["user_1", "user_2", "user_3", "admin_1", "admin_2"];
  
  // Generate log messages based on level and source
  const generateMessage = (level: string, source: string, action?: string) => {
    switch(level) {
      case "info":
        return `Successful ${action || "operation"} from ${source} service`;
      case "warning":
        return `Unusual activity detected in ${source} service`;
      case "error":
        return `Failed ${action || "operation"} in ${source} service`;
      case "critical":
        return `Security breach attempt detected in ${source} service`;
      default:
        return `Activity logged in ${source} service`;
    }
  };
  
  // Generate logs over the past 7 days
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  for (let i = 0; i < count; i++) {
    const levelIndex = weightedRandomIndex(levelDistribution);
    const level = levels[levelIndex];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const userId = Math.random() > 0.3 ? userIds[Math.floor(Math.random() * userIds.length)] : undefined;
    
    // Random timestamp within the past 7 days
    const timestamp = new Date(
      sevenDaysAgo.getTime() + Math.random() * (now.getTime() - sevenDaysAgo.getTime())
    ).toISOString();
    
    logs.push({
      id: `log_${i}`,
      timestamp,
      level,
      source,
      message: generateMessage(level, source, action),
      ipAddress: Math.random() > 0.1 ? generateIp() : undefined,
      userId,
      action: Math.random() > 0.2 ? action : undefined,
      details: Math.random() > 0.7 ? {
        browser: Math.random() > 0.5 ? "Chrome" : "Firefox",
        os: Math.random() > 0.5 ? "Windows" : "MacOS",
        endpoint: `/api/${source}/${Math.random() > 0.5 ? "get" : "update"}`
      } : undefined
    });
  }
  
  // Sort by timestamp (newest first)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Utility function for weighted random index
function weightedRandomIndex(weights: number[]): number {
  const sum = weights.reduce((a, b) => a + b, 0);
  const normalizedWeights = weights.map(w => w / sum);
  
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < normalizedWeights.length; i++) {
    cumulativeWeight += normalizedWeights[i];
    if (random <= cumulativeWeight) {
      return i;
    }
  }
  
  return normalizedWeights.length - 1;
} 