import DiffMatchPatch from 'diff-match-patch';
import type { DiffResult, DiffStatistics, ComparisonMode } from '../types/diff';

// DiffMatchPatch 인스턴스 생성 및 설정
const dmp = new DiffMatchPatch();
dmp.Diff_Timeout = 1.0; // 1초 타임아웃
dmp.Diff_EditCost = 4; // 편집 비용

// 타입들을 다시 export (편의를 위해)
export type { DiffResult, DiffStatistics, ComparisonMode };





/**
 * 두 텍스트를 비교하여 차이점을 계산합니다
 */
export function calculateDiff(text1: string, text2: string, mode: ComparisonMode = 'character'): DiffResult[] {
  try {
    let diffs: [number, string][];

    switch (mode) {
      case 'word':
        // 단어 레벨 비교 - 간단한 토큰 기반 접근
        const words1 = text1.split(/(\s+)/);
        const words2 = text2.split(/(\s+)/);
        const wordText1 = words1.join('\n');
        const wordText2 = words2.join('\n');
        const wordLineArray = dmp.diff_linesToChars_(wordText1, wordText2);
        diffs = dmp.diff_main(wordLineArray.chars1, wordLineArray.chars2, false);
        dmp.diff_charsToLines_(diffs, wordLineArray.lineArray);
        dmp.diff_cleanupSemantic(diffs);
        // 줄바꿈을 다시 공백으로 변환
        diffs = diffs.map(([op, text]) => [op, text.replace(/\n/g, '')]);
        break;
      case 'line':
        // 줄 레벨 비교 - 개선된 버전
        const lines1 = text1.split('\n');
        const lines2 = text2.split('\n');
        
        // 각 줄에 줄바꿈 문자를 추가하여 원본 형태 유지
        const linesWithNewlines1 = lines1.map((line, index) => 
          index === lines1.length - 1 ? line : line + '\n'
        );
        const linesWithNewlines2 = lines2.map((line, index) => 
          index === lines2.length - 1 ? line : line + '\n'
        );
        
        const lineText1 = linesWithNewlines1.join('\u0001'); // 특수 구분자 사용
        const lineText2 = linesWithNewlines2.join('\u0001');
        
        const lineArray = dmp.diff_linesToChars_(lineText1, lineText2);
        diffs = dmp.diff_main(lineArray.chars1, lineArray.chars2, false);
        dmp.diff_charsToLines_(diffs, lineArray.lineArray);
        dmp.diff_cleanupSemantic(diffs);
        
        // 구분자를 다시 제거
        diffs = diffs.map(([op, text]) => [op, text.replace(/\u0001/g, '')]);
        break;
      case 'character':
      default:
        // 문자 레벨 비교 (기본)
        diffs = dmp.diff_main(text1, text2);
        dmp.diff_cleanupSemantic(diffs);
        break;
    }

    // 결과를 더 사용하기 쉬운 형태로 변환
    return formatDiffResults(diffs);
  } catch (error) {
    console.error('Diff calculation error:', error);
    return [
      { operation: 'equal', text: text1 || text2 }
    ];
  }
}

/**
 * DiffMatchPatch 결과를 포맷팅합니다
 */
export function formatDiffResults(diffs: [number, string][]): DiffResult[] {
  return diffs.map(([operation, text]) => {
    let op: 'equal' | 'insert' | 'delete';
    
    switch (operation) {
      case DiffMatchPatch.DIFF_INSERT:
        op = 'insert';
        break;
      case DiffMatchPatch.DIFF_DELETE:
        op = 'delete';
        break;
      case DiffMatchPatch.DIFF_EQUAL:
      default:
        op = 'equal';
        break;
    }

    return { operation: op, text };
  });
}

/**
 * Diff 결과의 통계를 계산합니다
 */
export function getDiffStatistics(diffs: DiffResult[]): DiffStatistics {
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
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lineCount = text.split('\n').length - 1;

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

  return {
    totalCharacters,
    addedCharacters,
    deletedCharacters,
    unchangedCharacters,
    addedWords,
    deletedWords,
    addedLines,
    deletedLines,
  };
}

/**
 * 텍스트가 너무 큰지 확인합니다 (메모리 최적화)
 */
export function isTextTooLarge(text1: string, text2: string, maxLength: number = 50000): boolean {
  return text1.length > maxLength || text2.length > maxLength;
}

/**
 * 빈 텍스트에 대한 특별한 처리
 */
export function handleEmptyTexts(text1: string, text2: string): DiffResult[] | null {
  if (!text1 && !text2) {
    return [];
  }
  if (!text1) {
    return [{ operation: 'insert', text: text2 }];
  }
  if (!text2) {
    return [{ operation: 'delete', text: text1 }];
  }
  return null; // 둘 다 비어있지 않음
}

 