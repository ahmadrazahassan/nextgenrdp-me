// src/repositories/planRepository.ts
import { query } from '@/lib/db';

/**
 * Represents a plan in the database
 */
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

/**
 * Represents a plan with its features
 */
export interface PlanWithFeatures extends Plan {
  features: string[];
}

/**
 * Get all active plans
 */
export async function getAllPlans(): Promise<Plan[]> {
  const result = await query<Plan>('SELECT * FROM plans WHERE is_active = true ORDER BY price_pkr');
  return result.rows;
}

/**
 * Get a plan by its ID
 */
export async function getPlanById(id: string): Promise<Plan | null> {
  const result = await query<Plan>('SELECT * FROM plans WHERE id = $1', [id]);
  return result.rows.length ? result.rows[0] : null;
}

/**
 * Get a plan with its features by ID
 */
export async function getPlanWithFeaturesById(id: string): Promise<PlanWithFeatures | null> {
  // Get the plan
  const plan = await getPlanById(id);
  if (!plan) return null;
  
  // Get the features
  const featuresResult = await query<{ feature: string }>(
    'SELECT feature FROM plan_features WHERE plan_id = $1',
    [id]
  );
  
  const features = featuresResult.rows.map(row => row.feature);
  
  return {
    ...plan,
    features
  };
}

/**
 * Get plans by category
 */
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

/**
 * Get plans with features by category
 */
export async function getPlansWithFeaturesByCategory(categorySlug: string): Promise<PlanWithFeatures[]> {
  // Get the plans
  const plans = await getPlansByCategory(categorySlug);
  
  // If no plans, return empty array
  if (!plans.length) return [];
  
  // Get all plan IDs
  const planIds = plans.map(plan => plan.id);
  
  // Get all features for these plans in a single query
  const featuresResult = await query<{ plan_id: string; feature: string }>(
    'SELECT plan_id, feature FROM plan_features WHERE plan_id = ANY($1)',
    [planIds]
  );
  
  // Group features by plan_id
  const featuresByPlanId: Record<string, string[]> = {};
  featuresResult.rows.forEach(row => {
    if (!featuresByPlanId[row.plan_id]) {
      featuresByPlanId[row.plan_id] = [];
    }
    featuresByPlanId[row.plan_id].push(row.feature);
  });
  
  // Combine plans with their features
  return plans.map(plan => ({
    ...plan,
    features: featuresByPlanId[plan.id] || []
  }));
}

/**
 * Create a new plan
 */
export async function createPlan(plan: Omit<Plan, 'created_at' | 'updated_at'>): Promise<Plan> {
  const result = await query<Plan>(
    `INSERT INTO plans (
      id, category_id, name, description, cpu, ram, storage, bandwidth, os, 
      price_pkr, is_active, theme_color, label
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *`,
    [
      plan.id,
      plan.category_id,
      plan.name,
      plan.description || null,
      plan.cpu,
      plan.ram,
      plan.storage,
      plan.bandwidth,
      plan.os || null,
      plan.price_pkr,
      plan.is_active,
      plan.theme_color || 'sky',
      plan.label || null
    ]
  );
  
  return result.rows[0];
}

/**
 * Update an existing plan
 */
export async function updatePlan(id: string, plan: Partial<Omit<Plan, 'id' | 'created_at' | 'updated_at'>>): Promise<Plan | null> {
  // Build the SET clause dynamically based on provided fields
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;
  
  // Add each field that is present in the update object
  if (plan.category_id !== undefined) {
    updates.push(`category_id = $${paramIndex++}`);
    values.push(plan.category_id);
  }
  
  if (plan.name !== undefined) {
    updates.push(`name = $${paramIndex++}`);
    values.push(plan.name);
  }
  
  if (plan.description !== undefined) {
    updates.push(`description = $${paramIndex++}`);
    values.push(plan.description);
  }
  
  if (plan.cpu !== undefined) {
    updates.push(`cpu = $${paramIndex++}`);
    values.push(plan.cpu);
  }
  
  if (plan.ram !== undefined) {
    updates.push(`ram = $${paramIndex++}`);
    values.push(plan.ram);
  }
  
  if (plan.storage !== undefined) {
    updates.push(`storage = $${paramIndex++}`);
    values.push(plan.storage);
  }
  
  if (plan.bandwidth !== undefined) {
    updates.push(`bandwidth = $${paramIndex++}`);
    values.push(plan.bandwidth);
  }
  
  if (plan.os !== undefined) {
    updates.push(`os = $${paramIndex++}`);
    values.push(plan.os);
  }
  
  if (plan.price_pkr !== undefined) {
    updates.push(`price_pkr = $${paramIndex++}`);
    values.push(plan.price_pkr);
  }
  
  if (plan.is_active !== undefined) {
    updates.push(`is_active = $${paramIndex++}`);
    values.push(plan.is_active);
  }
  
  if (plan.theme_color !== undefined) {
    updates.push(`theme_color = $${paramIndex++}`);
    values.push(plan.theme_color);
  }
  
  if (plan.label !== undefined) {
    updates.push(`label = $${paramIndex++}`);
    values.push(plan.label);
  }
  
  // Always update the updated_at timestamp
  updates.push(`updated_at = NOW()`);
  
  // If no fields to update, return the current plan
  if (updates.length === 1) { // Only updated_at
    return getPlanById(id);
  }
  
  // Add the id as the last parameter
  values.push(id);
  
  const result = await query<Plan>(
    `UPDATE plans SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  
  return result.rows.length ? result.rows[0] : null;
}

/**
 * Delete a plan
 */
export async function deletePlan(id: string): Promise<boolean> {
  const result = await query('DELETE FROM plans WHERE id = $1 RETURNING id', [id]);
  return result.rows.length > 0;
}

/**
 * Add a feature to a plan
 */
export async function addPlanFeature(planId: string, feature: string): Promise<void> {
  await query(
    'INSERT INTO plan_features (plan_id, feature) VALUES ($1, $2)',
    [planId, feature]
  );
}

/**
 * Remove a feature from a plan
 */
export async function removePlanFeature(planId: string, feature: string): Promise<void> {
  await query(
    'DELETE FROM plan_features WHERE plan_id = $1 AND feature = $2',
    [planId, feature]
  );
}

/**
 * Remove all features from a plan
 */
export async function clearPlanFeatures(planId: string): Promise<void> {
  await query('DELETE FROM plan_features WHERE plan_id = $1', [planId]);
}