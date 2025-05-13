import { NextRequest, NextResponse } from 'next/server';
import { getPlanById, updatePlan, deletePlan } from '@/repositories/planRepositoryPrisma';
import { verifyAdmin } from '@/lib/authUtils';

export async function GET(
  request: NextRequest,
  { params }: { params: { planId: string } }
) {
  try {
    // Check authentication and authorization
    if (!await verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden' },
        { status: 403 }
      );
    }
    
    const { planId } = params;
    
    // Get plan by ID
    const plan = await getPlanById(planId);
    
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }
    
    // Format plan for frontend
    const formattedPlan = {
      id: plan.id,
      name: plan.name,
      type: plan.category_id === 1 ? 'rdp' : 'vps', // Assuming category_id 1 is RDP, 2 is VPS
      price: plan.price_pkr,
      discountedPrice: plan.price_pkr * 0.9, // Example discount calculation, should come from DB
      isPopular: plan.label === 'popular',
      active: plan.is_active,
      specs: {
        cpu: plan.cpu,
        ram: plan.ram,
        storage: plan.storage,
        bandwidth: plan.bandwidth,
        location: plan.os || 'Default Location'
      },
      duration: 1, // Default to 1 month
      description: plan.description || '',
      features: plan.features.map(f => f.feature),
      createdAt: plan.created_at ? plan.created_at.toISOString() : new Date().toISOString(),
      updatedAt: plan.updated_at ? plan.updated_at.toISOString() : new Date().toISOString()
    };
    
    return NextResponse.json(formattedPlan);
  } catch (error) {
    console.error('Error fetching plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { planId: string } }
) {
  try {
    // Check authentication and authorization
    if (!await verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden' },
        { status: 403 }
      );
    }
    
    const { planId } = params;
    
    // Parse request body
    const body = await request.json();
    const {
      name,
      type,
      price,
      specs,
      isPopular,
      active,
      description,
      features
    } = body;
    
    // Update plan
    const updatedPlan = await updatePlan(planId, {
      name,
      category_id: type === 'rdp' ? 1 : type === 'vps' ? 2 : undefined,
      description,
      cpu: specs?.cpu,
      ram: specs?.ram,
      storage: specs?.storage,
      bandwidth: specs?.bandwidth,
      os: specs?.location,
      price_pkr: price,
      is_active: active,
      label: isPopular ? 'popular' : null,
      features
    });
    
    if (!updatedPlan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }
    
    // Format the response
    const formattedPlan = {
      id: updatedPlan.id,
      name: updatedPlan.name,
      type: updatedPlan.category_id === 1 ? 'rdp' : 'vps',
      price: updatedPlan.price_pkr,
      discountedPrice: updatedPlan.price_pkr * 0.9, // Example discount calculation, should come from DB
      isPopular: updatedPlan.label === 'popular',
      active: updatedPlan.is_active,
      specs: {
        cpu: updatedPlan.cpu,
        ram: updatedPlan.ram,
        storage: updatedPlan.storage,
        bandwidth: updatedPlan.bandwidth,
        location: updatedPlan.os || 'Default Location'
      },
      duration: 1,
      description: updatedPlan.description || '',
      features: updatedPlan.features.map(f => f.feature),
      createdAt: updatedPlan.created_at ? updatedPlan.created_at.toISOString() : new Date().toISOString(),
      updatedAt: updatedPlan.updated_at ? updatedPlan.updated_at.toISOString() : new Date().toISOString()
    };
    
    return NextResponse.json(formattedPlan);
  } catch (error) {
    console.error('Error updating plan:', error);
    return NextResponse.json(
      { error: 'Failed to update plan' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { planId: string } }
) {
  try {
    // Check authentication and authorization
    if (!await verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden' },
        { status: 403 }
      );
    }
    
    const { planId } = params;
    
    // Delete plan
    const result = await deletePlan(planId);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting plan:', error);
    return NextResponse.json(
      { error: 'Failed to delete plan' },
      { status: 500 }
    );
  }
} 