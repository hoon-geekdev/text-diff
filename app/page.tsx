'use client';

import Container from '../components/ui/Container';
import TextInputArea from '../components/TextInputArea';
import DiffViewer from '../components/DiffViewer';
import ComparisonModeSelector from '../components/ComparisonModeSelector';
import { useDiffContext } from '../context/DiffContext';

export default function Home() {
  const {
    originalText,
    modifiedText,
    setOriginalText,
    setModifiedText,
    isCalculating,
    error,
    statistics,
    diffs,
    comparisonMode,
    setComparisonMode,
  } = useDiffContext();

  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            텍스트 비교하기
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            두 텍스트를 입력하여 차이점을 실시간으로 확인하세요
          </p>
        </div>

        {/* Text Input Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <TextInputArea
              label="원본 텍스트"
              value={originalText}
              onChange={setOriginalText}
              placeholder="원본 텍스트를 입력하세요..."
            />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <TextInputArea
              label="수정된 텍스트"
              value={modifiedText}
              onChange={setModifiedText}
              placeholder="수정된 텍스트를 입력하세요..."
            />
          </div>
        </div>

        {/* Diff Results */}
        {(originalText || modifiedText) && !error && (
          <div className="space-y-4">
            {/* Comparison Mode Selector Above Results */}
            <div className="flex justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                <ComparisonModeSelector
                  currentMode={comparisonMode}
                  onModeChange={setComparisonMode}
                />
              </div>
            </div>
            
            {/* Diff Viewer */}
            <div className="max-w-6xl mx-auto">
              <DiffViewer 
                diffs={diffs} 
                title="비교 결과" 
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6"
              />
            </div>
          </div>
        )}

        {/* Status Information */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          {error ? (
            <p className="text-red-600 dark:text-red-400">{error}</p>
          ) : (originalText || modifiedText) ? (
            <div className="space-y-1">
              <p>
                원본: {originalText.length}글자 | 수정본: {modifiedText.length}글자
                {isCalculating && <span className="ml-2 text-blue-600 dark:text-blue-400">계산 중...</span>}
              </p>
              {!isCalculating && statistics && (
                <p>
                  추가: {statistics.addedCharacters}글자 | 
                  삭제: {statistics.deletedCharacters}글자 | 
                  변경 없음: {statistics.unchangedCharacters}글자
                </p>
              )}
            </div>
          ) : (
            <p>텍스트를 입력하면 실시간으로 비교 결과를 확인할 수 있습니다</p>
          )}
        </div>
      </div>
    </Container>
  );
}
