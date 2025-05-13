import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Cpu, HardDrive, Activity, Server } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

interface ResourceMonitorProps {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

const ResourceMonitor = memo(function ResourceMonitor({ 
  cpu = 0, 
  memory = 0, 
  disk = 0, 
  network = 0 
}: ResourceMonitorProps) {
  // Calculate colors based on usage levels
  const getCpuColor = () => {
    if (cpu > 90) return 'text-red-500';
    if (cpu > 70) return 'text-amber-500';
    return 'text-green-500';
  };
  
  const getMemoryColor = () => {
    if (memory > 90) return 'text-red-500';
    if (memory > 70) return 'text-amber-500';
    return 'text-green-500';
  };
  
  const getDiskColor = () => {
    if (disk > 90) return 'text-red-500';
    if (disk > 70) return 'text-amber-500';
    return 'text-green-500';
  };
  
  const getNetworkColor = () => {
    if (network > 90) return 'text-blue-500';
    if (network > 70) return 'text-indigo-500';
    return 'text-violet-500';
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div 
            className="flex items-center gap-2 h-10 px-3 py-2 bg-background/80 border border-border/40 rounded-md"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex gap-2">
              <Cpu className={`h-4 w-4 ${getCpuColor()}`} />
              <HardDrive className={`h-4 w-4 ${getMemoryColor()}`} />
              <Server className={`h-4 w-4 ${getDiskColor()}`} />
              <Activity className={`h-4 w-4 ${getNetworkColor()}`} />
            </div>
            <div className="h-4 w-px bg-border/30"></div>
            <div className="text-xs font-medium">System</div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent className="w-64" side="bottom">
          <div className="space-y-3">
            <h4 className="text-sm font-medium mb-2">System Resources</h4>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <Cpu className="h-3 w-3 mr-2" />
                  <span>CPU</span>
                </div>
                <span className={getCpuColor()}>{cpu}%</span>
              </div>
              <Progress 
                value={cpu} 
                className="h-1.5" 
                indicatorClassName={cpu > 90 ? 'bg-red-500' : cpu > 70 ? 'bg-amber-500' : 'bg-green-500'} 
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <HardDrive className="h-3 w-3 mr-2" />
                  <span>Memory</span>
                </div>
                <span className={getMemoryColor()}>{memory}%</span>
              </div>
              <Progress 
                value={memory} 
                className="h-1.5" 
                indicatorClassName={memory > 90 ? 'bg-red-500' : memory > 70 ? 'bg-amber-500' : 'bg-green-500'} 
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <Server className="h-3 w-3 mr-2" />
                  <span>Disk</span>
                </div>
                <span className={getDiskColor()}>{disk}%</span>
              </div>
              <Progress 
                value={disk} 
                className="h-1.5" 
                indicatorClassName={disk > 90 ? 'bg-red-500' : disk > 70 ? 'bg-amber-500' : 'bg-green-500'} 
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <Activity className="h-3 w-3 mr-2" />
                  <span>Network</span>
                </div>
                <span className={getNetworkColor()}>{network}%</span>
              </div>
              <Progress 
                value={network} 
                className="h-1.5" 
                indicatorClassName="bg-blue-500" 
              />
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

export default ResourceMonitor; 