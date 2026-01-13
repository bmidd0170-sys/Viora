import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body; // 'like' or 'unlike'

    // Validate id parameter
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid image id' },
        { status: 400 }
      );
    }

    // Validate action
    if (action !== 'like' && action !== 'unlike') {
      return NextResponse.json(
        { error: 'Action must be "like" or "unlike"' },
        { status: 400 }
      );
    }

    // Toggle hearts atomically
    const updatedImage = await prisma.publishedImage.update({
      where: { id },
      data: {
        hearts: {
          [action === 'like' ? 'increment' : 'decrement']: 1,
        },
      },
      select: {
        id: true,
        prompt: true,
        imageUrl: true,
        hearts: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedImage,
      action,
    });
  } catch (error: any) {
    // Handle record not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    console.error('Error liking image:', error);
    return NextResponse.json(
      { error: 'Failed to like image' },
      { status: 500 }
    );
  }
}
