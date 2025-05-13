import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { saveMediaItem } from '@/repositories/mediaRepository';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string | null;
    const orderId = formData.get('orderId') as string | null;
    // Optionally, you can add tags or other fields here

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "No userId provided." }, { status: 400 });
    }

    // Basic validation (can be expanded)
    if (file.size > 5 * 1024 * 1024) { // Max 5MB
        return NextResponse.json({ error: "File is too large (max 5MB)." }, { status: 413 });
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']; // Added PDF
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` }, { status: 415 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique directory for the upload to prevent filename conflicts and organize
    const uniqueFolderName = uuidv4();
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', uniqueFolderName);
    
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (mkdirError: any) {
        console.error("Error creating upload directory:", mkdirError);
        return NextResponse.json({ error: "Failed to create upload directory on server.", details: mkdirError.message }, { status: 500 });
    }

    // Sanitize filename by using a new unique one, keeping original extension
    const originalFileName = file.name;
    const fileExtension = path.extname(originalFileName);
    const uniqueFileName = `${uuidv4()}${fileExtension}`; // e.g., 'some-uuid.jpg'
    const filePath = path.join(uploadDir, uniqueFileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFolderName}/${uniqueFileName}`;

    // Save to Media table
    let mediaRecord = null;
    try {
      mediaRecord = await saveMediaItem({
        userId,
        fileName: uniqueFileName,
        fileType: file.type,
        fileSize: file.size,
        path: publicUrl,
        thumbnailPath: publicUrl, // You can generate a real thumbnail if needed
        status: 'pending', // Default status
        tags: [], // Add tags if needed
        orderId: orderId || undefined,
      });
    } catch (dbError: any) {
      console.error('Error saving media record:', dbError);
      return NextResponse.json({ error: 'Failed to save media record.', details: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ 
        success: true, 
        message: 'File uploaded and media record saved successfully', 
        url: publicUrl,
        fileName: uniqueFileName, // The new name of the file on the server
        originalName: originalFileName, // The original name of the file from the client
        size: file.size,
        type: file.type,
        media: mediaRecord
    }, { status: 201 });

  } catch (error: any) {
    console.error("Upload error:", error);
    // Distinguish between client errors and server errors if possible
    if (error.message && (error.message.includes("File type") || error.message.includes("File size"))) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "An unexpected error occurred during file upload.", details: error.message }, { status: 500 });
  }
} 