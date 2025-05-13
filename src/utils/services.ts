/**
 * Services utility functions for fetching and processing service data
 */

export interface ServiceBase {
  id: string;
  orderId: string;
  orderIdReadable: string;
  planName: string;
  status: string;
  ipAddress: string;
  username: string;
  password: string;
  expiryDate: string | Date;
  location: string;
  os: string;
  durationMonths: number;
  ram?: string;
  cpu?: string;
  storage?: string;
  bandwidth?: string;
  createdAt?: string | Date;
  renewalPrice?: number;
}

// Define the RdpService interface which currently doesn't have additional properties beyond the base
// In the future, we might add RDP-specific properties
export type RdpService = ServiceBase;

export interface VpsService extends ServiceBase {
  sshPort: string;
}

// Define the shape of an order from the API
interface OrderData {
  id: string;
  orderId?: string;
  planName?: string;
  planType?: string;
  status?: string;
  ipAddress?: string;
  username?: string;
  password?: string;
  passwordEncrypted?: string;
  expiryDate?: string | Date;
  location?: string;
  os?: string;
  duration?: number;
  ram?: string;
  cpu?: string;
  storage?: string;
  bandwidth?: string;
  createdAt?: string | Date;
  total?: number;
  renewalPrice?: number;
  sshPort?: string;
}

/**
 * Fetch services from the user orders API
 * @param type The type of service to filter for ('rdp' or 'vps')
 * @returns Promise containing the filtered services
 */
export async function fetchUserServices<T extends ServiceBase>(type: 'rdp' | 'vps'): Promise<T[]> {
  try {
    // Fetch orders from the API
    const response = await fetch("/api/user/orders", {
      cache: "no-store",
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Failed to fetch ${type.toUpperCase()} services`);
    }
    
    const data = await response.json();
    
    // Extract services from orders and filter for specified type
    const extractedServices: T[] = [];
    
    // Check if the data is an array or has an orders property
    const orders: OrderData[] = Array.isArray(data) ? data : data.orders || [];
    
    orders.forEach(order => {
      const typeMatches = 
        order.planName?.toLowerCase().includes(type) || 
        order.planType === type;
        
      if (typeMatches) {
        const service = {
          id: order.id,
          orderId: order.id,
          orderIdReadable: order.orderId || order.id.substring(0, 8),
          planName: order.planName || `${type.toUpperCase()} Server`,
          status: order.status || 'pending_setup',
          ipAddress: order.ipAddress || 'Pending',
          username: order.username || 'Pending',
          password: order.password || order.passwordEncrypted || 'Pending',
          expiryDate: order.expiryDate || 'Pending',
          location: order.location || 'Any',
          os: order.os || 'Windows',
          durationMonths: order.duration || 1,
          ram: order.ram || '8 GB',
          cpu: order.cpu || '4 vCPU',
          storage: order.storage || '120 GB SSD',
          bandwidth: order.bandwidth || 'Unlimited',
          createdAt: order.createdAt,
          renewalPrice: order.renewalPrice || order.total || 0
        } as T;
        
        // Add VPS specific fields
        if (type === 'vps' && 'sshPort' in service) {
          (service as unknown as VpsService).sshPort = order.sshPort || '22';
        }
        
        extractedServices.push(service);
      }
    });
    
    return extractedServices;
  } catch (error) {
    console.error(`Error fetching ${type} services:`, error);
    throw error;
  }
}

/**
 * Generate RDP file content for a service
 * @param service Service with connection details
 * @returns RDP file content as a string
 */
export function generateRdpFileContent(service: ServiceBase): string {
  return [
    "full address:s:" + service.ipAddress,
    "username:s:" + service.username,
    "prompt for credentials:i:0",
    "screen mode id:i:2",
    "use multimon:i:0",
    "desktopwidth:i:1920",
    "desktopheight:i:1080",
    "session bpp:i:32",
    "compression:i:1",
    "keyboardhook:i:2",
    "audiocapturemode:i:0",
    "videoplaybackmode:i:1",
    "connection type:i:7",
    "networkautodetect:i:1",
    "bandwidthautodetect:i:1",
    "displayconnectionbar:i:1",
    "enableworkspacereconnect:i:0",
    "disable wallpaper:i:0",
    "allow font smoothing:i:1",
    "allow desktop composition:i:1",
    "disable full window drag:i:0",
    "disable menu anims:i:0",
    "disable themes:i:0",
    "disable cursor setting:i:0",
    "bitmapcachepersistenable:i:1",
    "audiomode:i:0",
    "redirectprinters:i:1",
    "redirectcomports:i:0",
    "redirectsmartcards:i:1",
    "redirectclipboard:i:1",
    "redirectposdevices:i:0",
    "autoreconnection enabled:i:1",
    "authentication level:i:2",
    "prompt for credentials on client:i:0",
    "negotiate security layer:i:1",
    "remoteapplicationmode:i:0",
    "alternate shell:s:",
    "shell working directory:s:",
    "gatewayhostname:s:",
    "gatewayusagemethod:i:4",
    "gatewaycredentialssource:i:4",
    "gatewayprofileusagemethod:i:0",
    "promptcredentialonce:i:0",
    "use redirection server name:i:0"
  ].join("\r\n");
} 