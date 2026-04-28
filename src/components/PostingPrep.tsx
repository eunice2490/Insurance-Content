'use client';

import { useState } from 'react';
import type { FormInputs, PostResult, CreativeAsset } from '@/types';

interface Props {
  inputs: FormInputs;
  post: PostResult;
  creative: CreativeAsset;
  onExport: (format: 'txt' | 'doc') => void;
  onStartOver: () => void;
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
      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:border-blue-400 hover:text-blue-600 transition-colors bg-white"
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

const PLATFORM_TIPS: Record<string, string[]> = {
  Facebook: [
    'Best posting times: Tue–Thu, 9 am–1 pm',
    'Tag relevant people or pages to boost reach',
    'Post to your Story within 24 h for extra visibility',
    'Use Facebook Scheduler to queue posts in advance',
  ],
  Instagram: [
    'Best posting times: Mon–Fri, 9 am–11 am',
    'Add location tag to increase local discovery',
    'Use all 5 carousel slides if posting a carousel',
    'Reply to comments within the first hour to boost algorithm',
  ],
  TikTok: [
    'Best posting times: Tue, Thu, Fri, 6 pm–10 pm',
    'Add on-screen text captions for silent viewers',
    'Use trending audio to maximise For You page reach',
    'Keep video duration between 15–30 s for best performance',
  ],
  LinkedIn: [
    'Best posting times: Tue–Thu, 8 am–10 am',
    'Start with a bold first line — LinkedIn truncates after 2 lines',
    'Tag connections mentioned in your post',
    'Avoid external links in the post body — add in comments',
  ],
};

const PLATFORM_ICON: Record<string, React.ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
};

const PLATFORM_COLOR: Record<string, string> = {
  Instagram: 'text-pink-500',
  Facebook: 'text-blue-600',
  LinkedIn: 'text-blue-700',
  TikTok: 'text-gray-900',
};

export default function PostingPrep({ inputs, post, creative, onExport, onStartOver }: Props) {
  const tips = PLATFORM_TIPS[inputs.platform] ?? [];
  const hashtagsText = post.hashtags.map((h) => `#${h.replace(/^#/, '')}`).join(' ');
  const isReel = creative.type === 'video';

  return (
    <div className="space-y-5">
      {/* Success banner */}
      <div className="rounded-xl bg-green-50 border border-green-200 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-green-800 text-sm">Your content is ready to post!</p>
          <p className="text-xs text-green-600">Follow the checklist below to publish on {inputs.platform}.</p>
        </div>
      </div>

      {/* Checklist */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
            {isReel ? '🎬 Reel Publishing Checklist' : '🖼️ Static Post Publishing Checklist'}
          </p>
        </div>

        {isReel ? (
          <ReeIChecklist creative={creative as import('@/types').VideoCreative} platform={inputs.platform} />
        ) : (
          <ImageChecklist creative={creative as import('@/types').ImageCreative} platform={inputs.platform} />
        )}
      </div>

      {/* Ready-to-copy panel */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Ready-to-Post Content</p>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Caption</span>
            <CopyButton text={post.full_caption} label="Copy Caption" />
          </div>
          <p className="text-xs text-gray-700 bg-white rounded-lg p-3 border border-blue-200 line-clamp-3 leading-relaxed">
            {post.full_caption}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Hashtags</span>
            <CopyButton text={hashtagsText} label="Copy Hashtags" />
          </div>
          <p className="text-xs text-blue-700 bg-white rounded-lg p-2 border border-blue-200">
            {hashtagsText}
          </p>
        </div>
      </div>

      {/* Platform posting tips */}
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className={`${PLATFORM_COLOR[inputs.platform]}`}>
            {PLATFORM_ICON[inputs.platform]}
          </span>
          <span className="text-sm font-semibold text-gray-800">{inputs.platform} Posting Tips</span>
        </div>
        <ul className="space-y-2">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <svg className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
              </svg>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Export */}
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

      <button
        onClick={onStartOver}
        className="w-full text-center text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors py-2"
      >
        Generate content for another topic →
      </button>
    </div>
  );
}

function ChecklistItem({ done, children }: { done?: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0 px-4">
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${done ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
        {done && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div className="text-sm text-gray-700 leading-snug">{children}</div>
    </li>
  );
}

function ImageChecklist({ creative, platform }: { creative: import('@/types').ImageCreative; platform: string }) {
  return (
    <ul className="divide-y divide-gray-100">
      <ChecklistItem done>
        Caption & hashtags generated <span className="text-green-600 font-medium">(Step 2 ✓)</span>
      </ChecklistItem>
      <ChecklistItem done>
        Image prompt generated <span className="text-green-600 font-medium">(Step 3 ✓)</span>
      </ChecklistItem>
      <ChecklistItem>
        <span>
          Create image using the prompt —{' '}
          <strong>Gemini</strong>{' '}
          <span className="text-gray-500 text-xs">(activate banana button)</span>
          {' '}or{' '}
          <strong>Dreamina</strong>{' '}
          <span className="text-gray-500 text-xs">(choose model 4.1)</span>
        </span>
      </ChecklistItem>
      <ChecklistItem>
        Download generated image to your device
      </ChecklistItem>
      <ChecklistItem>
        Open <strong>{platform}</strong> → Create post → Upload image
      </ChecklistItem>
      <ChecklistItem>
        Paste caption and hashtags
      </ChecklistItem>
      <ChecklistItem>
        Schedule or publish your post
      </ChecklistItem>
    </ul>
  );
}

function ReeIChecklist({ creative, platform }: { creative: import('@/types').VideoCreative; platform: string }) {
  return (
    <ul className="divide-y divide-gray-100">
      <ChecklistItem done>
        Caption & hashtags generated <span className="text-green-600 font-medium">(Step 2 ✓)</span>
      </ChecklistItem>
      <ChecklistItem done>
        Video script generated <span className="text-green-600 font-medium">(Step 3 ✓)</span>
      </ChecklistItem>
      <ChecklistItem>
        <span>
          Record video using the script <strong>OR</strong> generate an AI video using{' '}
          <strong>HeyGen</strong>{' '}
          <span className="text-gray-500 text-xs">(paste the script into HeyGen&apos;s video creator)</span>
        </span>
      </ChecklistItem>
      <ChecklistItem>
        Add captions, music, and transitions in your editing app
      </ChecklistItem>
      <ChecklistItem>
        Open <strong>{platform}</strong> → Create Reel → Upload video
      </ChecklistItem>
      <ChecklistItem>
        Paste caption and hashtags
      </ChecklistItem>
      <ChecklistItem>
        Schedule or publish your Reel
      </ChecklistItem>
    </ul>
  );
}
