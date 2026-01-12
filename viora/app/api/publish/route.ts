import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, prompt } = body ?? {};

    // Validate prompt
    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }
    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Prompt is too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    // Validate imageUrl
    if (typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
      return NextResponse.json(
        { error: 'imageUrl is required and must be a non-empty string' },
        { status: 400 }
      );
    }
    if (!isValidUrl(imageUrl)) {
      return NextResponse.json(
        { error: 'imageUrl must be a valid http/https URL' },
        { status: 400 }
      );
    }
    if (imageUrl.length > 2048) {
      return NextResponse.json(
        { error: 'imageUrl is too long (max 2048 characters)' },
        { status: 400 }
      );
    }

    // Persist to DB (defaults for hearts, createdAt are applied by schema)
    const created = await prisma.publishedImage.create({
      data: { prompt, imageUrl },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    // JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    console.error('Error publishing image:', error);
    return NextResponse.json(
      { error: 'Failed to save image. Please try again.' },
      { status: 500 }
    );
  }
}
