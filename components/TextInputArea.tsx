'use client';

import { useEffect, useRef, TextareaHTMLAttributes, useState } from 'react';
import FileUpload from './FileUpload';

interface TextInputAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TextInputArea({
  label,
  value,
  onChange,
  placeholder = '텍스트를 입력하세요...',
  className = '',
  ...props
}: TextInputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);

  // Auto-resize functionality
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set height to scrollHeight to fit content
      textarea.style.height = `${Math.max(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleFileUpload = (text: string) => {
    onChange(text);
    setShowFileUpload(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <button
          onClick={() => setShowFileUpload(!showFileUpload)}
          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded transition-colors"
          type="button"
        >
          {showFileUpload ? '텍스트 입력' : '파일 업로드'}
        </button>
      </div>

      {showFileUpload ? (
        <div className="flex-1">
          <FileUpload 
            onTextExtracted={handleFileUpload}
            label=""
          />
        </div>
      ) : (
        <>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`
              flex-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              dark:focus:ring-blue-400 dark:focus:border-blue-400
              resize-none overflow-y-auto
              transition-colors duration-200
              min-h-[300px] max-h-[400px]
              ${className}
            `}
            {...props}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {value.length} 글자
          </div>
        </>
      )}
    </div>
  );
} 