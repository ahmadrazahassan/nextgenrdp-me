import { NextRequest, NextResponse } from 'next/server';
import { getAllMediaItems, getMediaItemsByStatus } from '@/repositories/mediaRepository';
import { verifyAdmin } from '@/lib/authUtils';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and authorization using JWT
    if (!await verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden' },
        { status: 403 }
      );
    }
    
    // Get status filter from query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // Get media items (filtered by status if provided)
    const mediaItems = status 
      ? await getMediaItemsByStatus(status)
      : await getAllMediaItems();

    return NextResponse.json(mediaItems);
  } catch (error) {
    console.error('Error fetching media items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media items' },
      { status: 500 }
    );
  }
} 