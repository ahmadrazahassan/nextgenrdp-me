export interface PlanPricing {
  billingCycle: string;
  price: number;
  discountPercentage?: number;
  originalPrice?: number;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  features: string[];
  specs: {
    cpu: string;
    ram: string;
    storage: string;
    bandwidth: string;
  };
  popular?: boolean;
  pricing: PlanPricing[];
}

// Make sure to export the plans array with the correct name
export const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic RDP',
    description: 'Perfect for light usage and basic tasks',
    features: [
      'Windows Server 2019',
      '24/7 Technical Support',
      'Dedicated Resources',
      'Free Setup',
      'Multiple Locations'
    ],
    specs: {
      cpu: '2 vCPU',
      ram: '4 GB RAM',
      storage: '60 GB SSD',
      bandwidth: '1 TB'
    },
    pricing: [
      {
        billingCycle: 'monthly',
        price: 5000,
      },
      {
        billingCycle: 'quarterly',
        price: 13500,
        discountPercentage: 10,
        originalPrice: 15000
      },
      {
        billingCycle: 'semi-annual',
        price: 25500,
        discountPercentage: 15,
        originalPrice: 30000
      },
      {
        billingCycle: 'annual',
        price: 48000,
        discountPercentage: 20,
        originalPrice: 60000
      }
    ]
  },
  // Add a plan with the ID that matches your URL parameter
  {
    id: 'rdp-starter-one',
    name: 'RDP Starter One',
    description: 'Entry-level RDP solution for basic needs',
    features: [
      'Windows Server 2019',
      'Basic Support',
      'Shared Resources',
      'Free Setup',
      'Single Location'
    ],
    specs: {
      cpu: '1 vCPU',
      ram: '2 GB RAM',
      storage: '40 GB SSD',
      bandwidth: '500 GB'
    },
    pricing: [
      {
        billingCycle: 'monthly',
        price: 3000,
      },
      {
        billingCycle: 'quarterly',
        price: 8100,
        discountPercentage: 10,
        originalPrice: 9000
      },
      {
        billingCycle: 'semi-annual',
        price: 15300,
        discountPercentage: 15,
        originalPrice: 18000
      },
      {
        billingCycle: 'annual',
        price: 28800,
        discountPercentage: 20,
        originalPrice: 36000
      }
    ]
  },
  {
    id: 'standard',
    name: 'Standard RDP',
    description: 'Balanced performance for everyday workloads',
    features: [
      'Windows Server 2019/2022',
      '24/7 Technical Support',
      'Dedicated Resources',
      'Free Setup',
      'Multiple Locations',
      'Daily Backups'
    ],
    specs: {
      cpu: '4 vCPU',
      ram: '8 GB RAM',
      storage: '120 GB SSD',
      bandwidth: '2 TB'
    },
    popular: true,
    pricing: [
      {
        billingCycle: 'monthly',
        price: 8000,
      },
      {
        billingCycle: 'quarterly',
        price: 21600,
        discountPercentage: 10,
        originalPrice: 24000
      },
      {
        billingCycle: 'semi-annual',
        price: 40800,
        discountPercentage: 15,
        originalPrice: 48000
      },
      {
        billingCycle: 'annual',
        price: 76800,
        discountPercentage: 20,
        originalPrice: 96000
      }
    ]
  },
  {
    id: 'premium',
    name: 'Premium RDP',
    description: 'High-performance solution for demanding applications',
    features: [
      'Windows Server 2019/2022',
      '24/7 Priority Support',
      'Dedicated Resources',
      'Free Setup',
      'Multiple Locations',
      'Daily Backups',
      'DDoS Protection',
      'Dedicated IP'
    ],
    specs: {
      cpu: '8 vCPU',
      ram: '16 GB RAM',
      storage: '250 GB SSD',
      bandwidth: '5 TB'
    },
    pricing: [
      {
        billingCycle: 'monthly',
        price: 15000,
      },
      {
        billingCycle: 'quarterly',
        price: 40500,
        discountPercentage: 10,
        originalPrice: 45000
      },
      {
        billingCycle: 'semi-annual',
        price: 76500,
        discountPercentage: 15,
        originalPrice: 90000
      },
      {
        billingCycle: 'annual',
        price: 144000,
        discountPercentage: 20,
        originalPrice: 180000
      }
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise RDP',
    description: 'Maximum power for enterprise-level requirements',
    features: [
      'Windows Server 2019/2022',
      '24/7 Priority Support',
      'Dedicated Resources',
      'Free Setup',
      'Multiple Locations',
      'Daily Backups',
      'DDoS Protection',
      'Dedicated IP',
      'Custom Configuration',
      'Managed Services'
    ],
    specs: {
      cpu: '16 vCPU',
      ram: '32 GB RAM',
      storage: '500 GB SSD',
      bandwidth: '10 TB'
    },
    pricing: [
      {
        billingCycle: 'monthly',
        price: 25000,
      },
      {
        billingCycle: 'quarterly',
        price: 67500,
        discountPercentage: 10,
        originalPrice: 75000
      },
      {
        billingCycle: 'semi-annual',
        price: 127500,
        discountPercentage: 15,
        originalPrice: 150000
      },
      {
        billingCycle: 'annual',
        price: 240000,
        discountPercentage: 20,
        originalPrice: 300000
      }
    ]
  }
];

export const billingCycles = [
  { id: 'monthly', name: 'Monthly', months: 1 },
  { id: 'quarterly', name: 'Quarterly', months: 3 },
  { id: 'semi-annual', name: 'Semi-Annual', months: 6 },
  { id: 'annual', name: 'Annual', months: 12 }
];