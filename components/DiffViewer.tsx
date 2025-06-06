'use client';

import React from 'react';
import type { DiffResult } from '../types/diff';
import type { ComparisonMode } from '../types/diff';
import ComparisonModeSelector from './ComparisonModeSelector';

interface DiffViewerProps {
  diffs: DiffResult[];
  title: string;
  className?: string;
  comparisonMode: ComparisonMode;
  onModeChange: (mode: ComparisonMode) => void;
}

export default function DiffViewer({ diffs, title, className = '', comparisonMode, onModeChange }: DiffViewerProps) {
  if (!diffs.length) {
    return (
      <div className={`min-h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400 ${className}`}>
        <div className="text-center">
          <p className="text-lg mb-2">{title}</p>
          <p className="text-sm">텍스트를 입력하면 비교 결과가 여기에 표시됩니다</p>
        </div>
      </div>
    );
  }

  const renderDiffSegment = (diff: DiffResult, index: number) => {
    const { operation, text } = diff;
    
    // 줄바꿈과 공백 문자를 올바르게 처리
    const preservedText = text;

    switch (operation) {
      case 'insert':
        return (
          <span
            key={index}
            className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 transition-colors duration-200 hover:bg-green-200 dark:hover:bg-green-900/50"
            style={{ wordBreak: 'break-word' }}
            aria-label="추가된 텍스트"
            title="추가된 텍스트"
          >
            {preservedText}
          </span>
        );
      
      case 'delete':
        return (
          <span
            key={index}
            className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 line-through transition-colors duration-200 hover:bg-red-200 dark:hover:bg-red-900/50"
            style={{ wordBreak: 'break-word' }}
            aria-label="삭제된 텍스트"
            title="삭제된 텍스트"
          >
            {preservedText}
          </span>
        );
      
      case 'equal':
      default:
        return (
          <span
            key={index}
            className="text-gray-700 dark:text-gray-300"
            style={{ wordBreak: 'break-word' }}
          >
            {preservedText}
          </span>
        );
    }
  };

  return (
    <div className={`${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
        <div className="flex-shrink-0">
          <ComparisonModeSelector
            currentMode={comparisonMode}
            onModeChange={onModeChange}
            className="text-xs"
          />
        </div>
      </div>
      <div 
        className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 min-h-[300px] whitespace-pre-wrap font-mono text-sm leading-relaxed"
        style={{ 
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          tabSize: 4 
        }}
        role="textbox"
        aria-readonly="true"
        aria-label={`${title} 비교 결과`}
      >
        {diffs.map(renderDiffSegment)}
      </div>
      
      {/* 범례 */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded"></span>
          <span>추가</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded"></span>
          <span>삭제</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"></span>
          <span>변경 없음</span>
        </div>
      </div>
    </div>
  );
} 