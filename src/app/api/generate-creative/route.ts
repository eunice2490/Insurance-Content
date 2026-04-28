import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/anthropic';
import { buildImagePromptTemplate, buildVideoScriptPrompt } from '@/lib/prompts';
import type { FormInputs, PostResult, CreativeAsset } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { inputs, post }: { inputs: FormInputs; post: PostResult } =
      await req.json();

    const isReel = inputs.postType === 'Reel';
    const prompt = isReel
      ? buildVideoScriptPrompt(inputs, post)
      : buildImagePromptTemplate(inputs, post);

    const raw = await callClaude(prompt);

    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('Claude did not return valid JSON object.');
    }

    const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd));

    const creative: CreativeAsset = isReel
      ? { type: 'video', script: parsed.script }
      : { type: 'image', image_prompt: parsed.image_prompt };

    return NextResponse.json({ creative });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
