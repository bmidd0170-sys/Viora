import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { prompt } = body;

    // Validate prompt input
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    if (prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt cannot be empty' },
        { status: 400 }
      );
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Prompt is too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    // Call OpenAI DALL·E 2 API
    console.log('Generating image for prompt:', prompt);
    
    const response = await openai.images.generate({
      model: 'dall-e-2',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    // Extract image URL from response
    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      console.error('No image URL in OpenAI response:', response);
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      );
    }

    // Return prompt + imageUrl
    return NextResponse.json({
      prompt,
      imageUrl,
    });

  } catch (error: any) {
    // Handle OpenAI errors (500)
    console.error('Error generating image:', error);

    // Handle specific OpenAI error types
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key' },
        { status: 500 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 500 }
      );
    }

    if (error?.error?.code === 'content_policy_violation') {
      return NextResponse.json(
        { error: 'Prompt violates content policy' },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    );
  }
}
