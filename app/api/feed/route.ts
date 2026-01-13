import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Pagination limits
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MIN_LIMIT = 1;
const MAX_LIMIT = 100;

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    // Parse and validate page
    let page = DEFAULT_PAGE;
    if (pageParam !== null) {
      const parsedPage = parseInt(pageParam, 10);
      if (isNaN(parsedPage) || parsedPage < 1) {
        return NextResponse.json(
          { error: 'Invalid page parameter. Must be a positive integer.' },
          { status: 400 }
        );
      }
      page = parsedPage;
    }

    // Parse and validate limit
    let limit = DEFAULT_LIMIT;
    if (limitParam !== null) {
      const parsedLimit = parseInt(limitParam, 10);
      if (isNaN(parsedLimit) || parsedLimit < MIN_LIMIT || parsedLimit > MAX_LIMIT) {
        return NextResponse.json(
          { 
            error: `Invalid limit parameter. Must be between ${MIN_LIMIT} and ${MAX_LIMIT}.` 
          },
          { status: 400 }
        );
      }
      limit = parsedLimit;
    }

    // Calculate offset for pagination
    const skip = (page - 1) * limit;

    // Query images with ordering (newest first) and count total
    const [images, totalCount] = await Promise.all([
      prisma.publishedImage.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          prompt: true,
          imageUrl: true,
          hearts: true,
          createdAt: true,
        },
      }),
      prisma.publishedImage.count(),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Return paginated response with consistent shape
    return NextResponse.json({
      images,
      page,
      total: totalCount,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching image feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image feed' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { id, hearts } = body ?? {};

    // Validate id parameter
    if (typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.json(
        { error: 'Image id is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate hearts parameter
    if (typeof hearts !== 'number') {
      return NextResponse.json(
        { error: 'Hearts must be a number' },
        { status: 400 }
      );
    }

    // Prevent negative values
    if (hearts < 0) {
      return NextResponse.json(
        { error: 'Hearts cannot be negative' },
        { status: 400 }
      );
    }

    // Ensure hearts is an integer
    if (!Number.isInteger(hearts)) {
      return NextResponse.json(
        { error: 'Hearts must be an integer' },
        { status: 400 }
      );
    }

    // Check if image exists before updating
    const existingImage = await prisma.publishedImage.findUnique({
      where: { id },
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Perform atomic update
    const updatedImage = await prisma.publishedImage.update({
      where: { id },
      data: { hearts },
      select: {
        id: true,
        prompt: true,
        imageUrl: true,
        hearts: true,
        createdAt: true,
      },
    });

    // Return updated image
    return NextResponse.json({
      success: true,
      data: updatedImage,
    });
  } catch (error) {
    console.error('Error updating image hearts:', error);
    return NextResponse.json(
      { error: 'Failed to update image hearts' },
      { status: 500 }
    );
  }
}
