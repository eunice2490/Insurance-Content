import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { prompt, apiKey } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Image prompt is required.' }, { status: 400 });
    }

    const key = apiKey?.trim() || process.env.OPENAI_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: 'OpenAI API key is required. Please enter your key above.' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey: key });

    // gpt-image-1 (ChatGPT Image 2) — highest quality, most accurate to prompt
    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'high',
    });

    // gpt-image-1 always returns b64_json
    const b64 = response.data?.[0]?.b64_json;

    if (!b64) throw new Error('No image returned from gpt-image-1.');

    return NextResponse.json({ imageB64: b64, revisedPrompt: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const clean = message.includes('Incorrect API key')
      ? 'Invalid OpenAI API key. Please check and try again.'
      : message;
    return NextResponse.json({ error: clean }, { status: 500 });
  }
}
