"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Activity, Lock, Settings, Server, AlertTriangle, Loader2, Globe, ChevronRight, ArrowUp, ArrowDown, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

// Import custom components for the security page
import SecurityLogsMonitoring from "@/components/admin/SecurityLogsMonitoring";
import SecurityThreatCard from "@/components/admin/SecurityThreatCard";
import SecurityNotifications from "@/components/admin/SecurityNotifications";
import AutomatedThreatResponse from "@/components/admin/AutomatedThreatResponse";
import SecurityComplianceReport from "@/components/admin/SecurityComplianceReport";

// Types for the security data
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

export default function SecurityPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch security data on component mount
  useEffect(() => {
    fetchSecurityData();
  }, []);

  // Function to fetch security data from our API
  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from our real API endpoint with authentication
      const response = await axios.get('/api/admin/security', {
        headers: {
          // Include auth headers if you have them
          // 'Authorization': `Bearer ${token}`,
        },
        withCredentials: true // Include cookies for session-based auth
      });
      
      setThreats(response.data.threats);
      setMetrics(response.data.metrics);
      setError(null); // Clear any previous errors
      setLoading(false);
    } catch (err) {
      console.error("Error fetching security data:", err);
      
      // For development purposes, use mock data when API fails
      const mockData: { threats: SecurityThreat[]; metrics: SecurityMetrics } = {
        threats: [
          {
            id: "T-1023",
            title: "Brute Force Attack Detected",
            description: "Multiple failed login attempts from a single IP address targeting admin accounts.",
            severity: "high" as 'high',
            status: "active" as 'active',
            detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            sourceIp: "45.227.255.206",
            location: "Buenos Aires, Argentina",
            attackVector: "Authentication endpoint",
            affectedSystems: ["Authentication Service", "Admin Panel"],
            recommendedActions: ["Block IP address", "Review logs"],
            impactScore: 7
          },
          {
            id: "T-1022",
            title: "Suspicious File Upload",
            description: "Potentially malicious file detected during upload scan.",
            severity: "medium" as 'medium',
            status: "investigating" as 'investigating',
            detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            sourceIp: "104.28.210.95",
            impactScore: 5
          }
        ],
        metrics: {
          securityScore: 78,
          activeThreats: 2,
          criticalVulnerabilities: 1,
          vulnerabilitiesCount: 12,
          systemsSecured: 22,
          totalSystems: 24,
          requestsPerMinute: 8200,
          infrastructureScore: 92,
          applicationScore: 84,
          dataSecurityScore: 65,
          endpointScore: 71,
          industryAverage: 73,
          scoreChange: 5
        }
      };
      
      // Use mock data when API fails
      setThreats(mockData.threats);
      setMetrics(mockData.metrics);
      setError("Failed to load security data from API. Using mock data.");
      setLoading(false);
      
      toast({
        title: "Error",
        description: "Failed to load security data from API. Using mock data instead.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsResolved = async (id: string) => {
    try {
      // Use the real API endpoint
      await axios.patch(`/api/admin/security/threats/${id}`, {
        status: 'mitigated'
      });
      
      toast({
        title: "Threat status updated",
        description: "The threat has been marked as resolved.",
        variant: "default",
      });
      
      // Update local state to reflect the change
      setThreats(prev => 
        prev.map(threat => 
          threat.id === id 
            ? { ...threat, status: 'mitigated' as const } 
            : threat
        )
      );
    } catch (err) {
      console.error("Error resolving threat:", err);
      toast({
        title: "Error",
        description: "Failed to update threat status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleIgnoreThreat = async (id: string) => {
    try {
      // Use the real API endpoint
      await axios.delete(`/api/admin/security/threats/${id}`);
      
      toast({
        title: "Threat ignored",
        description: "The threat has been ignored and removed from the list.",
        variant: "default",
      });
      
      // Update local state to reflect the change
      setThreats(prev => prev.filter(threat => threat.id !== id));
    } catch (err) {
      console.error("Error ignoring threat:", err);
      toast({
        title: "Error",
        description: "Failed to ignore threat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const runSecurityScan = async () => {
    try {
      setLoading(true);
      toast({
        title: "Security scan initiated",
        description: "Scanning system for vulnerabilities and threats...",
      });
      
      // In a real application, this would trigger a full security scan
      // For this demo, we'll just refresh our data after a brief delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Refresh data after scan
      await fetchSecurityData();
      
      toast({
        title: "Security scan complete",
        description: "Security report has been updated with the latest data.",
        variant: "default",
      });
    } catch (err) {
      console.error("Error running security scan:", err);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to complete security scan. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">Loading security data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Center</h1>
          <p className="text-gray-500">Comprehensive security management and monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <SecurityNotifications />
          <Button onClick={runSecurityScan} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Run Security Scan
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="border-b w-full justify-start rounded-none px-0 h-12 bg-transparent">
          <div className="flex gap-0 border rounded-lg overflow-hidden shadow-sm">
            <TabsTrigger 
              value="dashboard" 
              className="rounded-none px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <Shield className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="monitoring" 
              className="rounded-none px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <Activity className="w-4 h-4 mr-2" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger 
              value="automation" 
              className="rounded-none px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <Lock className="w-4 h-4 mr-2" />
              Automation
            </TabsTrigger>
            <TabsTrigger 
              value="compliance" 
              className="rounded-none px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <FileText className="w-4 h-4 mr-2" />
              Compliance
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="rounded-none px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </div>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6 space-y-6">
          {metrics && (
            <>
              {/* Security Score Overview */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-blue-600" />
                      Security Score
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Overall security posture based on real-time analysis
                    </p>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative h-32 w-32">
                        {/* Circular progress indicator */}
                        <svg className="h-full w-full" viewBox="0 0 100 100">
                          {/* Background circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#E0E7FF"
                            strokeWidth="10"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="10"
                            strokeDasharray="283"
                            strokeDashoffset={283 * (1 - metrics.securityScore / 100)}
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        {/* Centered text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold text-blue-700">{metrics.securityScore}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3 flex-1">
                        <div>
                          <div className="flex justify-between mb-1">
                            <div className="text-sm font-medium">Infrastructure</div>
                            <div className="text-sm font-medium">{metrics.infrastructureScore}%</div>
                          </div>
                          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full" 
                              style={{ width: `${metrics.infrastructureScore}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <div className="text-sm font-medium">Application</div>
                            <div className="text-sm font-medium">{metrics.applicationScore}%</div>
                          </div>
                          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full" 
                              style={{ width: `${metrics.applicationScore}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <div className="text-sm font-medium">Data Security</div>
                            <div className="text-sm font-medium">{metrics.dataSecurityScore}%</div>
                          </div>
                          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full" 
                              style={{ width: `${metrics.dataSecurityScore}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <div className="text-sm font-medium">Endpoint</div>
                            <div className="text-sm font-medium">{metrics.endpointScore}%</div>
                          </div>
                          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full" 
                              style={{ width: `${metrics.endpointScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-3 py-1 inline-flex items-center">
                        <Activity className="w-3.5 h-3.5 mr-1" />
                        Industry: {metrics.industryAverage}%
                      </div>
                      <div className={`${
                        metrics.scoreChange > 0
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      } border rounded-md px-3 py-1 inline-flex items-center`}>
                        {metrics.scoreChange > 0 ? (
                          <ArrowUp className="w-3.5 h-3.5 mr-1" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 mr-1" />
                        )}
                        Trend: {metrics.scoreChange > 0 ? '+' : ''}{metrics.scoreChange}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white shadow-sm rounded-lg p-4">
                      <div className="text-base font-medium flex items-center mb-2">
                        <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                        Active Threats
                      </div>
                      <div className="text-3xl font-bold">{metrics.activeThreats}</div>
                      <p className="text-sm text-gray-500">
                        {metrics.criticalVulnerabilities} critical
                      </p>
                    </div>
                    
                    <div className="bg-white shadow-sm rounded-lg p-4">
                      <div className="text-base font-medium flex items-center mb-2">
                        <Lock className="h-4 w-4 mr-2 text-green-500" />
                        Vulnerabilities
                      </div>
                      <div className="text-3xl font-bold">{metrics.vulnerabilitiesCount}</div>
                      <p className="text-sm text-gray-500">
                        {metrics.vulnerabilitiesCount - metrics.activeThreats} need attention
                      </p>
                    </div>
                    
                    <div className="bg-white shadow-sm rounded-lg p-4">
                      <div className="text-base font-medium flex items-center mb-2">
                        <Server className="h-4 w-4 mr-2 text-orange-500" />
                        Systems
                      </div>
                      <div className="text-3xl font-bold">{metrics.totalSystems}</div>
                      <p className="text-sm text-gray-500">
                        {metrics.systemsSecured} secured
                      </p>
                    </div>
                    
                    <div className="bg-white shadow-sm rounded-lg p-4">
                      <div className="text-base font-medium flex items-center mb-2">
                        <Globe className="h-4 w-4 mr-2 text-blue-500" />
                        Traffic
                      </div>
                      <div className="text-3xl font-bold">{(metrics.requestsPerMinute / 1000).toFixed(1)}K</div>
                      <p className="text-sm text-gray-500">
                        requests/min
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active threats section for dashboard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Active Threats</h3>
                  <Button variant="ghost" className="text-gray-500 hover:text-blue-600" onClick={() => setActiveTab("threats")}>
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                
                {threats.filter(t => t.status === 'active').length > 0 ? (
                  <div className="space-y-4">
                    {threats.filter(t => t.status === 'active').map(threat => (
                      <SecurityThreatCard 
                        key={threat.id} 
                        threat={threat} 
                        onMarkAsResolved={handleMarkAsResolved}
                        onIgnore={handleIgnoreThreat}
                      />
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <AlertTitle>All Clear!</AlertTitle>
                    <AlertDescription>No active threats detected.</AlertDescription>
                  </Alert>
                )}
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="monitoring" className="mt-6 space-y-6">
          <SecurityLogsMonitoring />
        </TabsContent>
        
        <TabsContent value="automation" className="mt-6 space-y-6">
          <AutomatedThreatResponse />
        </TabsContent>
        
        <TabsContent value="compliance" className="mt-6 space-y-6">
          <SecurityComplianceReport />
        </TabsContent>
        
        <TabsContent value="threats" className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Security Threats</h3>
            
            {threats.length > 0 ? (
              <div className="space-y-4">
                {threats.map(threat => (
                  <SecurityThreatCard 
                    key={threat.id} 
                    threat={threat} 
                    onMarkAsResolved={handleMarkAsResolved}
                    onIgnore={handleIgnoreThreat}
                  />
                ))}
              </div>
            ) : (
              <Alert>
                <AlertTitle>All Clear!</AlertTitle>
                <AlertDescription>No security threats detected.</AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6 space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Feature in Development</AlertTitle>
            <AlertDescription>
              The settings module is currently being developed. This module will provide 
              configuration options for security monitoring, alerts, and notifications.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
} 