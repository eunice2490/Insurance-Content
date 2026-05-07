import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { prompt, apiKey } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Image prompt is required.' }, { status: 400 });
    }

    // Use key from request body (user-provided) or fallback to env
    const key = apiKey?.trim() || process.env.OPENAI_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: 'OpenAI API key is required. Please enter your key above.' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey: key });

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'b64_json',
    });

    const b64 = response.data?.[0]?.b64_json;
    const revisedPrompt = response.data?.[0]?.revised_prompt ?? prompt;

    if (!b64) throw new Error('No image returned from DALL-E.');

    return NextResponse.json({ imageB64: b64, revisedPrompt });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    // Surface OpenAI specific errors clearly
    const clean = message.includes('Incorrect API key')
      ? 'Invalid OpenAI API key. Please check and try again.'
      : message;
    return NextResponse.json({ error: clean }, { status: 500 });
  }
}
