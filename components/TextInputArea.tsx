'use client';

import { useEffect, useRef, TextareaHTMLAttributes } from 'react';

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

  return (
    <div className="flex flex-col h-full">
      <label className="text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`
          flex-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          resize-none overflow-y-auto
          transition-colors duration-200
          min-h-[200px]
          ${className}
        `}
        {...props}
      />
      <div className="text-xs text-gray-500 mt-1">
        {value.length} 글자
      </div>
    </div>
  );
} 