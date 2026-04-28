import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/anthropic';
import { buildPostPrompt } from '@/lib/prompts';
import type { FormInputs, CalendarDay, PostResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { inputs, dayEntry }: { inputs: FormInputs; dayEntry: CalendarDay } =
      await req.json();

    const prompt = buildPostPrompt(inputs, dayEntry);
    const raw = await callClaude(prompt);

    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('Claude did not return valid JSON object.');
    }

    const post: PostResult = JSON.parse(raw.slice(jsonStart, jsonEnd));
    return NextResponse.json({ post });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
