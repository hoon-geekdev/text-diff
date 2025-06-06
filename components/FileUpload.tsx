'use client';

import React, { useState, useRef, useCallback } from 'react';
import { extractTextFromFile, getFileIcon, type FileProcessingResult } from '../lib/fileProcessor';

interface FileUploadProps {
  onTextExtracted: (text: string, fileName?: string) => void;
  className?: string;
  label?: string;
}

export default function FileUpload({
  onTextExtracted,
  className = '',
  label = '파일 업로드',
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastProcessedFile, setLastProcessedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setLastProcessedFile(null);

    try {
      const result: FileProcessingResult = await extractTextFromFile(file);
      
      if (result.success) {
        onTextExtracted(result.text, result.fileName);
        setLastProcessedFile(result.fileName);
      } else {
        setError(result.error || '파일 처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '파일 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  }, [onTextExtracted]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileSelect(files[0]);
    }
    // 파일 입력 초기화 (같은 파일 재선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileSelect]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
        {label}
      </label>
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.docx,.json,.csv,.xml,.yaml,.yml,.js,.ts,.css,.html,.htm,.sql,.py,.php,.java,.cs,.cpp,.cc,.cxx,.c,.go,.rs"
          onChange={handleInputChange}
          className="sr-only"
          aria-label="파일 선택"
        />

        {isProcessing ? (
          <div className="space-y-3">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">파일을 처리하고 있습니다...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-3xl">📁</div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                파일을 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                텍스트, 코드, 문서 파일 지원 (최대 10MB)
              </p>
            </div>
          </div>
        )}

        {/* 드래그 오버레이 */}
        {isDragOver && (
          <div className="absolute inset-0 border-2 border-blue-400 bg-blue-50 dark:bg-blue-900/30 bg-opacity-90 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">⬇️</div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                파일을 여기에 놓으세요
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 성공 메시지 */}
      {lastProcessedFile && !error && (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <div className="flex items-center">
            <span className="text-lg mr-2">{getFileIcon(lastProcessedFile)}</span>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                파일이 성공적으로 로드되었습니다
              </p>
              <p className="text-xs text-green-600 dark:text-green-300">
                {lastProcessedFile}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
          <div className="flex items-center">
            <span className="text-lg mr-2">⚠️</span>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">오류</p>
              <p className="text-xs text-red-600 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 지원되는 파일 형식 안내 */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        <p className="font-medium">지원되는 파일 형식:</p>
        <div className="flex flex-wrap gap-1 mt-1">
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            📄 .txt
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            📝 .md
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            📘 .docx
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            🔧 .json
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            📊 .csv
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            🗂️ .xml
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            ⚙️ .yaml
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            📜 .js/.ts
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            🎨 .css
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            🌐 .html
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            🐍 .py
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            ☕ .java
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            ⚡ .cpp/.c
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            🐹 .go
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            🦀 .rs
          </span>
        </div>
      </div>
    </div>
  );
} 