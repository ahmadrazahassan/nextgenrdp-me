# NextGenRDP Database Implementation Plan

This document outlines the implementation plan for properly structuring the database logic for the NextGenRDP website. It provides a step-by-step approach to transition from the current implementation to a more robust and scalable database architecture.

## Current Implementation Analysis

Based on the codebase analysis, the current implementation has:

1. **PostgreSQL Database**: Well-configured connection pooling in `src/lib/db.ts`
2. **Hardcoded Plans**: Product data stored in `src/data/plans.js` instead of the database
3. **Basic Authentication**: JWT-based authentication with HttpOnly cookies
4. **Order Processing**: Initial implementation for order creation
5. **Guest Checkout**: Combined registration and checkout flow

## Implementation Phases

### Phase 1: Database Schema Migration

1. **Create Database Tables**
   - Follow the schema defined in `database-schema.md`
   - Create migration scripts for each table
   - Ensure proper indexes and constraints

2. **Migrate Hardcoded Data**
   - Create a script to migrate plan data from `src/data/plans.js` to the `plans` table
   - Add locations data to the `locations` table
   - Set up product categories

```javascript
// Example migration script for plans
async function migratePlansToDatabase() {
  const { rdpPlans, vpsPlans } = require('@/data/plans');
  const { query } = require('@/lib/db');
  
  // First, create categories
  await query(
    'INSERT INTO product_categories (name, slug, description) VALUES ($1, $2, $3) RETURNING id',
    ['Windows RDP', 'rdp', 'Windows Remote Desktop Solutions']
  );
  
  await query(
    'INSERT INTO product_categories (name, slug, description) VALUES ($1, $2, $3) RETURNING id',
    ['VPS Hosting', 'vps', 'Virtual Private Server Solutions']
  );
  
  // Get category IDs
  const categories = await query('SELECT id, slug FROM product_categories');
  const rdpCategoryId = categories.rows.find(c => c.slug === 'rdp').id;
  const vpsCategoryId = categories.rows.find(c => c.slug === 'vps').id;
  
  // Migrate RDP plans
  for (const plan of rdpPlans) {
    await query(
      `INSERT INTO plans (
        id, category_id, name, cpu, ram, storage, bandwidth, os, price_pkr, theme_color, label
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        plan.id,
        rdpCategoryId,
        plan.name,
        plan.cpu,
        plan.ram,
        plan.storage,
        plan.bandwidth,
        plan.os,
        plan.price,
        plan.themeColor,
        plan.label
      ]
    );
    
    // Add plan features
    if (plan.useCases && plan.useCases.length) {
      for (const feature of plan.useCases) {
        await query(
          'INSERT INTO plan_features (plan_id, feature) VALUES ($1, $2)',
          [plan.id, feature]
        );
      }
    }
  }
  
  // Similar process for VPS plans
}
```

### Phase 2: Repository Pattern Implementation

1. **Create Repository Files**
   - Create separate repository files for each entity
   - Implement CRUD operations for each entity
   - Add transaction support for complex operations

```typescript
// src/repositories/planRepository.ts
import { query } from '@/lib/db';

export interface Plan {
  id: string;
  category_id: number;
  name: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  os: string;
  price_pkr: number;
  theme_color?: string;
  label?: string;
}

export async function getAllPlans(): Promise<Plan[]> {
  const result = await query<Plan>('SELECT * FROM plans WHERE is_active = true ORDER BY price_pkr');
  return result.rows;
}

export async function getPlanById(id: string): Promise<Plan | null> {
  const result = await query<Plan>('SELECT * FROM plans WHERE id = $1', [id]);
  return result.rows.length ? result.rows[0] : null;
}

export async function getPlansByCategory(categorySlug: string): Promise<Plan[]> {
  const result = await query<Plan>(
    `SELECT p.* FROM plans p 
     JOIN product_categories c ON p.category_id = c.id 
     WHERE c.slug = $1 AND p.is_active = true 
     ORDER BY p.price_pkr`,
    [categorySlug]
  );
  return result.rows;
}
```

2. **Implement Service Layer**
   - Create service files that use repositories
   - Add business logic and validation

```typescript
// src/services/orderService.ts
import { query, getPool } from '@/lib/db';
import * as planRepository from '@/repositories/planRepository';

export async function createOrder(userId: number, planId: string, quantity: number, locationId?: number) {
  const pool = await getPool();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get plan details
    const plan = await planRepository.getPlanById(planId);
    if (!plan) {
      throw new Error(`Plan not found: ${planId}`);
    }
    
    const totalAmount = plan.price_pkr * quantity;
    
    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, status, total_amount_pkr, final_amount_pkr) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [userId, 'pending_payment', totalAmount, totalAmount]
    );
    
    const orderId = orderResult.rows[0].id;
    
    // Create order item
    await client.query(
      `INSERT INTO order_items (order_id, plan_id, location_id, quantity, price_at_order_pkr) 
       VALUES ($1, $2, $3, $4, $5)`,
      [orderId, planId, locationId, quantity, plan.price_pkr]
    );
    
    await client.query('COMMIT');
    
    return { orderId, totalAmount };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

### Phase 3: API Endpoint Updates

1. **Update Existing API Routes**
   - Refactor API routes to use the new repositories and services
   - Ensure proper error handling and validation

```typescript
// src/app/api/plans/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as planRepository from '@/repositories/planRepository';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    let plans;
    if (category) {
      plans = await planRepository.getPlansByCategory(category);
    } else {
      plans = await planRepository.getAllPlans();
    }
    
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('[API /plans] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}
```

2. **Create New API Routes**
   - Implement missing API endpoints for all entities
   - Add proper authentication and authorization

### Phase 4: Frontend Integration

1. **Update Components**
   - Modify components to fetch data from API instead of hardcoded data
   - Implement loading states and error handling

```jsx
// src/components/RdpCardsSection.jsx (updated)
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { ComputerDesktopIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

// Animation Variants
const containerStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const headerVariant = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

const RdpCardsSection = ({ showTitle = true }) => {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPlans() {
            try {
                setIsLoading(true);
                const response = await fetch('/api/plans?category=rdp');
                if (!response.ok) {
                    throw new Error('Failed to fetch plans');
                }
                const data = await response.json();
                setPlans(data.plans);
            } catch (err) {
                console.error('Error fetching plans:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPlans();
    }, []);

    if (isLoading) {
        return <div className="py-16 text-center">Loading plans...</div>;
    }

    if (error) {
        return <div className="py-16 text-center text-red-500">Error: {error}</div>;
    }

    return (
        // Section styling with a subtle background
        <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-blue-50/20 to-white overflow-hidden">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header - Conditionally Rendered */}
                {showTitle && (
                    <motion.div
                       className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
                       initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerStagger}
                    >
                        {/* Header Icon */}
                        <motion.div variants={headerVariant} className="mb-4 inline-block p-3 bg-blue-100 rounded-full ring-4 ring-blue-200/50 shadow-sm">
                            <ComputerDesktopIcon className="h-9 w-9 text-blue-600"/>
                        </motion.div>
                        {/* Header Text */}
                        <motion.h2 variants={headerVariant} className="mt-1 font-heading text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                           High-Performance RDP
                        </motion.h2>
                        <motion.p variants={headerVariant} className="mt-4 text-lg leading-7 text-gray-600">
                           Choose from our range of powerful Windows Remote Desktop plans, optimized for speed and reliability.
                        </motion.p>
                    </motion.div>
                )}

                {/* Plans Grid - Using the enhanced ProductCard.jsx */}
                 <motion.div
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" // Responsive grid (up to 4 columns)
                    initial="hidden"
                    whileInView="visible" // Animate cards as they scroll into view
                    viewport={{ once: true, amount: 0.05 }} // Start animation when 5% is visible
                    transition={{ staggerChildren: 0.07 }} // Stagger delay between cards
                 >
                    {plans.map((plan, index) => (
                        <ProductCard
                           key={plan.id}
                           plan={plan}
                           index={index}
                           displayOS={plan.os}
                        />
                    ))}
                 </motion.div>
             </div>
        </section>
    );
};

export default RdpCardsSection;
```

### Phase 5: Service Provisioning

1. **Implement Service Management**
   - Create service provisioning logic after payment
   - Implement service status management
   - Add service renewal and termination logic

2. **Admin Dashboard**
   - Create admin interface for service management
   - Implement service logs and monitoring

## Testing Strategy

1. **Unit Tests**
   - Test repository functions
   - Test service layer business logic

2. **Integration Tests**
   - Test API endpoints
   - Test database transactions

3. **End-to-End Tests**
   - Test complete user flows
   - Test payment and provisioning processes

## Deployment Considerations

1. **Database Migrations**
   - Create a migration system for schema changes
   - Implement rollback capabilities

2. **Environment Configuration**
   - Ensure proper environment variables for different environments
   - Implement secrets management

3. **Monitoring and Logging**
   - Set up database performance monitoring
   - Implement comprehensive logging

## Conclusion

This implementation plan provides a structured approach to properly implement the database logic for the NextGenRDP website. By following these phases, the website will have a robust and scalable database architecture that supports all the required functionality for an RDP/VPS selling platform.

The plan addresses the current limitations in the database implementation while providing a clear path forward for development. It ensures that the website will have a solid foundation for future growth and feature additions.