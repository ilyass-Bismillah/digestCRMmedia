import { NextRequest, NextResponse } from 'next/server';
import { getPresignedUploadUrl, uploadFileToR2 } from '@/lib/storage/r2';

export async function POST(req: NextRequest) {
  try {
    const contentTypeHeader = req.headers.get('content-type') || '';

    // 1. JSON Request for Presigned Upload URL
    if (contentTypeHeader.includes('application/json')) {
      const body = await req.json();
      const { filename, contentType = 'application/octet-stream', folder = 'uploads' } = body;

      if (!filename) {
        return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
      }

      // Generate sanitized unique key
      const timestamp = Date.now();
      const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
      const key = `${folder}/${timestamp}-${sanitizedName}`;

      const presignedData = await getPresignedUploadUrl(key, contentType);

      if (!presignedData) {
        // Fallback simulation if R2 environment variables are not yet configured
        return NextResponse.json({
          simulated: true,
          uploadUrl: null,
          publicUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80`,
          key,
        });
      }

      return NextResponse.json(presignedData);
    }

    // 2. Direct Multipart FormData Upload
    if (contentTypeHeader.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const folder = (formData.get('folder') as string) || 'uploads';

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const key = `${folder}/${timestamp}-${sanitizedName}`;

      const uploadResult = await uploadFileToR2(key, buffer, file.type);

      if (!uploadResult) {
        return NextResponse.json({
          simulated: true,
          publicUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80`,
          key,
        });
      }

      return NextResponse.json(uploadResult);
    }

    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in /api/upload route:', error);
    return NextResponse.json(
      { error: error?.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
