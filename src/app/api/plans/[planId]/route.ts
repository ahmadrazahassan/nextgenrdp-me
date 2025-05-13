// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { getPlanById } from '@/data/plans';

// Standard App Router API Route structure
export async function GET(
  request: NextRequest, // Use NextRequest type
  { params }: { params: { planId: string } } // Keep params for context, but extract manually
) {
  // Workaround for potential canary issue: Extract planId from URL
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/'); // e.g., ['', 'api', 'plans', 'vps-basic']
  const planId = pathSegments[pathSegments.length - 1]; // Get the last segment

  if (!planId || planId === '[planId]') { // Extra check for safety
    console.error('Failed to extract planId from URL:', url.pathname);
    return NextResponse.json({ error: 'Plan ID could not be determined.' }, { status: 400 });
  }

  const plan = getPlanById(planId);

  if (!plan) {
    return NextResponse.json({ error: `Plan not found for ID: ${planId}` }, { status: 404 });
  }

  return NextResponse.json(plan, { status: 200 });
}
