'use client';

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import useDiff from '../hooks/useDiff';
import useDebounce from '../hooks/useDebounce';
import useLocalStorage from '../hooks/useLocalStorage';
import type { DiffResult, DiffStatistics, ComparisonMode } from '../types/diff';

interface DiffContextType {
  // 텍스트 상태
  originalText: string;
  modifiedText: string;
  setOriginalText: (text: string) => void;
  setModifiedText: (text: string) => void;
  
  // 비교 설정
  comparisonMode: ComparisonMode;
  setComparisonMode: (mode: ComparisonMode) => void;
  
  // Diff 결과
  diffs: DiffResult[];
  statistics: DiffStatistics;
  isCalculating: boolean;
  error: string | null;
  
  // 유틸리티 함수
  clearTexts: () => void;
  swapTexts: () => void;
}

const DiffContext = createContext<DiffContextType | undefined>(undefined);

interface DiffProviderProps {
  children: React.ReactNode;
}

export function DiffProvider({ children }: DiffProviderProps) {
  // 기본 상태
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [comparisonMode, setComparisonModeState] = useLocalStorage<ComparisonMode>('textdiff-comparison-mode', 'word');
  const [isCalculating, setIsCalculating] = useState(false);

  // 비교 모드 변경 함수 (localStorage에 자동 저장)
  const setComparisonMode = useCallback((mode: ComparisonMode) => {
    setComparisonModeState(mode);
  }, [setComparisonModeState]);

  // 디바운스된 텍스트 (성능 최적화)
  const debouncedOriginalText = useDebounce(originalText, 300);
  const debouncedModifiedText = useDebounce(modifiedText, 300);

  // Diff 계산
  const { diffs, statistics, error } = useDiff(
    debouncedOriginalText,
    debouncedModifiedText,
    comparisonMode
  );

  // 계산 상태 관리
  useEffect(() => {
    // 텍스트가 변경되면 계산 중 상태 설정
    if (originalText !== debouncedOriginalText || modifiedText !== debouncedModifiedText) {
      setIsCalculating(true);
    } else {
      setIsCalculating(false);
    }
  }, [originalText, modifiedText, debouncedOriginalText, debouncedModifiedText]);

  // 유틸리티 함수들
  const clearTexts = useCallback(() => {
    setOriginalText('');
    setModifiedText('');
  }, []);

  const swapTexts = useCallback(() => {
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
  }, [originalText, modifiedText]);

  const value: DiffContextType = {
    // 텍스트 상태
    originalText,
    modifiedText,
    setOriginalText,
    setModifiedText,
    
    // 비교 설정
    comparisonMode,
    setComparisonMode,
    
    // Diff 결과
    diffs,
    statistics,
    isCalculating,
    error,
    
    // 유틸리티 함수
    clearTexts,
    swapTexts,
  };

  return (
    <DiffContext.Provider value={value}>
      {children}
    </DiffContext.Provider>
  );
}

// Context 사용을 위한 커스텀 훅
export function useDiffContext() {
  const context = useContext(DiffContext);
  if (context === undefined) {
    throw new Error('useDiffContext must be used within a DiffProvider');
  }
  return context;
}

export default DiffContext; 