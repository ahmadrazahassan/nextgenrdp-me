"use client";

import { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, Edit, Plus, Power, Shield, PlayCircle, PauseCircle,
  AlertTriangle, ShieldAlert, Sliders, Lock, NetworkIcon, RefreshCw
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  enabled: boolean;
  category: 'network' | 'login' | 'data' | 'system' | 'application';
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export default function AutomatedThreatResponse() {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: "rule-001",
      name: "Block IP After Failed Logins",
      description: "Automatically block IP addresses after multiple failed login attempts",
      trigger: "5 failed login attempts within 10 minutes from the same IP",
      actions: [
        "Block IP address for 24 hours",
        "Generate security alert",
        "Log incident details"
      ],
      enabled: true,
      category: 'login',
      severity: 'high'
    },
    {
      id: "rule-002",
      name: "Scan Suspicious Uploads",
      description: "Run deep malware scan on suspicious file uploads",
      trigger: "File upload with unusual characteristics or known malicious patterns",
      actions: [
        "Quarantine file",
        "Run extended malware scan",
        "Notify security team"
      ],
      enabled: true,
      category: 'data',
      severity: 'high'
    },
    {
      id: "rule-003",
      name: "Rate Limit API Requests",
      description: "Apply rate limiting to API requests exceeding thresholds",
      trigger: "API requests exceeding 100 per minute from single source",
      actions: [
        "Apply rate limiting",
        "Generate warning notification",
        "Monitor source for further activity"
      ],
      enabled: false,
      category: 'network',
      severity: 'medium'
    },
    {
      id: "rule-004",
      name: "Auto-Update Vulnerable Packages",
      description: "Automatically update packages with known vulnerabilities",
      trigger: "Detection of package with critical CVE",
      actions: [
        "Update package to latest secure version",
        "Run regression tests",
        "Generate security report"
      ],
      enabled: true,
      category: 'application',
      severity: 'critical'
    },
    {
      id: "rule-005",
      name: "Anomaly Detection Response",
      description: "Responds to unusual system behavior patterns",
      trigger: "Detection of anomalous system activity patterns",
      actions: [
        "Isolate affected system",
        "Capture forensic data",
        "Alert security team"
      ],
      enabled: true,
      category: 'system',
      severity: 'high'
    }
  ]);
  
  const [activeRule, setActiveRule] = useState<AutomationRule | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const toggleRuleStatus = (id: string) => {
    setRules(prevRules => 
      prevRules.map(rule => 
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
    
    const rule = rules.find(r => r.id === id);
    if (rule) {
      toast({
        title: `Rule ${rule.enabled ? 'Disabled' : 'Enabled'}`,
        description: `"${rule.name}" has been ${rule.enabled ? 'disabled' : 'enabled'}.`,
      });
    }
  };
  
  const simulateRule = (rule: AutomationRule) => {
    setActiveRule(rule);
    setIsSimulating(true);
    
    toast({
      title: "Simulation Started",
      description: `Running simulation for "${rule.name}"...`,
    });
    
    // Simulate the rule by showing a series of toasts for each action
    setTimeout(() => {
      toast({
        title: "Simulation: Trigger Detected",
        description: rule.trigger,
      });
      
      rule.actions.forEach((action, index) => {
        setTimeout(() => {
          toast({
            title: `Simulation: Action ${index + 1}`,
            description: action,
            variant: "default",
          });
        }, (index + 1) * 1500);
      });
      
      // Complete simulation after all actions
      setTimeout(() => {
        setIsSimulating(false);
        toast({
          title: "Simulation Completed",
          description: `All automated actions for "${rule.name}" were successfully executed.`,
          variant: "default",
        });
      }, (rule.actions.length + 1) * 1500);
    }, 1000);
  };
  
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'network': return <NetworkIcon className="h-4 w-4" />;
      case 'login': return <Lock className="h-4 w-4" />;
      case 'data': return <ShieldAlert className="h-4 w-4" />;
      case 'system': return <Sliders className="h-4 w-4" />;
      case 'application': return <Shield className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Automated Threat Response</h2>
          <p className="text-gray-500">Configure automated security responses and workflows</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Rule
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Response Rules</CardTitle>
              <CardDescription>
                Rules that automatically respond to security threats
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {rules.filter(r => r.enabled).length} of {rules.length} rules active
              </span>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead>Rule</TableHead>
                <TableHead className="w-[120px]">Category</TableHead>
                <TableHead className="w-[120px]">Severity</TableHead>
                <TableHead className="w-[220px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map(rule => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <Switch 
                      checked={rule.enabled} 
                      onCheckedChange={() => toggleRuleStatus(rule.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-sm text-gray-500">{rule.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex w-fit items-center gap-1 font-normal">
                      {getCategoryIcon(rule.category)}
                      {rule.category.charAt(0).toUpperCase() + rule.category.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(rule.severity)}>
                      {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={isSimulating || !rule.enabled}
                        onClick={() => simulateRule(rule)}
                      >
                        {isSimulating && activeRule?.id === rule.id ? (
                          <>
                            <PauseCircle className="h-4 w-4 mr-1" />
                            Simulating...
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Simulate
                          </>
                        )}
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-gray-500">
            Last rule update: {new Date().toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              Test All Rules
            </Button>
            <Button variant="destructive" size="sm" className="bg-red-600">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Disable All
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rule Execution History</CardTitle>
            <CardDescription>
              Recent automated rule executions and their outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-md bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Success
                    </Badge>
                    <span className="text-sm font-medium">Block IP After Failed Logins</span>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  IP 45.227.255.206 blocked for 24 hours after 8 failed login attempts
                </p>
              </div>
              
              <div className="p-3 border rounded-md bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Success
                    </Badge>
                    <span className="text-sm font-medium">Scan Suspicious Uploads</span>
                  </div>
                  <span className="text-xs text-gray-500">5 hours ago</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  File 'invoice_document.pdf' quarantined and scanned for malware
                </p>
              </div>
              
              <div className="p-3 border rounded-md bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Failed
                    </Badge>
                    <span className="text-sm font-medium">Auto-Update Vulnerable Packages</span>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Failed to update 'lodash' package due to dependency conflicts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Response Effectiveness</CardTitle>
            <CardDescription>
              Analytics on automated threat response effectiveness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium">Threats Automatically Mitigated</div>
                  <div className="text-sm font-medium">87%</div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium">Average Response Time</div>
                  <div className="text-sm font-medium">1.2s</div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium">False Positive Rate</div>
                  <div className="text-sm font-medium">4%</div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '4%' }}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="border rounded-md p-3">
                  <div className="text-sm text-gray-500">Responses This Week</div>
                  <div className="text-2xl font-bold">127</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-sm text-gray-500">Rules Triggered</div>
                  <div className="text-2xl font-bold">3/5</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 