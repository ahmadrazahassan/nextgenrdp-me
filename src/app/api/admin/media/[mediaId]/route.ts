import { NextRequest, NextResponse } from 'next/server';
import { getMediaItemById, updateMediaItemStatus, deleteMediaItem } from '@/repositories/mediaRepository';
import { jwtVerify } from 'jose';
import prisma from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";

async function getAdminUser(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub) return null;
    const user = await prisma.user.findUnique({
      where: { id: payload.sub.toString() },
      select: { id: true, isAdmin: true }
    });
    if (!user || !user.isAdmin) return null;
    return user;
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { mediaId: string } }
) {
  try {
    const user = await getAdminUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const { mediaId } = params;
    const mediaItem = await getMediaItemById(mediaId);
    if (!mediaItem) {
      return NextResponse.json(
        { error: 'Media item not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(mediaItem);
  } catch (error) {
    console.error('Error fetching media item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media item' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { mediaId: string } }
) {
  try {
    const user = await getAdminUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const { mediaId } = params;
    const body = await request.json();
    const { status } = body;
    if (!status || !['approved', 'pending', 'rejected', 'flagged'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    const updatedItem = await updateMediaItemStatus(mediaId, status);
    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Media item not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating media item:', error);
    return NextResponse.json(
      { error: 'Failed to update media item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { mediaId: string } }
) {
  try {
    const user = await getAdminUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const { mediaId } = params;
    const result = await deleteMediaItem(mediaId);
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to delete media item or item not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media item:', error);
    return NextResponse.json(
      { error: 'Failed to delete media item' },
      { status: 500 }
    );
  }
} 