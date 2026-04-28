'use client';

import { useState } from 'react';
import type { FormInputs, TargetAudience, ContentGoal, Platform, PostType } from '@/types';

interface Props {
  onSubmit: (inputs: FormInputs) => void;
  loading: boolean;
}

const GOALS: ContentGoal[] = ['Education', 'Engagement', 'Lead Nurturing'];

export default function InputForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<FormInputs>({
    targetAudience: 'Working Adults',
    contentGoals: ['Education'],
    platform: 'Facebook',
    insuranceTopic: '',
    postType: 'Static Post',
  });

  function toggleGoal(goal: ContentGoal) {
    setForm((prev) => ({
      ...prev,
      contentGoals: prev.contentGoals.includes(goal)
        ? prev.contentGoals.filter((g) => g !== goal)
        : [...prev.contentGoals, goal],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.insuranceTopic.trim()) return;
    if (form.contentGoals.length === 0) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Target Audience */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Target Audience
          </label>
          <select
            value={form.targetAudience}
            onChange={(e) => setForm({ ...form, targetAudience: e.target.value as TargetAudience })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Young Parents</option>
            <option>Working Adults</option>
            <option>Both</option>
          </select>
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Platform
          </label>
          <select
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value as Platform })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Facebook</option>
            <option>Instagram</option>
            <option>TikTok</option>
            <option>LinkedIn</option>
          </select>
        </div>
      </div>

      {/* Content Goals */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Content Goals <span className="text-gray-400 font-normal">(select one or more)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {GOALS.map((goal) => {
            const active = form.contentGoals.includes(goal);
            return (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                  ${active
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
              >
                {goal}
              </button>
            );
          })}
        </div>
      </div>

      {/* Insurance Topic */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Insurance Topic
        </label>
        <input
          type="text"
          value={form.insuranceTopic}
          onChange={(e) => setForm({ ...form, insuranceTopic: e.target.value })}
          placeholder="e.g. Medical Card, Life Insurance, Critical Illness"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Post Type Toggle */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Post Type</label>
        <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
          {(['Static Post', 'Reel'] as PostType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setForm({ ...form, postType: type })}
              className={`px-5 py-2.5 text-sm font-medium transition-all
                ${form.postType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              {type === 'Static Post' ? '🖼️ Static Post' : '🎬 Reel'}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !form.insuranceTopic.trim() || form.contentGoals.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating Calendar...
          </>
        ) : (
          'Generate 7-Day Content Calendar →'
        )}
      </button>
    </form>
  );
}
