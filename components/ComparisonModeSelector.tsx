'use client';

import React from 'react';
import type { ComparisonMode } from '../types/diff';

interface ComparisonModeSelectorProps {
  currentMode: ComparisonMode;
  onModeChange: (mode: ComparisonMode) => void;
  className?: string;
}

const modes: { value: ComparisonMode; label: string; description: string }[] = [
  {
    value: 'character',
    label: '글자 단위',
    description: '글자별로 세밀하게 비교',
  },
  {
    value: 'word',
    label: '단어 단위',
    description: '단어별로 비교 (추천)',
  },
  {
    value: 'line',
    label: '줄 단위',
    description: '줄별로 비교',
  },
];

export default function ComparisonModeSelector({
  currentMode,
  onModeChange,
  className = '',
}: ComparisonModeSelectorProps) {
  return (
    <div className={`${className}`}>
      <div className="mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">비교 모드</h3>
      </div>

      <div className="flex flex-wrap gap-1">
        {modes.map((mode) => (
          <label
            key={mode.value}
            className={`
              flex items-center px-2 py-1 rounded border cursor-pointer transition-all duration-200 text-xs font-medium
              ${
                currentMode === mode.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
              }
            `}
          >
            <input
              type="radio"
              name="comparisonMode"
              value={mode.value}
              checked={currentMode === mode.value}
              onChange={() => onModeChange(mode.value)}
              className="sr-only"
            />
            <span>
              {mode.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
} 