"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, Database, Wifi, Clock } from "lucide-react";

interface ServerStatusChartProps {
  timePoints: string[];
  cpuData: number[];
  memoryData: number[];
  networkData: number[];
  responseTimeData: number[];
}

export default function ServerStatusChart({ 
  timePoints, 
  cpuData, 
  memoryData, 
  networkData,
  responseTimeData
}: ServerStatusChartProps) {
  const [activeMetric, setActiveMetric] = useState("cpu");

  // Format date for x-axis
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get the active data based on selected metric
  const getActiveData = () => {
    switch (activeMetric) {
      case "cpu": return cpuData;
      case "memory": return memoryData;
      case "network": return networkData;
      case "response": return responseTimeData;
      default: return cpuData;
    }
  };

  // Get the color for the chart based on metric
  const getChartColor = () => {
    switch (activeMetric) {
      case "cpu": return "#3b82f6"; // blue
      case "memory": return "#10b981"; // green
      case "network": return "#8b5cf6"; // purple
      case "response": return "#f59e0b"; // amber
      default: return "#3b82f6";
    }
  };

  // Find max value for the chart
  const getMaxValue = () => {
    const data = getActiveData();
    return activeMetric === "response" 
      ? Math.max(...data) * 1.2 // Add 20% headroom for response times
      : 100; // Percentage metrics are 0-100
  };

  // Calculate chart dimensions
  const chartWidth = 700;
  const chartHeight = 250;
  const paddingX = 40;
  const paddingY = 30;
  const graphWidth = chartWidth - paddingX * 2;
  const graphHeight = chartHeight - paddingY * 2;
  
  // Generate points for SVG path
  const generatePathPoints = () => {
    const data = getActiveData();
    const maxVal = getMaxValue();
    const pointSpacing = graphWidth / (data.length - 1);
    
    return data.map((value, index) => {
      const x = paddingX + (pointSpacing * index);
      // Invert Y since SVG coordinates start from top-left
      const y = chartHeight - paddingY - ((value / maxVal) * graphHeight);
      return `${x},${y}`;
    }).join(" L ");
  };

  // Get label for the active metric
  const getMetricLabel = () => {
    switch (activeMetric) {
      case "cpu": return "CPU Usage (%)";
      case "memory": return "Memory Usage (%)";
      case "network": return "Network Utilization (%)";
      case "response": return "Response Time (ms)";
      default: return "";
    }
  };

  // Generate Y-axis labels
  const generateYLabels = () => {
    const maxVal = getMaxValue();
    const labels = [];
    const stepCount = 5;
    
    for (let i = 0; i <= stepCount; i++) {
      const value = (maxVal / stepCount) * i;
      labels.push({
        value: Math.round(value),
        y: chartHeight - paddingY - ((value / maxVal) * graphHeight)
      });
    }
    
    return labels;
  };

  // Generate a subset of X axis labels to avoid overcrowding
  const generateXLabels = () => {
    const labels = [];
    const labelCount = Math.min(6, timePoints.length);
    const step = Math.floor(timePoints.length / (labelCount - 1));
    
    for (let i = 0; i < timePoints.length; i += step) {
      if (labels.length < labelCount) {
        labels.push({
          text: formatTime(timePoints[i]),
          x: paddingX + ((graphWidth / (timePoints.length - 1)) * i)
        });
      }
    }
    
    // Ensure the last point is included
    if (labels.length < labelCount && timePoints.length > 1) {
      const lastIndex = timePoints.length - 1;
      labels.push({
        text: formatTime(timePoints[lastIndex]),
        x: paddingX + ((graphWidth / (timePoints.length - 1)) * lastIndex)
      });
    }
    
    return labels;
  };

  const xLabels = generateXLabels();
  const yLabels = generateYLabels();
  const chartColor = getChartColor();
  const pathPoints = generatePathPoints();
  const activeData = getActiveData();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Performance History</CardTitle>
        <CardDescription>
          System performance metrics over the last 24 hours
        </CardDescription>
        
        <Tabs value={activeMetric} onValueChange={setActiveMetric} className="mt-2">
          <TabsList className="grid grid-cols-4 h-9">
            <TabsTrigger value="cpu" className="text-xs">
              <Cpu className="h-3.5 w-3.5 mr-1" />
              CPU
            </TabsTrigger>
            <TabsTrigger value="memory" className="text-xs">
              <Database className="h-3.5 w-3.5 mr-1" />
              Memory
            </TabsTrigger>
            <TabsTrigger value="network" className="text-xs">
              <Wifi className="h-3.5 w-3.5 mr-1" />
              Network
            </TabsTrigger>
            <TabsTrigger value="response" className="text-xs">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Response
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
              {/* Y-axis line */}
              <line 
                x1={paddingX} 
                y1={paddingY} 
                x2={paddingX} 
                y2={chartHeight - paddingY} 
                stroke="#e5e7eb" 
                strokeWidth="1"
              />
              
              {/* X-axis line */}
              <line 
                x1={paddingX} 
                y1={chartHeight - paddingY} 
                x2={chartWidth - paddingX} 
                y2={chartHeight - paddingY} 
                stroke="#e5e7eb" 
                strokeWidth="1"
              />
              
              {/* Horizontal grid lines */}
              {yLabels.map((label, index) => (
                <g key={`grid-h-${index}`}>
                  <line 
                    x1={paddingX} 
                    y1={label.y} 
                    x2={chartWidth - paddingX} 
                    y2={label.y} 
                    stroke="#f3f4f6" 
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text 
                    x={paddingX - 8} 
                    y={label.y} 
                    textAnchor="end" 
                    dominantBaseline="middle" 
                    fontSize="10" 
                    fill="#9ca3af"
                  >
                    {label.value}
                  </text>
                </g>
              ))}
              
              {/* X-axis labels */}
              {xLabels.map((label, index) => (
                <text 
                  key={`x-label-${index}`}
                  x={label.x} 
                  y={chartHeight - paddingY + 15} 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill="#9ca3af"
                >
                  {label.text}
                </text>
              ))}
              
              {/* Data line */}
              <path 
                d={`M ${paddingX},${chartHeight - paddingY - ((activeData[0] / getMaxValue()) * graphHeight)} L ${pathPoints}`} 
                fill="none" 
                stroke={chartColor} 
                strokeWidth="2"
              />
              
              {/* Data points */}
              {activeData.map((value, index) => {
                const x = paddingX + ((graphWidth / (activeData.length - 1)) * index);
                const y = chartHeight - paddingY - ((value / getMaxValue()) * graphHeight);
                return (
                  <circle 
                    key={`point-${index}`}
                    cx={x} 
                    cy={y} 
                    r="3"
                    fill="white"
                    stroke={chartColor}
                    strokeWidth="1.5"
                  />
                );
              })}
              
              {/* Metric label */}
              <text 
                x={chartWidth - paddingX} 
                y={paddingY - 10} 
                textAnchor="end" 
                fontSize="10" 
                fontWeight="bold" 
                fill="#6b7280"
              >
                {getMetricLabel()}
              </text>
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 