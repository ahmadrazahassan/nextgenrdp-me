"use client";

import { useState, useEffect } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, AlertTriangle, Info, Shield, RefreshCw, MoreHorizontal,
  Calendar, Clock, Download, AlertCircle
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import axios from "axios";

// Types
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

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SecurityLogsMonitoringProps {
  // Add props as needed
}

export default function SecurityLogsMonitoring({}: SecurityLogsMonitoringProps) {
  // State for logs and filtering
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0
  });
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);
  
  // Fetch security logs when filters change
  useEffect(() => {
    fetchSecurityLogs();
  }, [pagination.page, filterLevel, filterSource, fromDate, toDate]);
  
  // Fetch logs with current filters
  const fetchSecurityLogs = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());
      
      if (filterLevel && filterLevel !== 'all') params.append('level', filterLevel);
      if (filterSource && filterSource !== 'all') params.append('source', filterSource);
      if (fromDate) params.append('from', fromDate.toISOString());
      if (toDate) params.append('to', toDate.toISOString());
      
      // Make API request
      const response = await axios.get(`/api/admin/security/logs?${params.toString()}`);
      
      setLogs(response.data.logs);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching security logs:", error);
      setLoading(false);
    }
  };
  
  // Apply search filter
  const filteredLogs = logs.filter(log => 
    searchTerm === '' || 
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.ipAddress && log.ipAddress.includes(searchTerm)) ||
    (log.userId && log.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filteredLogs computed value
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilterLevel('all');
    setFilterSource('all');
    setFromDate(undefined);
    setToDate(undefined);
    setSearchTerm('');
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, 'MMM dd, yyyy HH:mm:ss');
  };
  
  // Get level badge color
  const getLevelBadge = (level: string) => {
    switch(level) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'error':
        return <Badge variant="destructive" className="bg-red-600">Error</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Warning</Badge>;
      case 'info':
      default:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Info</Badge>;
    }
  };
  
  // Get level icon
  const getLevelIcon = (level: string) => {
    switch(level) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // View log details
  const viewLogDetails = (log: SecurityLog) => {
    setSelectedLog(log);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold">Security Monitoring</h2>
          <p className="text-gray-500">Monitor real-time security logs and events</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={resetFilters}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
          <Button variant="default" onClick={fetchSecurityLogs} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>Filter security logs by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                <Input 
                  placeholder="Search logs..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" size="icon" variant="ghost">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Log Level</label>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Source</label>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="authentication">Authentication</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="fileupload">File Upload</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 flex gap-2">
              <div className="flex-1">
                <label className="text-sm font-medium">From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium">To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Logs Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Security Logs</CardTitle>
              <CardDescription>
                Showing {filteredLogs.length} of {pagination.total} logs
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead className="w-[100px]">Level</TableHead>
                  <TableHead className="w-[120px]">Source</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[150px]">IP Address</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} className="cursor-pointer hover:bg-gray-50" onClick={() => viewLogDetails(log)}>
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getLevelIcon(log.level)}
                          {getLevelBadge(log.level)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 font-medium">
                          {log.source}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.message}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.ipAddress || "—"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => viewLogDetails(log)}>
                              View Details
                            </DropdownMenuItem>
                            {log.level === 'critical' || log.level === 'error' ? (
                              <DropdownMenuItem>Create Incident</DropdownMenuItem>
                            ) : null}
                            {log.ipAddress && (
                              <DropdownMenuItem>Block IP</DropdownMenuItem>
                            )}
                            <DropdownMenuItem>Export</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No logs found matching the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {pagination.total} total logs
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            <div className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setSelectedLog(null)}>
          <Card className="w-full max-w-3xl" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getLevelIcon(selectedLog.level)}
                    Log Details: {selectedLog.id}
                  </CardTitle>
                  <CardDescription>
                    {formatTimestamp(selectedLog.timestamp)}
                  </CardDescription>
                </div>
                {getLevelBadge(selectedLog.level)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Source</h4>
                  <p className="text-sm">{selectedLog.source}</p>
                </div>
                {selectedLog.action && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Action</h4>
                    <p className="text-sm">{selectedLog.action}</p>
                  </div>
                )}
                {selectedLog.ipAddress && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">IP Address</h4>
                    <p className="text-sm font-mono">{selectedLog.ipAddress}</p>
                  </div>
                )}
                {selectedLog.userId && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">User ID</h4>
                    <p className="text-sm font-mono">{selectedLog.userId}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Message</h4>
                <p className="text-sm bg-gray-50 p-3 rounded">{selectedLog.message}</p>
              </div>
              
              {selectedLog.details && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Additional Details</h4>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              {selectedLog.level === 'critical' || selectedLog.level === 'error' ? (
                <Button variant="destructive">Create Incident</Button>
              ) : null}
              <Button variant="outline" onClick={() => setSelectedLog(null)}>Close</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
} 