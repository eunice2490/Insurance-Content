'use client';

import { useState } from 'react';
import type { CreativeAsset as CreativeAssetType } from '@/types';

interface Props {
  creative: CreativeAssetType;
  onProceedToPost: () => void;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:border-blue-400 hover:text-blue-600 transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

export default function CreativeAsset({ creative, onProceedToPost }: Props) {
  if (creative.type === 'image') {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🖼️</span>
              <div>
                <p className="font-semibold text-amber-800">AI Image Prompt</p>
                <p className="text-xs text-amber-600">Step 3.1 — Static Post</p>
              </div>
            </div>
            <CopyButton text={creative.image_prompt} label="Copy Prompt" />
          </div>
          <p className="text-sm text-gray-700 leading-relaxed bg-white rounded-lg p-3 border border-amber-200">
            {creative.image_prompt}
          </p>
        </div>

        {/* Where to use */}
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Where to Create Your Image</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">✨</span>
                <span className="text-sm font-semibold text-blue-800">Gemini</span>
              </div>
              <p className="text-xs text-blue-700">
                Go to Gemini → activate the <strong>banana button</strong> → paste prompt → generate
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 border border-purple-100 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">🎨</span>
                <span className="text-sm font-semibold text-purple-800">Dreamina</span>
              </div>
              <p className="text-xs text-purple-700">
                Open Dreamina → choose <strong>Model 4.1</strong> → paste prompt → generate
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onProceedToPost}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Proceed to Post to Social Media →
        </button>
      </div>
    );
  }

  const { hook, body, cta } = creative.script;
  const fullScript = `HOOK (0-3s):\n${hook}\n\nBODY (4-30s):\n${body}\n\nCTA (31-45s):\n${cta}`;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-violet-200 bg-violet-50 p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🎬</span>
          <div>
            <p className="font-semibold text-violet-800">Video Script</p>
            <p className="text-xs text-violet-600">Step 3.2 — Reel</p>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="bg-white rounded-lg p-3 border border-violet-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-red-500">Hook · 0–3s</span>
              <CopyButton text={hook} label="Copy" />
            </div>
            <p className="text-sm text-gray-800">{hook}</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-violet-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Body · 4–30s</span>
              <CopyButton text={body} label="Copy" />
            </div>
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{body}</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-violet-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-green-500">CTA · 31–45s</span>
              <CopyButton text={cta} label="Copy" />
            </div>
            <p className="text-sm text-gray-800">{cta}</p>
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <CopyButton text={fullScript} label="Copy Full Script" />
        </div>
      </div>

      {/* HeyGen tip */}
      <div className="rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Create Your AI Video</p>
        <div className="rounded-lg bg-rose-50 border border-rose-100 p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🤖</span>
            <span className="text-sm font-semibold text-rose-800">HeyGen</span>
          </div>
          <p className="text-xs text-rose-700">
            Copy the full script → open <strong>HeyGen</strong> → create a new video → paste the script into the script editor → choose your AI avatar → generate your Reel.
          </p>
        </div>
      </div>

      <button
        onClick={onProceedToPost}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        Proceed to Post to Social Media →
      </button>
    </div>
  );
}
