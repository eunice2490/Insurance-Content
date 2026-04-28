import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/anthropic';
import { buildCalendarPrompt } from '@/lib/prompts';
import type { FormInputs, CalendarDay } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const inputs: FormInputs = await req.json();

    if (!inputs.insuranceTopic?.trim()) {
      return NextResponse.json({ error: 'Insurance topic is required.' }, { status: 400 });
    }

    const prompt = buildCalendarPrompt(inputs);
    const raw = await callClaude(prompt);

    const jsonStart = raw.indexOf('[');
    const jsonEnd = raw.lastIndexOf(']') + 1;
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('Claude did not return valid JSON array.');
    }

    const calendar: CalendarDay[] = JSON.parse(raw.slice(jsonStart, jsonEnd));
    return NextResponse.json({ calendar });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
