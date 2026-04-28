import type { FormInputs, CalendarDay, PostResult } from '@/types';

export function buildCalendarPrompt(inputs: FormInputs): string {
  return `You are an expert social media content strategist specialising in insurance marketing in Southeast Asia.

Create a 7-day content calendar for an insurance agent with these details:
- Target Audience: ${inputs.targetAudience}
- Content Goals: ${inputs.contentGoals.join(', ')}
- Platform: ${inputs.platform}
- Insurance Topic: ${inputs.insuranceTopic}
- Post Format: ${inputs.postType}

COILO Framework: Each post should follow Context → Offer → Insight → Lead → Outcome.

Return ONLY a valid JSON array with exactly 7 objects. No explanation, no markdown fences.
[
  {
    "day": 1,
    "theme": "short theme title",
    "hook": "attention-grabbing opening line",
    "message": "core message for this day",
    "format": "${inputs.postType}",
    "cta": "clear call-to-action"
  }
]`;
}

export function buildPostPrompt(
  inputs: FormInputs,
  dayEntry: CalendarDay
): string {
  return `You are a professional social media copywriter for insurance agents.

Write a complete ${inputs.platform} post based on:
- Target Audience: ${inputs.targetAudience}
- Insurance Topic: ${inputs.insuranceTopic}
- Day Theme: ${dayEntry.theme}
- Hook: ${dayEntry.hook}
- Core Message: ${dayEntry.message}
- CTA: ${dayEntry.cta}
- Post Format: ${inputs.postType}

Platform tone guide:
- Facebook: conversational, story-driven, 150-300 words
- Instagram: punchy, emoji-friendly, 80-150 words
- TikTok: casual, energetic, 60-100 words
- LinkedIn: professional, insight-led, 150-250 words

Return ONLY valid JSON. No explanation, no markdown fences.
{
  "hook": "opening hook line",
  "value": "main value paragraph",
  "cta": "call-to-action line",
  "full_caption": "complete ready-to-post caption",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;
}

export function buildImagePromptTemplate(
  inputs: FormInputs,
  post: PostResult
): string {
  return `You are a visual content director creating social media graphics for insurance agents.

Create a detailed AI image generation prompt for:
- Platform: ${inputs.platform}
- Insurance Topic: ${inputs.insuranceTopic}
- Target Audience: ${inputs.targetAudience}
- Post Caption Summary: ${post.full_caption.slice(0, 200)}

Requirements:
- Photorealistic or clean illustration style
- Professional, warm, trustworthy aesthetic
- Include composition, lighting, colour palette, and subject description
- Suitable for ${inputs.platform} ${inputs.postType}

Return ONLY valid JSON. No explanation, no markdown fences.
{
  "image_prompt": "detailed prompt string for an AI image generator"
}`;
}

export function buildVideoScriptPrompt(
  inputs: FormInputs,
  post: PostResult
): string {
  return `You are a short-form video scriptwriter for insurance agents on ${inputs.platform}.

Write a Reel/short video script for:
- Insurance Topic: ${inputs.insuranceTopic}
- Target Audience: ${inputs.targetAudience}
- Post Caption: ${post.full_caption.slice(0, 200)}

Script guidelines:
- Hook: first 3 seconds, must stop the scroll
- Body: 3 punchy value points, 15-25 seconds
- CTA: clear end card action, 5 seconds
- Total duration: ~30-45 seconds
- Tone: energetic yet trustworthy

Return ONLY valid JSON. No explanation, no markdown fences.
{
  "script": {
    "hook": "first 3-second verbal hook",
    "body": "15-25 second main content with visual cues in [brackets]",
    "cta": "5-second closing call-to-action"
  }
}`;
}
