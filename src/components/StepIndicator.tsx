'use client';

import type { AppStep } from '@/types';

const STEPS = [
  { number: 1, label: 'Calendar', icon: '📅' },
  { number: 2, label: 'Draft Post', icon: '✍️' },
  { number: 3, label: 'Creative', icon: '🎨' },
  { number: 4, label: 'Post', icon: '🚀' },
];

interface Props {
  currentStep: AppStep;
}

export default function StepIndicator({ currentStep }: Props) {
  // Map the 5 internal app steps onto the 4 diagram steps
  // App step 1 = pre-step (form, not shown in indicator)
  // App step 2 = diagram step 1
  // App step 3 = diagram step 2
  // App step 4 = diagram step 3
  // App step 5 = diagram step 4
  const diagramStep = currentStep <= 1 ? 0 : currentStep - 1;

  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, i) => {
        const isDone = step.number < diagramStep;
        const isActive = step.number === diagramStep;
        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-11 h-11 rounded-full flex flex-col items-center justify-center text-xs font-bold transition-all
                  ${isDone
                    ? 'bg-green-500 text-white shadow-md'
                    : isActive
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200 shadow-lg'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
              >
                {isDone ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-base leading-none">{step.icon}</span>
                )}
              </div>
              <span
                className={`mt-1.5 text-[11px] font-semibold whitespace-nowrap
                  ${isActive ? 'text-blue-600' : isDone ? 'text-green-600' : 'text-gray-400'}`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex flex-col items-center mb-5 mx-1">
                <div
                  className={`h-0.5 w-12 sm:w-16 transition-all ${isDone ? 'bg-green-400' : 'bg-gray-200'}`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
