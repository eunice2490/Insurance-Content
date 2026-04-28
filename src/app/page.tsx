'use client';

import { useState, useCallback } from 'react';
import StepIndicator from '@/components/StepIndicator';
import InputForm from '@/components/InputForm';
import ContentCalendar from '@/components/ContentCalendar';
import PostResult from '@/components/PostResult';
import CreativeAsset from '@/components/CreativeAsset';
import type {
  FormInputs,
  CalendarDay,
  PostResult as PostResultType,
  CreativeAsset as CreativeAssetType,
  AppStep,
} from '@/types';

function buildExportText(
  inputs: FormInputs,
  selectedDay: CalendarDay | null,
  post: PostResultType | null,
  creative: CreativeAssetType | null
): string {
  const lines: string[] = [
    '=== AI INSURANCE CONTENT GENERATOR ===',
    `Platform: ${inputs.platform} | Topic: ${inputs.insuranceTopic} | Audience: ${inputs.targetAudience}`,
    '',
  ];

  if (selectedDay) {
    lines.push(`--- DAY ${selectedDay.day}: ${selectedDay.theme} ---`);
    lines.push(`Hook: ${selectedDay.hook}`);
    lines.push(`Message: ${selectedDay.message}`);
    lines.push(`CTA: ${selectedDay.cta}`);
    lines.push('');
  }

  if (post) {
    lines.push('--- POST CONTENT ---');
    lines.push(`Hook: ${post.hook}`);
    lines.push(`Value: ${post.value}`);
    lines.push(`CTA: ${post.cta}`);
    lines.push('');
    lines.push('--- FULL CAPTION ---');
    lines.push(post.full_caption);
    lines.push('');
    lines.push('--- HASHTAGS ---');
    lines.push(post.hashtags.map((h) => `#${h.replace(/^#/, '')}`).join(' '));
    lines.push('');
  }

  if (creative) {
    if (creative.type === 'image') {
      lines.push('--- IMAGE PROMPT ---');
      lines.push(creative.image_prompt);
    } else {
      lines.push('--- VIDEO SCRIPT ---');
      lines.push(`HOOK (0-3s):\n${creative.script.hook}`);
      lines.push(`\nBODY (4-30s):\n${creative.script.body}`);
      lines.push(`\nCTA (31-45s):\n${creative.script.cta}`);
    }
  }

  return lines.join('\n');
}

export default function Home() {
  const [step, setStep] = useState<AppStep>(1);
  const [inputs, setInputs] = useState<FormInputs | null>(null);
  const [calendar, setCalendar] = useState<CalendarDay[] | null>(null);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [post, setPost] = useState<PostResultType | null>(null);
  const [creative, setCreative] = useState<CreativeAssetType | null>(null);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [loadingDay, setLoadingDay] = useState<number | null>(null);
  const [loadingCreative, setLoadingCreative] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCalendar = useCallback(async (formInputs: FormInputs) => {
    setError(null);
    setLoadingCalendar(true);
    setInputs(formInputs);

    try {
      const res = await fetch('/api/generate-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formInputs),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate calendar.');
      setCalendar(data.calendar);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoadingCalendar(false);
    }
  }, []);

  const handleSelectDay = useCallback(
    async (day: CalendarDay) => {
      if (!inputs) return;
      setError(null);
      setSelectedDay(day);
      setPost(null);
      setCreative(null);
      setLoadingDay(day.day);

      try {
        const res = await fetch('/api/generate-post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputs, dayEntry: day }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to generate post.');
        setPost(data.post);
        setStep(3);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setLoadingDay(null);
      }
    },
    [inputs]
  );

  const handleGenerateCreative = useCallback(async () => {
    if (!inputs || !post) return;
    setError(null);
    setLoadingCreative(true);

    try {
      const res = await fetch('/api/generate-creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, post }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate creative.');
      setCreative(data.creative);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoadingCreative(false);
    }
  }, [inputs, post]);

  function handleExport(format: 'txt' | 'doc') {
    if (!inputs) return;
    const content = buildExportText(inputs, selectedDay, post, creative);
    const mimeType = format === 'doc' ? 'application/msword' : 'text/plain';
    const ext = format === 'doc' ? 'doc' : 'txt';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `insurance-content-day${selectedDay?.day ?? ''}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setStep(1);
    setInputs(null);
    setCalendar(null);
    setSelectedDay(null);
    setPost(null);
    setCreative(null);
    setError(null);
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Powered by Claude AI
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            AI Insurance Content Generator
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Generate a 7-day social media content calendar — from caption to creative — in minutes.
          </p>
        </div>

        <StepIndicator currentStep={step} />

        {/* Error Banner */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-3">
            <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1: Input Form */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Step 1 — Configure Your Content</h2>
            <p className="text-sm text-gray-500 mb-6">Fill in your preferences to generate a personalised content plan.</p>
            <InputForm onSubmit={handleGenerateCalendar} loading={loadingCalendar} />
          </div>
        )}

        {/* Step 2: Calendar */}
        {step >= 2 && calendar && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-gray-900">Step 2 — Your 7-Day Calendar</h2>
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Start over
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Topic: <span className="font-medium text-gray-700">{inputs?.insuranceTopic}</span> &nbsp;·&nbsp;
              {inputs?.platform} &nbsp;·&nbsp; {inputs?.targetAudience}
            </p>
            <ContentCalendar
              calendar={calendar}
              selectedDay={selectedDay?.day ?? null}
              loadingDay={loadingDay}
              onSelectDay={handleSelectDay}
            />
          </div>
        )}

        {/* Step 3: Post Result */}
        {step >= 3 && post && selectedDay && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Step 3 — Post for Day {selectedDay.day}: {selectedDay.theme}
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Your generated caption and content pieces. Edit directly if needed before copying.
            </p>
            <PostResult
              post={post}
              onGenerateCreative={handleGenerateCreative}
              loadingCreative={loadingCreative}
              postType={inputs?.postType ?? 'Static Post'}
            />
          </div>
        )}

        {/* Step 4: Creative Asset */}
        {step >= 4 && creative && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Step 4 — {creative.type === 'image' ? 'Image Prompt' : 'Video Script'}
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              {creative.type === 'image'
                ? 'Use this prompt in any AI image generator to create your post visual.'
                : 'Your complete short-video script — ready to film.'}
            </p>
            <CreativeAsset creative={creative} onExport={handleExport} />

            <div className="mt-6 pt-5 border-t border-gray-100">
              <button
                onClick={handleReset}
                className="w-full text-center text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
              >
                Generate content for another topic →
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
