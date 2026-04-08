import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { photos } from '@/db/schema';
import { nanoid } from 'nanoid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string || '';
    const altText = formData.get('altText') as string || '';
    const jobId = formData.get('jobId') as string || null;
    const leadId = formData.get('leadId') as string || null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    const photoId = `PHOTO-${nanoid(8)}`;
    const filename = `${photoId}-${Date.now()}.${file.name.split('.').pop()}`;
    
    // Upload to Vercel Blob or external storage
    // For now, we'll store as data URL for demo
    // In production, use: import { put } from '@vercel/blob';
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    await db.insert(photos).values({
      id: photoId,
      jobId,
      leadId,
      url: dataUrl,
      title: title || file.name,
      altText,
      mimeType: file.type,
      size: file.size,
      status: 'ready',
    });

    return NextResponse.json({
      success: true,
      photo: {
        id: photoId,
        url: dataUrl,
        title: title || file.name,
        altText,
        mimeType: file.type,
        size: file.size,
      },
    });
  } catch (error) {
    console.error('Photo upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const jobId = searchParams.get('jobId');
    const leadId = searchParams.get('leadId');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (jobId) where.jobId = jobId;
    if (leadId) where.leadId = leadId;

    const allPhotos = await db.select().from(photos).where(where).limit(limit).offset(skip);
    const total = allPhotos.length;

    return NextResponse.json({
      photos: allPhotos,
      pagination: {
        page,
        limit,
        total,
        hasMore: total >= limit,
      },
    });
  } catch (error) {
    console.error('Photo list failed:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get('id');

    if (!photoId) {
      return NextResponse.json({ error: 'Photo ID required' }, { status: 400 });
    }

    await db.delete(photos).where(photos.id.eq(photoId));

    return NextResponse.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Photo delete failed:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
