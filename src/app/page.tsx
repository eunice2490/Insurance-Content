'use client';

import { useState, useCallback } from 'react';
import StepIndicator from '@/components/StepIndicator';
import InputForm from '@/components/InputForm';
import ContentCalendar from '@/components/ContentCalendar';
import PostResult from '@/components/PostResult';
import CreativeAsset from '@/components/CreativeAsset';
import PostingPrep from '@/components/PostingPrep';
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
      lines.push('(Paste this into Gemini [banana button] or Dreamina [Model 4.1])');
      lines.push(creative.image_prompt);
    } else {
      lines.push('--- VIDEO SCRIPT (use in HeyGen) ---');
      lines.push(`HOOK (0-3s):\n${creative.script.hook}`);
      lines.push(`\nBODY (4-30s):\n${creative.script.body}`);
      lines.push(`\nCTA (31-45s):\n${creative.script.cta}`);
    }
  }

  return lines.join('\n');
}

export default function Home() {
  // Internal app steps:
  // 1 = Configure form (pre-step)
  // 2 = Calendar (diagram Step 1)
  // 3 = Draft Post (diagram Step 2)
  // 4 = Creative 3.1/3.2 (diagram Step 3)
  // 5 = Post to Social Media (diagram Step 4)
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

  function handleProceedToPost() {
    setStep(5);
  }

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
            Follow the 4-step workflow to generate, create, and post your insurance content.
          </p>
        </div>

        {/* Step indicator only shows once calendar is generated */}
        {step >= 2 && <StepIndicator currentStep={step} />}

        {/* Error Banner */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-3">
            <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1 (pre): Input Form */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Generate 7-Day Content Calendar</h2>
                <p className="text-xs text-gray-500">Configure your preferences to build a personalised plan</p>
              </div>
            </div>
            <InputForm onSubmit={handleGenerateCalendar} loading={loadingCalendar} />
          </div>
        )}

        {/* Step 2 (diagram Step 1): Calendar */}
        {step >= 2 && calendar && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                  📅
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">7-Day Content Calendar</h2>
                  <p className="text-xs text-gray-500">
                    {inputs?.insuranceTopic} · {inputs?.platform} · {inputs?.targetAudience}
                  </p>
                </div>
              </div>
              <button onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600 underline shrink-0">
                Start over
              </button>
            </div>
            <ContentCalendar
              calendar={calendar}
              selectedDay={selectedDay?.day ?? null}
              loadingDay={loadingDay}
              onSelectDay={handleSelectDay}
            />
          </div>
        )}

        {/* Step 3 (diagram Step 2): Draft Post */}
        {step >= 3 && post && selectedDay && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                ✍️
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Draft Post — Day {selectedDay.day}: {selectedDay.theme}
                </h2>
                <p className="text-xs text-gray-500">Hook · Value · CTA · Full Caption · Hashtags</p>
              </div>
            </div>
            <PostResult
              post={post}
              onGenerateCreative={handleGenerateCreative}
              loadingCreative={loadingCreative}
              postType={inputs?.postType ?? 'Static Post'}
            />
          </div>
        )}

        {/* Step 4 (diagram Step 3): Creative 3.1 / 3.2 */}
        {step >= 4 && creative && inputs && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold shrink-0">
                {creative.type === 'image' ? '🖼️' : '🎬'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {creative.type === 'image'
                    ? 'Step 3.1 — Generate Image Prompt'
                    : 'Step 3.2 — Generate Video Script'}
                </h2>
                <p className="text-xs text-gray-500">
                  {creative.type === 'image'
                    ? 'Use in Gemini (banana button) or Dreamina (Model 4.1)'
                    : 'Record yourself or generate with HeyGen'}
                </p>
              </div>
            </div>
            <CreativeAsset creative={creative} onProceedToPost={handleProceedToPost} />
          </div>
        )}

        {/* Step 5 (diagram Step 4): Post to Social Media */}
        {step >= 5 && creative && post && inputs && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold shrink-0">
                🚀
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Post to Social Media</h2>
                <p className="text-xs text-gray-500">
                  Follow the checklist to publish on {inputs.platform}
                </p>
              </div>
            </div>
            <PostingPrep
              inputs={inputs}
              post={post}
              creative={creative}
              onExport={handleExport}
              onStartOver={handleReset}
            />
          </div>
        )}
      </div>
    </main>
  );
}
