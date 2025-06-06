import { useMemo } from 'react';
import { calculateDiff, getDiffStatistics, handleEmptyTexts, isTextTooLarge } from '../lib/textDiff';
import type { DiffResult, DiffStatistics, ComparisonMode } from '../types/diff';

interface UseDiffResult {
  diffs: DiffResult[];
  statistics: DiffStatistics;
  isLoading: boolean;
  error: string | null;
}

export default function useDiff(
  text1: string,
  text2: string,
  mode: ComparisonMode = 'character'
): UseDiffResult {
  const result = useMemo(() => {
    try {
      // 텍스트가 너무 큰 경우 처리
      if (isTextTooLarge(text1, text2)) {
        return {
          diffs: [],
          statistics: {
            totalCharacters: 0,
            addedCharacters: 0,
            deletedCharacters: 0,
            unchangedCharacters: 0,
            addedWords: 0,
            deletedWords: 0,
            addedLines: 0,
            deletedLines: 0,
          },
          isLoading: false,
          error: '텍스트가 너무 큽니다. 50,000자 이하로 줄여주세요.',
        };
      }

      // 빈 텍스트 처리
      const emptyResult = handleEmptyTexts(text1, text2);
      if (emptyResult !== null) {
        const statistics = getDiffStatistics(emptyResult);
        return {
          diffs: emptyResult,
          statistics,
          isLoading: false,
          error: null,
        };
      }

      // 실제 diff 계산
      const diffs = calculateDiff(text1, text2, mode);
      const statistics = getDiffStatistics(diffs);

      return {
        diffs,
        statistics,
        isLoading: false,
        error: null,
      };
    } catch (error) {
      console.error('Diff calculation error:', error);
      return {
        diffs: [],
        statistics: {
          totalCharacters: 0,
          addedCharacters: 0,
          deletedCharacters: 0,
          unchangedCharacters: 0,
          addedWords: 0,
          deletedWords: 0,
          addedLines: 0,
          deletedLines: 0,
        },
        isLoading: false,
        error: '텍스트 비교 중 오류가 발생했습니다.',
      };
    }
  }, [text1, text2, mode]);

  return result;
} 