"use client";

import { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Check, CircleAlert, FileBarChart, Download, Printer, Calendar,
  Share2, CheckCircle2, XCircle, AlertTriangle, BarChart, ChevronRight,
  FileDown, FileText, ShieldCheck
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'partially-compliant' | 'not-applicable';
  complianceScore: number;
  lastAssessment: string;
  nextAssessment: string;
  requirements: {
    total: number;
    fulfilled: number;
    inProgress: number;
    notStarted: number;
  };
  category: 'data-privacy' | 'security' | 'industry' | 'government';
}

interface ComplianceReport {
  id: string;
  title: string;
  date: string;
  framework: string;
  score: number;
  status: 'generated' | 'scheduled' | 'generating';
  type: 'full' | 'summary' | 'gap-analysis';
  size: string;
}

export default function SecurityComplianceReport() {
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([
    {
      id: "gdpr",
      name: "GDPR",
      description: "General Data Protection Regulation",
      status: 'compliant',
      complianceScore: 94,
      lastAssessment: "2023-09-15",
      nextAssessment: "2024-03-15",
      requirements: {
        total: 87,
        fulfilled: 82,
        inProgress: 5,
        notStarted: 0
      },
      category: 'data-privacy'
    },
    {
      id: "pci-dss",
      name: "PCI DSS",
      description: "Payment Card Industry Data Security Standard",
      status: 'partially-compliant',
      complianceScore: 86,
      lastAssessment: "2023-10-20",
      nextAssessment: "2024-01-20",
      requirements: {
        total: 78,
        fulfilled: 67,
        inProgress: 8,
        notStarted: 3
      },
      category: 'industry'
    },
    {
      id: "hipaa",
      name: "HIPAA",
      description: "Health Insurance Portability and Accountability Act",
      status: 'not-applicable',
      complianceScore: 0,
      lastAssessment: "N/A",
      nextAssessment: "N/A",
      requirements: {
        total: 42,
        fulfilled: 0,
        inProgress: 0,
        notStarted: 42
      },
      category: 'government'
    },
    {
      id: "iso27001",
      name: "ISO 27001",
      description: "Information Security Management System Standard",
      status: 'partially-compliant',
      complianceScore: 78,
      lastAssessment: "2023-11-05",
      nextAssessment: "2024-02-05",
      requirements: {
        total: 114,
        fulfilled: 89,
        inProgress: 15,
        notStarted: 10
      },
      category: 'security'
    },
    {
      id: "soc2",
      name: "SOC 2",
      description: "Service Organization Control 2",
      status: 'compliant',
      complianceScore: 97,
      lastAssessment: "2023-08-10",
      nextAssessment: "2024-02-10",
      requirements: {
        total: 64,
        fulfilled: 62,
        inProgress: 2,
        notStarted: 0
      },
      category: 'security'
    }
  ]);
  
  const [reports, setReports] = useState<ComplianceReport[]>([
    {
      id: "r-001",
      title: "GDPR Compliance Report Q4 2023",
      date: "2023-12-01",
      framework: "GDPR",
      score: 94,
      status: 'generated',
      type: 'full',
      size: "2.4 MB"
    },
    {
      id: "r-002",
      title: "PCI DSS Gap Analysis",
      date: "2023-10-25",
      framework: "PCI DSS",
      score: 86,
      status: 'generated',
      type: 'gap-analysis',
      size: "1.8 MB"
    },
    {
      id: "r-003",
      title: "ISO 27001 Compliance Summary",
      date: "2023-11-10",
      framework: "ISO 27001",
      score: 78,
      status: 'generated',
      type: 'summary',
      size: "856 KB"
    },
    {
      id: "r-004",
      title: "SOC 2 Compliance Report Q1 2024",
      date: "2024-01-15",
      framework: "SOC 2",
      status: 'scheduled',
      score: 0,
      type: 'full',
      size: "N/A"
    }
  ]);
  
  const [generatingReport, setGeneratingReport] = useState(false);
  
  const generateReport = (frameworkId: string) => {
    setGeneratingReport(true);
    
    toast({
      title: "Generating Compliance Report",
      description: "Please wait while we compile the report...",
    });
    
    // Simulate report generation
    setTimeout(() => {
      const framework = frameworks.find(f => f.id === frameworkId);
      
      if (framework) {
        const newReport: ComplianceReport = {
          id: `r-${reports.length + 1}`,
          title: `${framework.name} Compliance Report ${new Date().toLocaleDateString()}`,
          date: new Date().toISOString().split('T')[0],
          framework: framework.name,
          score: framework.complianceScore,
          status: 'generated',
          type: 'full',
          size: `${(Math.random() * 2 + 1).toFixed(1)} MB`
        };
        
        setReports(prev => [newReport, ...prev]);
        setGeneratingReport(false);
        
        toast({
          title: "Report Generated Successfully",
          description: `The compliance report for ${framework.name} is now available.`,
          variant: "default",
        });
      }
    }, 3000);
  };
  
  const downloadReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    
    if (report && report.status === 'generated') {
      toast({
        title: "Downloading Report",
        description: `${report.title} is being downloaded...`,
      });
    }
  };
  
  const printReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    
    if (report && report.status === 'generated') {
      toast({
        title: "Printing Report",
        description: `${report.title} has been sent to the printer.`,
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'compliant':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Compliant</Badge>;
      case 'non-compliant':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Non-Compliant</Badge>;
      case 'partially-compliant':
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Partially Compliant</Badge>;
      case 'not-applicable':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Not Applicable</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getReportStatusBadge = (status: string) => {
    switch(status) {
      case 'generated':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Generated</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
      case 'generating':
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Generating</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatDate = (dateStr: string) => {
    if (dateStr === "N/A") return "N/A";
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Compliance Management</h2>
          <p className="text-gray-500">Monitor and manage regulatory compliance requirements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Assessment
          </Button>
          <Button>
            <FileBarChart className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>
      
      {/* Compliance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Overall Compliance</h3>
              <div className="relative h-32 w-32 mx-auto">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#E0E7FF"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset={283 * (1 - 89 / 100)}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-700">89%</span>
                </div>
              </div>
              <p className="text-gray-500 mt-2">Across all frameworks</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Requirements Status</h3>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fulfilled</span>
                  <span>300 / 385</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-green-50 rounded">
                  <div className="text-xl font-semibold text-green-700">78%</div>
                  <div className="text-xs text-gray-500">Fulfilled</div>
                </div>
                <div className="p-2 bg-yellow-50 rounded">
                  <div className="text-xl font-semibold text-yellow-700">16%</div>
                  <div className="text-xs text-gray-500">In Progress</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-xl font-semibold text-gray-700">6%</div>
                  <div className="text-xs text-gray-500">Not Started</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Compliance by Framework</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">GDPR</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <Progress value={94} className="h-1.5 bg-blue-100" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">PCI DSS</span>
                  <span className="text-sm font-medium">86%</span>
                </div>
                <Progress value={86} className="h-1.5 bg-blue-100" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">ISO 27001</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} className="h-1.5 bg-blue-100" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">SOC 2</span>
                  <span className="text-sm font-medium">97%</span>
                </div>
                <Progress value={97} className="h-1.5 bg-blue-100" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Upcoming Assessments</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">PCI DSS</div>
                    <div className="text-xs text-gray-500">Jan 20, 2024</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium">ISO 27001</div>
                    <div className="text-xs text-gray-500">Feb 5, 2024</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium">SOC 2</div>
                    <div className="text-xs text-gray-500">Feb 10, 2024</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Compliance Frameworks */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Frameworks</CardTitle>
          <CardDescription>
            Status of regulatory and industry frameworks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Framework</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Requirements</TableHead>
                <TableHead>Last Assessment</TableHead>
                <TableHead>Next Assessment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {frameworks.map(framework => (
                <TableRow key={framework.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{framework.name}</div>
                      <div className="text-sm text-gray-500">{framework.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(framework.status)}</TableCell>
                  <TableCell>
                    {framework.status !== 'not-applicable' ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{framework.complianceScore}%</span>
                        <Progress value={framework.complianceScore} className="w-16 h-2" />
                      </div>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {framework.status !== 'not-applicable' ? (
                      <div className="text-sm">
                        <span className="text-green-600">{framework.requirements.fulfilled}</span>
                        <span className="text-gray-400"> / </span>
                        <span>{framework.requirements.total}</span>
                        
                        {framework.requirements.inProgress > 0 && (
                          <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700">
                            {framework.requirements.inProgress} in progress
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDate(framework.lastAssessment)}
                  </TableCell>
                  <TableCell>
                    {formatDate(framework.nextAssessment)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => generateReport(framework.id)}
                        disabled={generatingReport || framework.status === 'not-applicable'}
                      >
                        {generatingReport ? (
                          <>
                            <CircleAlert className="h-4 w-4 mr-1 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 mr-1" />
                            Generate Report
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        disabled={framework.status === 'not-applicable'}
                      >
                        <BarChart className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Compliance Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Reports</CardTitle>
          <CardDescription>
            Generated compliance reports and documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map(report => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="font-medium">{report.title}</div>
                  </TableCell>
                  <TableCell>{report.framework}</TableCell>
                  <TableCell>{formatDate(report.date)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {report.type === 'full' ? 'Full Report' :
                       report.type === 'summary' ? 'Summary' :
                       'Gap Analysis'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getReportStatusBadge(report.status)}</TableCell>
                  <TableCell>{report.size}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        disabled={report.status !== 'generated'}
                        onClick={() => downloadReport(report.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        disabled={report.status !== 'generated'}
                        onClick={() => printReport(report.id)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        disabled={report.status !== 'generated'}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="text-sm text-gray-500">
            {reports.filter(r => r.status === 'generated').length} reports available
          </div>
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Export All Reports
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 