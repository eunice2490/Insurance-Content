'use client';

import type { CalendarDay } from '@/types';

interface Props {
  calendar: CalendarDay[];
  selectedDay: number | null;
  loadingDay: number | null;
  onSelectDay: (day: CalendarDay) => void;
}

const FORMAT_ICON: Record<string, string> = {
  'Static Post': '🖼️',
  Reel: '🎬',
  Carousel: '📑',
  Story: '⭕',
};

export default function ContentCalendar({ calendar, selectedDay, loadingDay, onSelectDay }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 mb-4">
        Select a day to generate its full post and creative assets.
      </p>
      {calendar.map((entry) => {
        const isSelected = selectedDay === entry.day;
        const isLoading = loadingDay === entry.day;

        return (
          <button
            key={entry.day}
            onClick={() => onSelectDay(entry)}
            disabled={isLoading}
            className={`w-full text-left rounded-xl border p-4 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400
              ${isSelected
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
          >
            <div className="flex items-start gap-4">
              {/* Day badge */}
              <div
                className={`shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold
                  ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <span className="text-lg leading-none">{entry.day}</span>
                <span className="uppercase tracking-wide">Day</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 text-sm">{entry.theme}</span>
                  <span className="text-xs text-gray-400">
                    {FORMAT_ICON[entry.format] ?? '📄'} {entry.format}
                  </span>
                  {isLoading && (
                    <span className="text-xs text-blue-500 flex items-center gap-1">
                      <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Generating...
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  <span className="font-medium text-gray-700">Hook:</span> {entry.hook}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{entry.cta}</p>
              </div>

              <svg
                className={`shrink-0 w-4 h-4 transition-transform ${isSelected ? 'text-blue-500 rotate-90' : 'text-gray-300'}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        );
      })}
    </div>
  );
}
