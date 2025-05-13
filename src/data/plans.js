// src/data/plans.js

// --- Constants ---
export const defaultCurrency = 'PKR'; // Pakistani Rupee
export const defaultBillingCycle = '/ month';

// --- Helper function to get OS info ---
export const getOsInfo = (planId) => {
  // Default OS if no match is found
  let defaultOs = 'Windows Server 2022';
  
  // Check if it's a VPS plan with Windows 10
  if (planId.includes('vps-') && 
     (planId.includes('starter') || 
      planId.includes('basic') || 
      planId.includes('standard'))) {
    return 'Windows 10';
  }
  
  return defaultOs;
};

// --- RDP Plans (Windows Remote Desktop) ---
export const rdpPlans = [
  {
    id: 'rdp-starter-one',
    name: 'Starter One',
    cpu: '2 vCore',
    ram: '4 GB RAM',
    storage: '30 GB NVMe SSD',
    price: 999,
    bandwidth: '500 GB',
    os: 'Windows Server 2022',
    useCases: ['Basic Browsing', 'Light Tasks'],
    orderLink: '/order/rdp-starter-one',
    themeColor: 'sky',
    label: null,
  },
  {
    id: 'rdp-basic-one',
    name: 'Basic Plan',
    cpu: '4 vCore',
    ram: '8 GB RAM',
    storage: '40 GB NVMe SSD',
    price: 1100,
    bandwidth: '1 TB',
    os: 'Windows Server 2022',
    useCases: ['Downloading/Uploading', 'Normal Use'],
    orderLink: '/order/rdp-basic-one',
    themeColor: 'sky',
    label: 'Recommended',
  },
  {
    id: 'rdp-basic-plan',
    name: 'RDP Basic',
    cpu: '4 vCores',
    ram: '16 GB RAM',
    storage: '50 GB NVMe SSD',
    price: 1250,
    bandwidth: '1 TB',
    os: 'Windows Server 2022',
    useCases: ['Loading', 'Multiple Browser Tabs'],
    orderLink: '/order/rdp-basic-plan',
    themeColor: 'green',
    label: null,
  },
  {
    id: 'rdp-standard',
    name: 'RDP Standard',
    cpu: '8 vCores',
    ram: '16 GB RAM',
    storage: '60 GB NVMe SSD',
    price: 1450,
    bandwidth: '1 TB',
    os: 'Windows Server 2022',
    useCases: ['Automation Tasks', 'Live Streaming'],
    orderLink: '/order/rdp-standard',
    themeColor: 'green',
    label: 'Most Selling',
  },
  {
    id: 'rdp-plus',
    name: 'RDP Plus',
    cpu: '8 vCores',
    ram: '32 GB RAM',
    storage: '80 GB NVMe SSD',
    price: 1750,
    bandwidth: '2 TB',
    os: 'Windows Server 2022',
    useCases: ['Heavier Automation', 'Any Task'],
    orderLink: '/order/rdp-plus',
    themeColor: 'orange',
    label: null,
  },
  {
    id: 'rdp-pro',
    name: 'RDP Pro',
    cpu: '64 vCores',
    ram: '8 GB RAM',
    storage: '80 GB NVMe SSD',
    price: 2000,
    bandwidth: '1 TB',
    os: 'Windows Server 2022',
    useCases: ['Multiple Tasks', 'Resource Intensive Apps'],
    orderLink: '/order/rdp-pro',
    themeColor: 'orange',
    label: null,
  },
  {
    id: 'rdp-elite',
    name: 'RDP Elite',
    cpu: '64 vCores',
    ram: '16 GB RAM',
    storage: '120 GB NVMe SSD',
    price: 2300,
    bandwidth: '2 TB',
    os: 'Windows Server 2022',
    useCases: ['Heavy Multitasking', 'Development Env'],
    orderLink: '/order/rdp-elite',
    themeColor: 'sky',
    label: 'High End',
  },
  {
    id: 'rdp-ultimate',
    name: 'RDP Ultimate',
    cpu: '128 vCores',
    ram: '12 GB RAM',
    storage: '250 GB NVMe SSD',
    price: 2800,
    bandwidth: '3 TB',
    os: 'Windows Server 2022',
    useCases: ['Maximum Performance', 'High End'],
    orderLink: '/order/rdp-ultimate',
    themeColor: 'orange',
    label: null,
  },
];

// --- VPS Plans (Windows Options) ---
export const vpsPlans = [
  {
    id: 'vps-starter',
    name: 'VPS Starter',
    cpu: '2 vCore',
    ram: '4 GB RAM',
    storage: '40 GB NVMe SSD',
    price: 1100,
    os: 'Windows 10',
    bandwidth: '1 TB Transfer',
    useCases: ['Small Website', 'Normal Task'],
    orderLink: '/order/vps-starter',
    themeColor: 'green',
    label: null,
  },
  {
    id: 'vps-basic',
    name: 'VPS Basic',
    cpu: '2 vCores',
    ram: '8 GB RAM',
    storage: '40 GB NVMe SSD',
    price: 1350,
    os: 'Windows 10',
    bandwidth: '2 TB Transfer',
    useCases: ['Medium Traffic Site', 'Facebook / Tiktok'],
    orderLink: '/order/vps-basic',
    themeColor: 'green',
    label: 'Recommended',
  },
  {
    id: 'vps-standard',
    name: 'VPS Standard',
    cpu: '4 vCores',
    ram: '8 GB RAM',
    storage: '50 GB NVMe SSD',
    price: 1500,
    os: 'Windows 10',
    bandwidth: '1 TB Transfer',
    useCases: ['Larger Apps', 'Facebook / Tiktok'],
    orderLink: '/order/vps-standard',
    themeColor: 'sky',
    label: null,
  },
  {
    id: 'vps-starter-win',
    name: 'VPS Starter Win',
    cpu: '16 vCore',
    ram: '4 GB RAM',
    storage: '60 GB NVMe SSD',
    price: 1700,
    os: 'Windows 10',
    bandwidth: '1 TB Transfer',
    useCases: ['Live Stream VPS', 'Light Windows Apps'],
    orderLink: '/order/vps-starter-win',
    themeColor: 'orange',
    label: null,
  },
  {
    id: 'vps-basic-win',
    name: 'VPS Basic Win',
    cpu: '8 vCores',
    ram: '16 GB RAM',
    storage: '100 GB NVMe SSD',
    price: 1900,
    os: 'Windows Server 2022',
    bandwidth: '2 TB Transfer',
    useCases: ['Live Stream', 'Loading', 'Watchtime'],
    orderLink: '/order/vps-basic-win',
    themeColor: 'orange',
    label: 'Most Selling',
  },
  {
    id: 'vps-pro-win',
    name: 'VPS Pro Win',
    cpu: '8 vCores',
    ram: '32 GB RAM',
    storage: '160 GB NVMe SSD',
    price: 2350,
    os: 'Windows Server 2022',
    bandwidth: '3 TB Transfer',
    useCases: ['Live Streaming', 'Multiple Browsing', 'Heavier Apps'],
    orderLink: '/order/vps-pro-win',
    themeColor: 'sky',
    label: 'High End',
  },
];

// --- Helper functions for fetching plans ---

// Get all plans (both RDP and VPS)
export const getAllPlans = () => {
  return [...rdpPlans, ...vpsPlans];
};

// Find a plan by ID
export const getPlanById = (planId) => {
  // Search in RDP plans
  const rdpPlan = rdpPlans.find(plan => plan.id === planId);
  if (rdpPlan) return rdpPlan;
  
  // Search in VPS plans
  const vpsPlan = vpsPlans.find(plan => plan.id === planId);
  if (vpsPlan) return vpsPlan;
  
  // Return null if not found
  return null;
};

// Get plans by type (rdp or vps)
export const getPlansByType = (type) => {
  if (type === 'rdp') return rdpPlans;
  if (type === 'vps') return vpsPlans;
  return [];
};

// Get popular plans (plans with a label)
export const getPopularPlans = () => {
  return getAllPlans().filter(plan => plan.label !== null);
};