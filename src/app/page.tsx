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
      lines.push('(Paste into Gemini [banana button] or Dreamina [Model 4.1])');
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

// ─── Landing screen ───────────────────────────────────────────────────────────
function LandingScreen({ onStart }: { onStart: () => void }) {
  const features = [
    { icon: '📅', step: '01', title: '7-Day Content Calendar', desc: 'AI plans a full week of themed insurance content tailored to your audience and platform.' },
    { icon: '✍️', step: '02', title: 'Draft Perfect Posts', desc: 'Get a ready-to-paste caption with hook, value, CTA and hashtags — for any day.' },
    { icon: '🎨', step: '03', title: 'Generate Creative Assets', desc: 'Create an AI image prompt (Gemini / Dreamina) or a full video script (HeyGen).' },
    { icon: '🚀', step: '04', title: 'Post to Social Media', desc: 'Platform-specific checklist guides you from content to published post in minutes.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/30">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Powered by Claude AI &amp; ChatGPT Image 2
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4 max-w-2xl">
          AI Insurance<br />Content Generator
        </h1>
        <p className="text-blue-100 text-base sm:text-lg max-w-xl mb-10 leading-relaxed">
          Create a full week of professional social media content for your insurance business — captions, images, and video scripts — in under 5 minutes.
        </p>

        {/* START BUTTON */}
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 bg-white text-blue-700 font-bold text-lg px-10 py-4 rounded-2xl shadow-2xl hover:shadow-blue-900/40 hover:scale-105 active:scale-100 transition-all duration-200"
        >
          <span className="text-2xl">🚀</span>
          Get Started — It&apos;s Free
          <svg
            className="w-5 h-5 transition-transform group-hover:translate-x-1"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        <p className="text-blue-200 text-xs mt-4">No login required · Results in seconds</p>
      </div>

      {/* Workflow steps */}
      <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 px-4 py-10">
        <p className="text-center text-white/70 text-xs font-semibold uppercase tracking-widest mb-6">
          4-Step AI Workflow
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {features.map((f) => (
            <div key={f.step} className="bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{f.icon}</span>
                <span className="text-white/50 text-xs font-bold">{f.step}</span>
              </div>
              <p className="text-white font-semibold text-sm mb-1">{f.title}</p>
              <p className="text-blue-100 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div className="bg-white/5 border-t border-white/10 py-5 px-4">
        <p className="text-center text-white/40 text-xs mb-3">Works for</p>
        <div className="flex items-center justify-center gap-6 text-white/70 text-sm font-medium">
          {['Facebook', 'Instagram', 'TikTok', 'LinkedIn'].map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main app ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [step, setStep] = useState<AppStep>(0);
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

  function handleProceedToPost() { setStep(5); }

  function handleExport(format: 'txt' | 'doc') {
    if (!inputs) return;
    const content = buildExportText(inputs, selectedDay, post, creative);
    const mimeType = format === 'doc' ? 'application/msword' : 'text/plain';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `insurance-content-day${selectedDay?.day ?? ''}.${format === 'doc' ? 'doc' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setStep(0);
    setInputs(null);
    setCalendar(null);
    setSelectedDay(null);
    setPost(null);
    setCreative(null);
    setError(null);
  }

  // ── Landing screen ──
  if (step === 0) {
    return <LandingScreen onStart={() => setStep(1)} />;
  }

  // ── Workflow screens ──
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 hover:bg-blue-200 transition-colors"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            AI Insurance Content Generator
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {step === 1 && 'Configure Your Content'}
            {step === 2 && 'Your 7-Day Calendar'}
            {step === 3 && 'Your Draft Post'}
            {step === 4 && 'Creative Assets'}
            {step === 5 && 'Ready to Post!'}
          </h1>
        </div>

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

        {/* Step 1: Input Form */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">1</div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Generate 7-Day Content Calendar</h2>
                <p className="text-xs text-gray-500">Configure your preferences to build a personalised plan</p>
              </div>
            </div>
            <InputForm onSubmit={handleGenerateCalendar} loading={loadingCalendar} />
          </div>
        )}

        {/* Step 2: Calendar */}
        {step >= 2 && calendar && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">📅</div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">7-Day Content Calendar</h2>
                  <p className="text-xs text-gray-500">{inputs?.insuranceTopic} · {inputs?.platform} · {inputs?.targetAudience}</p>
                </div>
              </div>
              <button onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600 underline shrink-0">← Back to home</button>
            </div>
            <ContentCalendar calendar={calendar} selectedDay={selectedDay?.day ?? null} loadingDay={loadingDay} onSelectDay={handleSelectDay} />
          </div>
        )}

        {/* Step 3: Draft Post */}
        {step >= 3 && post && selectedDay && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">✍️</div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Draft Post — Day {selectedDay.day}: {selectedDay.theme}</h2>
                <p className="text-xs text-gray-500">Hook · Value · CTA · Full Caption · Hashtags</p>
              </div>
            </div>
            <PostResult post={post} onGenerateCreative={handleGenerateCreative} loadingCreative={loadingCreative} postType={inputs?.postType ?? 'Static Post'} />
          </div>
        )}

        {/* Step 4: Creative */}
        {step >= 4 && creative && inputs && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold shrink-0">
                {creative.type === 'image' ? '🖼️' : '🎬'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {creative.type === 'image' ? 'Step 3.1 — Generate Image Prompt' : 'Step 3.2 — Generate Video Script'}
                </h2>
                <p className="text-xs text-gray-500">
                  {creative.type === 'image' ? 'Generate with ChatGPT Image 2, Gemini, or Dreamina' : 'Record yourself or use HeyGen'}
                </p>
              </div>
            </div>
            <CreativeAsset creative={creative} onProceedToPost={handleProceedToPost} />
          </div>
        )}

        {/* Step 5: Post to Social Media */}
        {step >= 5 && creative && post && inputs && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold shrink-0">🚀</div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Post to Social Media</h2>
                <p className="text-xs text-gray-500">Follow the checklist to publish on {inputs.platform}</p>
              </div>
            </div>
            <PostingPrep inputs={inputs} post={post} creative={creative} onExport={handleExport} onStartOver={handleReset} />
          </div>
        )}

      </div>
    </main>
  );
}
