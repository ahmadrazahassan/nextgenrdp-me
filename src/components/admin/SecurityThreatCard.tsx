"use client";

import { useState } from "react";
import { 
  Shield, AlertTriangle, Info, ExternalLink, 
  ChevronDown, ChevronUp, Clock, MapPin, AlertCircle
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ThreatDetails {
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

interface SecurityThreatCardProps {
  threat: ThreatDetails;
  onMarkAsResolved?: (id: string) => void;
  onIgnore?: (id: string) => void;
}

export default function SecurityThreatCard({ 
  threat, 
  onMarkAsResolved,
  onIgnore
}: SecurityThreatCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-red-600 bg-red-50 border-red-200';
      case 'mitigated': return 'text-green-600 bg-green-50 border-green-200';
      case 'investigating': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <AlertCircle className="h-4 w-4" />;
      case 'mitigated': return <Shield className="h-4 w-4" />;
      case 'investigating': return <Info className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
      case 'low':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`border-l-4 ${
      threat.severity === 'critical' ? 'border-l-red-500' :
      threat.severity === 'high' ? 'border-l-orange-500' :
      threat.severity === 'medium' ? 'border-l-yellow-500' :
      'border-l-blue-500'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {getSeverityIcon(threat.severity)}
              {threat.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {threat.description}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={getSeverityColor(threat.severity)}>
              {threat.severity.charAt(0).toUpperCase() + threat.severity.slice(1)}
            </Badge>
            <Badge className={getStatusColor(threat.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(threat.status)}
                {threat.status.charAt(0).toUpperCase() + threat.status.slice(1)}
              </span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>Detected {threat.detectedAt}</span>
          
          {threat.location && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{threat.location}</span>
            </>
          )}
          
          {threat.sourceIp && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <span>Source IP: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{threat.sourceIp}</code></span>
            </>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Impact Score</span>
            <span className="text-sm font-medium">{threat.impactScore}/10</span>
          </div>
          <Progress 
            value={threat.impactScore * 10} 
            className={`h-2 ${
              threat.impactScore >= 8 ? 'bg-red-100' :
              threat.impactScore >= 5 ? 'bg-orange-100' :
              'bg-blue-100'
            }`}
          />
        </div>
        
        {expanded && (
          <div className="mt-4 space-y-4">
            {threat.attackVector && (
              <div>
                <h4 className="text-sm font-medium mb-1">Attack Vector</h4>
                <p className="text-sm text-gray-700">{threat.attackVector}</p>
              </div>
            )}
            
            {threat.affectedSystems && threat.affectedSystems.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Affected Systems</h4>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {threat.affectedSystems.map((system, index) => (
                    <li key={index}>{system}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {threat.cveIds && threat.cveIds.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Related CVEs</h4>
                <div className="flex flex-wrap gap-2">
                  {threat.cveIds.map((cve) => (
                    <a 
                      key={cve}
                      href={`https://nvd.nist.gov/vuln/detail/${cve}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
                    >
                      {cve}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {threat.recommendedActions && threat.recommendedActions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Recommended Actions</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {threat.recommendedActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="min-w-[20px] mt-0.5">
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                          {index + 1}
                        </span>
                      </div>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full sm:w-auto"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show Details
            </>
          )}
        </Button>
        
        <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
          {onIgnore && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto border-gray-200 text-gray-700 hover:bg-gray-100"
              onClick={() => onIgnore(threat.id)}
            >
              Ignore
            </Button>
          )}
          
          {onMarkAsResolved && (
            <Button 
              variant="default" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={() => onMarkAsResolved(threat.id)}
            >
              {threat.status === 'active' ? 'Mitigate Threat' : 'Mark as Resolved'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
} 