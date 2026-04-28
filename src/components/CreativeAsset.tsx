'use client';

import { useState } from 'react';
import type { CreativeAsset as CreativeAssetType } from '@/types';

interface Props {
  creative: CreativeAssetType;
  onExport: (format: 'txt' | 'doc') => void;
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

export default function CreativeAsset({ creative, onExport }: Props) {
  if (creative.type === 'image') {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🖼️</span>
              <span className="font-semibold text-amber-800">AI Image Prompt</span>
            </div>
            <CopyButton text={creative.image_prompt} label="Copy Prompt" />
          </div>
          <p className="text-sm text-gray-700 leading-relaxed bg-white rounded-lg p-3 border border-amber-200">
            {creative.image_prompt}
          </p>
          <p className="text-xs text-amber-600 mt-2">
            Paste this prompt into Midjourney, DALL·E, or Adobe Firefly to generate your image.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onExport('txt')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export .txt
          </button>
          <button
            onClick={() => onExport('doc')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export .doc
          </button>
        </div>
      </div>
    );
  }

  const { hook, body, cta } = creative.script;
  const fullScript = `HOOK (0-3s):\n${hook}\n\nBODY (4-30s):\n${body}\n\nCTA (31-45s):\n${cta}`;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-violet-200 bg-violet-50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎬</span>
          <span className="font-semibold text-violet-800">Video Script</span>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-lg p-3 border border-violet-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-red-500">Hook · 0-3s</span>
              <CopyButton text={hook} label="Copy" />
            </div>
            <p className="text-sm text-gray-800">{hook}</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-violet-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Body · 4-30s</span>
              <CopyButton text={body} label="Copy" />
            </div>
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{body}</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-violet-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-green-500">CTA · 31-45s</span>
              <CopyButton text={cta} label="Copy" />
            </div>
            <p className="text-sm text-gray-800">{cta}</p>
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <CopyButton text={fullScript} label="Copy Full Script" />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onExport('txt')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export .txt
        </button>
        <button
          onClick={() => onExport('doc')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export .doc
        </button>
      </div>
    </div>
  );
}
