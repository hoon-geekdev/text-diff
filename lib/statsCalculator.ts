import type { DiffResult, DiffStatistics } from '../types/diff';

/**
 * 확장된 통계 정보 타입
 */
export interface ExtendedStatistics extends DiffStatistics {
  similarityPercentage: number;
  totalChanges: number;
  changeRatio: number;
}

/**
 * Diff 결과로부터 확장된 통계를 계산합니다
 */
export function calculateExtendedStatistics(
  diffs: DiffResult[],
  originalText: string,
  modifiedText: string
): ExtendedStatistics {
  // 기본 통계 계산
  let totalCharacters = 0;
  let addedCharacters = 0;
  let deletedCharacters = 0;
  let unchangedCharacters = 0;
  let addedWords = 0;
  let deletedWords = 0;
  let addedLines = 0;
  let deletedLines = 0;

  diffs.forEach(diff => {
    const { operation, text } = diff;
    const charCount = text.length;
    const wordCount = countWords(text);
    const lineCount = countLines(text);

    totalCharacters += charCount;

    switch (operation) {
      case 'insert':
        addedCharacters += charCount;
        addedWords += wordCount;
        addedLines += lineCount;
        break;
      case 'delete':
        deletedCharacters += charCount;
        deletedWords += wordCount;
        deletedLines += lineCount;
        break;
      case 'equal':
        unchangedCharacters += charCount;
        break;
    }
  });

  // 확장 통계 계산
  const totalChanges = addedCharacters + deletedCharacters;
  const totalOriginalLength = Math.max(originalText.length, 1); // 0으로 나누기 방지
  const totalModifiedLength = Math.max(modifiedText.length, 1);
  const changeRatio = totalChanges / Math.max(totalOriginalLength, totalModifiedLength);
  const similarityPercentage = Math.max(0, Math.min(100, 
    ((unchangedCharacters / Math.max(totalCharacters, 1)) * 100)
  ));

  return {
    totalCharacters,
    addedCharacters,
    deletedCharacters,
    unchangedCharacters,
    addedWords,
    deletedWords,
    addedLines,
    deletedLines,
    similarityPercentage: Math.round(similarityPercentage * 100) / 100,
    totalChanges,
    changeRatio,
  };
}

/**
 * 텍스트의 단어 수를 정확히 계산합니다
 */
function countWords(text: string): number {
  if (!text.trim()) return 0;
  
  // 한국어, 영어, 숫자를 포함한 단어 매칭
  const words = text.match(/[\p{L}\p{N}]+/gu);
  return words ? words.length : 0;
}

/**
 * 텍스트의 줄 수를 계산합니다
 */
function countLines(text: string): number {
  if (!text) return 0;
  
  // 줄바꿈 문자 수 + 1 (마지막 줄 포함)
  // 단, 텍스트가 줄바꿈으로 끝나는 경우는 제외
  const lineBreaks = (text.match(/\n/g) || []).length;
  return lineBreaks + (text.length > 0 && !text.endsWith('\n') ? 1 : 0);
}

/**
 * 숫자를 로케일에 맞게 포맷팅합니다 (천 단위 구분자 추가)
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}

/**
 * 백분율을 포맷팅합니다
 */
export function formatPercentage(percentage: number, decimals: number = 1): string {
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * 변경 크기에 따른 변화 레벨을 반환합니다
 */
export function getChangeLevel(changeRatio: number): 'minimal' | 'moderate' | 'significant' | 'major' {
  if (changeRatio < 0.1) return 'minimal';
  if (changeRatio < 0.3) return 'moderate';
  if (changeRatio < 0.6) return 'significant';
  return 'major';
}

/**
 * 변경 레벨에 따른 색상 클래스를 반환합니다 (다크 모드 지원)
 */
export function getChangeLevelColor(level: ReturnType<typeof getChangeLevel>): string {
  switch (level) {
    case 'minimal': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
    case 'moderate': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
    case 'significant': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700';
    case 'major': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
  }
}

/**
 * 변경 레벨에 따른 설명을 반환합니다
 */
export function getChangeLevelDescription(level: ReturnType<typeof getChangeLevel>): string {
  switch (level) {
    case 'minimal': return '미미한 변경';
    case 'moderate': return '보통 변경';
    case 'significant': return '상당한 변경';
    case 'major': return '대규모 변경';
  }
} 