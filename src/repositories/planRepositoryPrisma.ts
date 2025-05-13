import prisma from '@/lib/db';
import { PrismaClient } from '@prisma/client';

export interface Plan {
  id: string;
  category_id: number;
  name: string;
  description?: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  os?: string;
  price_pkr: number;
  is_active: boolean;
  theme_color?: string;
  label?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PlanFeature {
  id?: string;
  plan_id: string;
  feature: string;
}

export interface PlanWithFeatures extends Plan {
  features: PlanFeature[];
}

/**
 * Get all plans - using direct SQL query via Prisma
 */
export async function getAllPlans(includeInactive = false): Promise<PlanWithFeatures[]> {
  // First get all plans
  const plansQuery = includeInactive 
    ? `SELECT * FROM plans ORDER BY price_pkr ASC`
    : `SELECT * FROM plans WHERE is_active = true ORDER BY price_pkr ASC`;
    
  const plans = await prisma.$queryRawUnsafe<Plan[]>(plansQuery);
  
  // Get all plan features in one query
  if (plans.length === 0) {
    return [];
  }
  
  const planIds = plans.map(plan => plan.id);
  const placeholders = planIds.map(id => `'${id}'`).join(',');
  const featuresQuery = `SELECT * FROM plan_features WHERE plan_id IN (${placeholders})`;
  const features = await prisma.$queryRawUnsafe<PlanFeature[]>(featuresQuery);
  
  // Combine plans with their features
  return plans.map(plan => ({
    ...plan,
    features: features.filter(f => f.plan_id === plan.id)
  }));
}

/**
 * Get a plan by its ID
 */
export async function getPlanById(id: string): Promise<PlanWithFeatures | null> {
  const planQuery = `SELECT * FROM plans WHERE id = '${id}'`;
  const plan = await prisma.$queryRawUnsafe<Plan[]>(planQuery);
  
  if (plan.length === 0) {
    return null;
  }
  
  const featuresQuery = `SELECT * FROM plan_features WHERE plan_id = '${id}'`;
  const features = await prisma.$queryRawUnsafe<PlanFeature[]>(featuresQuery);
  
  return {
    ...plan[0],
    features
  };
}

/**
 * Get plans by category
 */
export async function getPlansByCategory(categoryId: number, includeInactive = false): Promise<PlanWithFeatures[]> {
  const query = includeInactive
    ? `SELECT * FROM plans WHERE category_id = ${categoryId} ORDER BY price_pkr ASC`
    : `SELECT * FROM plans WHERE category_id = ${categoryId} AND is_active = true ORDER BY price_pkr ASC`;
    
  const plans = await prisma.$queryRawUnsafe<Plan[]>(query);
  
  if (plans.length === 0) {
    return [];
  }
  
  const planIds = plans.map(plan => plan.id);
  const placeholders = planIds.map(id => `'${id}'`).join(',');
  const featuresQuery = `SELECT * FROM plan_features WHERE plan_id IN (${placeholders})`;
  const features = await prisma.$queryRawUnsafe<PlanFeature[]>(featuresQuery);
  
  return plans.map(plan => ({
    ...plan,
    features: features.filter(f => f.plan_id === plan.id)
  }));
}

/**
 * Create a new plan
 */
export async function createPlan(data: {
  id: string;
  category_id: number;
  name: string;
  description?: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  os?: string;
  price_pkr: number;
  is_active: boolean;
  theme_color?: string;
  label?: string;
  features?: string[];
}): Promise<PlanWithFeatures> {
  const { features = [], ...planData } = data;
  
  // Use a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create the plan
    const insertPlanQuery = `
      INSERT INTO plans (
        id, category_id, name, description, cpu, ram, storage, bandwidth, os, 
        price_pkr, is_active, theme_color, label
      ) VALUES (
        '${planData.id}', 
        ${planData.category_id}, 
        '${planData.name}', 
        ${planData.description ? `'${planData.description}'` : 'NULL'}, 
        '${planData.cpu}', 
        '${planData.ram}', 
        '${planData.storage}', 
        '${planData.bandwidth}', 
        ${planData.os ? `'${planData.os}'` : 'NULL'}, 
        ${planData.price_pkr}, 
        ${planData.is_active}, 
        ${planData.theme_color ? `'${planData.theme_color}'` : "'sky'"}, 
        ${planData.label ? `'${planData.label}'` : 'NULL'}
      ) RETURNING *
    `;
    
    const newPlan = await tx.$queryRawUnsafe<Plan[]>(insertPlanQuery);
    
    // Create features
    const planFeatures: PlanFeature[] = [];
    if (features.length > 0) {
      for (const feature of features) {
        const insertFeatureQuery = `
          INSERT INTO plan_features (plan_id, feature) 
          VALUES ('${planData.id}', '${feature}')
          RETURNING *
        `;
        const newFeature = await tx.$queryRawUnsafe<PlanFeature[]>(insertFeatureQuery);
        planFeatures.push(newFeature[0]);
      }
    }
    
    return {
      ...newPlan[0],
      features: planFeatures
    };
  });
  
  return result as PlanWithFeatures;
}

/**
 * Update an existing plan
 */
export async function updatePlan(id: string, data: Partial<{
  category_id: number;
  name: string;
  description: string | null;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  os: string | null;
  price_pkr: number;
  is_active: boolean;
  theme_color: string;
  label: string | null;
  features: string[];
}>): Promise<PlanWithFeatures | null> {
  const { features, ...planData } = data;
  
  return prisma.$transaction(async (tx) => {
    // Build the SET clause for update
    const updateFields = Object.entries(planData)
      .map(([key, value]) => {
        if (value === null) {
          return `${key} = NULL`;
        }
        if (typeof value === 'string') {
          return `${key} = '${value}'`;
        }
        return `${key} = ${value}`;
      })
      .join(', ');
      
    if (updateFields) {
      const updateQuery = `
        UPDATE plans 
        SET ${updateFields}, updated_at = NOW() 
        WHERE id = '${id}'
        RETURNING *
      `;
      await tx.$queryRawUnsafe<Plan[]>(updateQuery);
    }
    
    // Update features if provided
    if (features !== undefined) {
      // Delete existing features
      await tx.$queryRawUnsafe(`DELETE FROM plan_features WHERE plan_id = '${id}'`);
      
      // Add new features
      for (const feature of features) {
        await tx.$queryRawUnsafe(`
          INSERT INTO plan_features (plan_id, feature) 
          VALUES ('${id}', '${feature}')
        `);
      }
    }
    
    // Get the updated plan with features
    const updatedPlan = await tx.$queryRawUnsafe<Plan[]>(`SELECT * FROM plans WHERE id = '${id}'`);
    if (updatedPlan.length === 0) {
      return null;
    }
    
    const updatedFeatures = await tx.$queryRawUnsafe<PlanFeature[]>(`
      SELECT * FROM plan_features WHERE plan_id = '${id}'
    `);
    
    return {
      ...updatedPlan[0],
      features: updatedFeatures
    };
  });
}

/**
 * Delete a plan
 */
export async function deletePlan(id: string): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    // Delete features first (due to foreign key constraints)
    await tx.$queryRawUnsafe(`DELETE FROM plan_features WHERE plan_id = '${id}'`);
    
    // Delete the plan
    const result = await tx.$queryRawUnsafe<{id: string}[]>(`
      DELETE FROM plans WHERE id = '${id}' RETURNING id
    `);
    
    return result.length > 0;
  });
}

/**
 * Add a feature to a plan
 */
export async function addPlanFeature(planId: string, feature: string): Promise<PlanFeature> {
  const result = await prisma.$queryRaw<PlanFeature[]>`
    INSERT INTO plan_features (plan_id, feature)
    VALUES (${planId}, ${feature})
    RETURNING *
  `;
  return result[0];
}

/**
 * Remove a feature from a plan
 */
export async function removePlanFeature(planId: string, feature: string): Promise<number> {
  const result = await prisma.$queryRaw<{count: number}>`
    DELETE FROM plan_features 
    WHERE plan_id = ${planId} AND feature = ${feature}
  `;
  return Number(result[0]?.count || 0);
}

/**
 * Clear all features from a plan
 */
export async function clearPlanFeatures(planId: string): Promise<number> {
  const result = await prisma.$queryRaw<{count: number}>`
    DELETE FROM plan_features WHERE plan_id = ${planId}
  `;
  return Number(result[0]?.count || 0);
} 