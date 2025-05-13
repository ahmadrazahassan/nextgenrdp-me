import prisma from '@/lib/db';
import path from 'path';
import fs from 'fs/promises';
import { NextRequest } from 'next/server';

export interface MediaItem {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  path: string;
  thumbnailPath: string;
  status: 'approved' | 'pending' | 'rejected' | 'flagged';
  tags: string[];
  orderId?: string;
}

/**
 * Get all media items
 */
export async function getAllMediaItems() {
  // Execute SQL query since we don't have a Media model in Prisma
  const result = await prisma.$queryRaw<any[]>`
    SELECT m.*, u.email, u."fullName"
    FROM "Media" m
    JOIN "users" u ON m."userId" = u.id
    ORDER BY m."uploadDate" DESC
  `;
  
  return result.map(formatMediaItem);
}

/**
 * Get media items by status
 */
export async function getMediaItemsByStatus(status: string) {
  const result = await prisma.$queryRaw<any[]>`
    SELECT m.*, u.email, u."fullName"
    FROM "Media" m
    JOIN "users" u ON m."userId" = u.id
    WHERE m.status = ${status}
    ORDER BY m."uploadDate" DESC
  `;
  
  return result.map(formatMediaItem);
}

/**
 * Get media items by user ID
 */
export async function getMediaItemsByUserId(userId: string) {
  const result = await prisma.$queryRaw<any[]>`
    SELECT m.*, u.email, u."fullName"
    FROM "Media" m
    JOIN "users" u ON m."userId" = u.id
    WHERE m."userId" = ${userId}
    ORDER BY m."uploadDate" DESC
  `;
  
  return result.map(formatMediaItem);
}

/**
 * Get media item by ID
 */
export async function getMediaItemById(id: string) {
  const result = await prisma.$queryRaw<any[]>`
    SELECT m.*, u.email, u."fullName"
    FROM "Media" m
    JOIN "users" u ON m."userId" = u.id
    WHERE m.id = ${id}
  `;
  
  if (result.length === 0) {
    return null;
  }
  
  return formatMediaItem(result[0]);
}

/**
 * Update media item status
 */
export async function updateMediaItemStatus(id: string, status: 'approved' | 'pending' | 'rejected' | 'flagged') {
  const result = await prisma.$queryRaw<any[]>`
    UPDATE "Media"
    SET status = ${status}::"MediaStatus"
    WHERE id = ${id}
    RETURNING *
  `;
  
  if (result.length === 0) {
    return null;
  }
  
  return formatMediaItem(result[0]);
}

/**
 * Delete media item
 */
export async function deleteMediaItem(id: string) {
  // First get the media item to know file paths
  const mediaItem = await getMediaItemById(id);
  
  if (!mediaItem) {
    return false;
  }
  
  // Delete from database
  await prisma.$queryRaw`
    DELETE FROM "Media"
    WHERE id = ${id}
  `;
  
  // Delete the actual files
  try {
    const publicDir = path.join(process.cwd(), 'public');
    await fs.unlink(path.join(publicDir, mediaItem.path));
    
    if (mediaItem.thumbnailPath) {
      await fs.unlink(path.join(publicDir, mediaItem.thumbnailPath));
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting media files:', error);
    return false;
  }
}

/**
 * Save a new media item
 */
export async function saveMediaItem(data: {
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  path: string;
  thumbnailPath: string;
  status?: 'approved' | 'pending' | 'rejected' | 'flagged';
  tags?: string[];
  orderId?: string;
}) {
  const { tags = [], ...mediaData } = data;
  
  // Set default status if not provided
  if (!mediaData.status) {
    mediaData.status = 'pending';
  }
  
  // Convert tags to JSON string
  const tagsJson = JSON.stringify(tags);
  
  const result = await prisma.$queryRaw<any[]>`
    INSERT INTO "Media" (
      "id", "userId", "fileName", "fileType", "fileSize", "path", "thumbnailPath", 
      "status", "tags", "orderId", "uploadDate"
    ) VALUES (
      gen_random_uuid(),
      ${mediaData.userId},
      ${mediaData.fileName},
      ${mediaData.fileType},
      ${mediaData.fileSize},
      ${mediaData.path},
      ${mediaData.thumbnailPath},
      ${mediaData.status}::"MediaStatus",
      ${tagsJson}::jsonb,
      ${mediaData.orderId || null},
      NOW()
    ) RETURNING *
  `;
  
  return formatMediaItem(result[0]);
}

/**
 * Format raw media item from database
 */
function formatMediaItem(rawItem: any): MediaItem & {userName: string, userEmail: string} {
  return {
    id: rawItem.id,
    userId: rawItem["userId"],
    userName: rawItem["fullName"] || 'Unknown',
    userEmail: rawItem.email,
    fileName: rawItem["fileName"],
    fileType: rawItem["fileType"],
    fileSize: rawItem["fileSize"],
    uploadDate: rawItem["uploadDate"],
    path: rawItem["path"],
    thumbnailPath: rawItem["thumbnailPath"],
    status: rawItem["status"],
    tags: Array.isArray(rawItem["tags"]) ? rawItem["tags"] : JSON.parse(rawItem["tags"] || '[]'),
    orderId: rawItem["orderId"]
  };
}

export async function PATCH(request: NextRequest, context: { params: { mediaId: string } }) {
  const { mediaId } = await context.params;
  // ...
} 