"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Globe, Wifi } from "lucide-react";

interface NetworkInterface {
  interface: string;
  ipAddress: string;
  incomingTraffic: number;
  outgoingTraffic: number;
  packetsReceived: number;
  packetsSent: number;
}

interface ServerNetworkInterfacesProps {
  interfaces: NetworkInterface[];
  totalConnections: number;
}

export default function ServerNetworkInterfaces({ interfaces, totalConnections }: ServerNetworkInterfacesProps) {
  const [activeTab, setActiveTab] = useState<string>(
    interfaces.length > 0 ? interfaces[0].interface : "none"
  );

  // Find the active interface data
  const activeInterface = interfaces.find(intf => intf.interface === activeTab) || null;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-lg font-medium flex items-center">
              <Wifi className="h-4 w-4 mr-2 text-blue-600" />
              Network Interfaces
            </CardTitle>
            <CardDescription>
              {interfaces.length} interfaces, {totalConnections} active connections
            </CardDescription>
          </div>
          <Badge className="sm:ml-auto bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
            <Globe className="h-3 w-3 mr-1" />
            {totalConnections} Connections
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {interfaces.length > 0 ? (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-4 flex bg-transparent p-0 h-auto overflow-x-auto">
                <div className="flex border rounded-lg overflow-hidden">
                  {interfaces.map((intf) => (
                    <TabsTrigger
                      key={intf.interface}
                      value={intf.interface}
                      className="px-3 py-1.5 text-xs rounded-none data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      {intf.interface}
                    </TabsTrigger>
                  ))}
                </div>
              </TabsList>

              {interfaces.map((intf) => (
                <TabsContent key={intf.interface} value={intf.interface} className="mt-0">
                  <div className="space-y-6">
                    {/* Interface overview card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Interface</div>
                        <div className="font-semibold">{intf.interface}</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">IP Address</div>
                        <div className="font-mono text-sm">{intf.ipAddress}</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Download</div>
                        <div className="font-semibold flex items-center">
                          <ArrowDown className="h-3 w-3 mr-1 text-green-600" />
                          {intf.incomingTraffic} Mbps
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {intf.packetsReceived.toLocaleString()} packets
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Upload</div>
                        <div className="font-semibold flex items-center">
                          <ArrowUp className="h-3 w-3 mr-1 text-blue-600" />
                          {intf.outgoingTraffic} Mbps
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {intf.packetsSent.toLocaleString()} packets
                        </div>
                      </div>
                    </div>

                    {/* Traffic chart/visual (placeholder) */}
                    <div className="bg-slate-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-500 mb-2">Real-time Traffic</div>
                      <div className="h-24 flex items-center justify-center border border-slate-200 rounded bg-white">
                        <div className="text-sm text-gray-400">
                          Real-time network statistics would be displayed here
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Download: {intf.incomingTraffic} Mbps / Upload: {intf.outgoingTraffic} Mbps
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Network interfaces table */}
            <div className="mt-6">
              <div className="text-sm font-medium mb-3">All Network Interfaces</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Interface</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Download</TableHead>
                    <TableHead>Upload</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interfaces.map((intf) => (
                    <TableRow 
                      key={intf.interface}
                      className={intf.interface === activeTab ? "bg-blue-50" : ""}
                      onClick={() => setActiveTab(intf.interface)}
                    >
                      <TableCell className="font-medium">{intf.interface}</TableCell>
                      <TableCell className="font-mono text-xs">{intf.ipAddress}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <ArrowDown className="h-3 w-3 mr-1 text-green-600" />
                          {intf.incomingTraffic} Mbps
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <ArrowUp className="h-3 w-3 mr-1 text-blue-600" />
                          {intf.outgoingTraffic} Mbps
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No network interfaces found
          </div>
        )}
      </CardContent>
    </Card>
  );
} 