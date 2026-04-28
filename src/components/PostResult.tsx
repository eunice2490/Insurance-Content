'use client';

import { useState } from 'react';
import type { PostResult as PostResultType } from '@/types';

interface Props {
  post: PostResultType;
  onGenerateCreative: () => void;
  loadingCreative: boolean;
  postType: string;
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

export default function PostResult({ post, onGenerateCreative, loadingCreative, postType }: Props) {
  return (
    <div className="space-y-5">
      {/* Hook */}
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Hook</span>
          <CopyButton text={post.hook} label="Copy Hook" />
        </div>
        <p className="text-sm text-gray-800 font-medium">{post.hook}</p>
      </div>

      {/* Value */}
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">Value</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{post.value}</p>
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-500">Call to Action</span>
          <CopyButton text={post.cta} label="Copy CTA" />
        </div>
        <p className="text-sm text-gray-800 font-medium">{post.cta}</p>
      </div>

      {/* Full Caption */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">Full Caption</span>
          <CopyButton text={post.full_caption} label="Copy Caption" />
        </div>
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{post.full_caption}</p>
      </div>

      {/* Hashtags */}
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-green-600">Hashtags</span>
          <CopyButton text={post.hashtags.map((h) => `#${h.replace(/^#/, '')}`).join(' ')} label="Copy Hashtags" />
        </div>
        <div className="flex flex-wrap gap-2">
          {post.hashtags.map((tag, i) => (
            <span key={i} className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-200">
              #{tag.replace(/^#/, '')}
            </span>
          ))}
        </div>
      </div>

      {/* Generate Creative Button */}
      <button
        onClick={onGenerateCreative}
        disabled={loadingCreative}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loadingCreative ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating {postType === 'Reel' ? 'Video Script' : 'Image Prompt'}...
          </>
        ) : (
          `Generate ${postType === 'Reel' ? '🎬 Video Script' : '🖼️ Image Prompt'} →`
        )}
      </button>
    </div>
  );
}
