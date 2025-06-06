'use client';

import React from 'react';
import type { DiffResult } from '../types/diff';

interface DiffViewerProps {
  diffs: DiffResult[];
  title: string;
  className?: string;
}

export default function DiffViewer({ diffs, title, className = '' }: DiffViewerProps) {
  if (!diffs.length) {
    return (
      <div className={`min-h-[300px] flex items-center justify-center text-gray-500 ${className}`}>
        <div className="text-center">
          <p className="text-lg mb-2">{title}</p>
          <p className="text-sm">텍스트를 입력하면 비교 결과가 여기에 표시됩니다</p>
        </div>
      </div>
    );
  }

  const renderDiffSegment = (diff: DiffResult, index: number) => {
    const { operation, text } = diff;
    
    // 공백 문자 처리 (탭, 줄바꿈 등)
    const preservedText = text.replace(/\n/g, '\n').replace(/\t/g, '\t');

    switch (operation) {
      case 'insert':
        return (
          <span
            key={index}
            className="bg-green-100 text-green-800 transition-colors duration-200 hover:bg-green-200"
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
            className="bg-red-100 text-red-800 line-through transition-colors duration-200 hover:bg-red-200"
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
            className="text-gray-700"
            style={{ wordBreak: 'break-word' }}
          >
            {preservedText}
          </span>
        );
    }
  };

  return (
    <div className={`${className}`}>
      <div className="mb-3">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      </div>
      <div 
        className="p-4 border rounded-lg bg-white min-h-[300px] whitespace-pre-wrap font-mono text-sm leading-relaxed"
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
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-green-100 border border-green-200 rounded"></span>
          <span>추가</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-red-100 border border-red-200 rounded"></span>
          <span>삭제</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-gray-100 border border-gray-200 rounded"></span>
          <span>변경 없음</span>
        </div>
      </div>
    </div>
  );
} 