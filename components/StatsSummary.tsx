'use client';

import React, { useState, useEffect } from 'react';
import type { DiffResult } from '../types/diff';
import {
  calculateExtendedStatistics,
  formatNumber,
  formatPercentage,
  getChangeLevel,
  getChangeLevelColor,
  getChangeLevelDescription,
  type ExtendedStatistics,
} from '../lib/statsCalculator';

interface StatsSummaryProps {
  diffs: DiffResult[];
  originalText: string;
  modifiedText: string;
  className?: string;
}

interface StatItemProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  animated?: boolean;
}

function StatItem({ label, value, icon, color, animated = false }: StatItemProps) {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);

  useEffect(() => {
    if (animated && typeof value === 'number') {
      const duration = 1000; // 1초
      const steps = 50;
      const stepValue = value / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        setDisplayValue(Math.round(stepValue * currentStep));
        
        if (currentStep >= steps) {
          setDisplayValue(value);
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  return (
    <div className={`p-4 rounded-lg border ${color} transition-all duration-200 hover:shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="text-2xl font-bold">
            {typeof displayValue === 'number' ? formatNumber(displayValue) : displayValue}
          </p>
        </div>
        <div className="text-2xl opacity-60">{icon}</div>
      </div>
    </div>
  );
}

export default function StatsSummary({ 
  diffs, 
  originalText, 
  modifiedText, 
  className = '' 
}: StatsSummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [stats, setStats] = useState<ExtendedStatistics | null>(null);

  // 통계 계산
  useEffect(() => {
    if (diffs.length > 0) {
      const calculatedStats = calculateExtendedStatistics(diffs, originalText, modifiedText);
      setStats(calculatedStats);
    } else {
      setStats(null);
    }
  }, [diffs, originalText, modifiedText]);

  if (!stats) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-sm">텍스트를 입력하면 변경 통계가 표시됩니다</p>
        </div>
      </div>
    );
  }

  const changeLevel = getChangeLevel(stats.changeRatio);
  const levelColor = getChangeLevelColor(changeLevel);
  const levelDescription = getChangeLevelDescription(changeLevel);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">변경 통계</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">텍스트 비교 결과 요약</p>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="md:hidden p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={isCollapsed ? '통계 펼치기' : '통계 접기'}
          >
            <span className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
        </div>

        {/* 전체 유사도 */}
        <div className={`mt-4 p-3 rounded-lg ${levelColor}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">유사도</span>
            <span className="text-lg font-bold">
              {formatPercentage(stats.similarityPercentage)}
            </span>
          </div>
          <p className="text-xs mt-1 opacity-75">{levelDescription}</p>
        </div>
      </div>

      {/* 상세 통계 */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'hidden md:block' : ''}`}>
        <div className="p-6">
          {/* 문자 통계 */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <span className="mr-2">🔤</span>
              문자 변경
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatItem
                label="추가됨"
                value={stats.addedCharacters}
                icon="+"
                color="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                animated={true}
              />
              <StatItem
                label="삭제됨"
                value={stats.deletedCharacters}
                icon="−"
                color="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                animated={true}
              />
              <StatItem
                label="변경 없음"
                value={stats.unchangedCharacters}
                icon="="
                color="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                animated={true}
              />
            </div>
          </div>

          {/* 단어 통계 */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <span className="mr-2">📝</span>
              단어 변경
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <StatItem
                label="추가된 단어"
                value={stats.addedWords}
                icon="+"
                color="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                animated={true}
              />
              <StatItem
                label="삭제된 단어"
                value={stats.deletedWords}
                icon="−"
                color="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                animated={true}
              />
            </div>
          </div>

          {/* 줄 통계 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <span className="mr-2">📄</span>
              줄 변경
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <StatItem
                label="추가된 줄"
                value={stats.addedLines}
                icon="+"
                color="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                animated={true}
              />
              <StatItem
                label="삭제된 줄"
                value={stats.deletedLines}
                icon="−"
                color="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                animated={true}
              />
            </div>
          </div>
        </div>

        {/* 푸터 정보 */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 rounded-b-lg">
          <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
            총 {formatNumber(stats.totalChanges)}개 문자 변경 · 
            변경 비율 {formatPercentage(stats.changeRatio * 100)}
          </div>
        </div>
      </div>
    </div>
  );
} 