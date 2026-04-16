import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
        return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Helper to read body once (request.body is a stream, can only be read once)
    // We need to buffer it because we might try Blob then Local
    // But request.body can be passed to put() directly. 
    // If we read it for local, we consume it.
    // Solution: Clone the response? No, Request.
    // Better: We can rely on a specific logic: 
    // If token looks valid, use Blob. If not, use local. 
    // If Blob fails, we might have consumed the stream? 
    // 'put' consumes the stream. 
    // So we should decide BEFORE calling 'put'.

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const isProduction = process.env.NODE_ENV === 'production';

    // Check if token is present and NOT a placeholder
    const hasValidToken = token && !token.includes('fake_token') && !token.includes('example');

    // 1. Vercel Blob (Production or Valid Token)
    if (hasValidToken) {
        try {
            if (!request.body) {
                return NextResponse.json({ error: 'No file body provided' }, { status: 400 });
            }
            const blob = await put(filename, request.body, {
                access: 'public',
            });
            return NextResponse.json(blob);
        } catch (error) {
            console.error("Vercel Blob Upload Error:", error);
            // If in production, this is fatal
            if (isProduction) {
                return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
            }
            // If in dev, we could theoretically try local, but stream is consumed.
            // So we rely on strict token check above to avoid entering this block for fake tokens.
            return NextResponse.json({ error: "Upload failed (Blob): " + error.message }, { status: 500 });
        }
    }

    // 2. Local File System (Fallback for development)
    if (!isProduction) {
        try {
            console.log("Using Local Storage Fallback");

            const arrayBuffer = await request.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Unique name to avoid conflicts locally
            const uniqueName = `${Date.now()}-${filename}`;
            const uploadsDir = join(process.cwd(), 'public', 'uploads');

            await mkdir(uploadsDir, { recursive: true });
            const path = join(uploadsDir, uniqueName);

            await writeFile(path, buffer);

            return NextResponse.json({
                url: `/uploads/${uniqueName}`,
                pathname: uniqueName,
                contentType: 'image/jpeg' // Approximation, or derive from filename
            });
        } catch (error) {
            console.error("Local upload failed", error);
            return NextResponse.json({ error: "Local upload failed: " + error.message }, { status: 500 });
        }
    }

    // 3. No configuration found
    console.error("CRITICAL: BLOB_READ_WRITE_TOKEN is missing in production. Cannot upload files.");
    return NextResponse.json({
        error: "Server Configuration Error: File storage is not configured. Please add BLOB_READ_WRITE_TOKEN."
    }, { status: 500 });
}
