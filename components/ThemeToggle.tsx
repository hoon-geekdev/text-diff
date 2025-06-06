'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
    );
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
      default:
        return '💻';
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return '라이트 모드';
      case 'dark':
        return '다크 모드';
      case 'system':
      default:
        return '시스템 설정';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        relative flex items-center justify-center w-9 h-9 rounded-lg
        bg-gray-100 hover:bg-gray-200 
        dark:bg-gray-800 dark:hover:bg-gray-700
        transition-all duration-200 ease-in-out
        border border-gray-200 dark:border-gray-600
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
      "
      title={`현재: ${getLabel()} (클릭하여 변경)`}
      aria-label={`테마 변경. 현재: ${getLabel()}`}
    >
      <span className="text-lg transition-transform duration-200 hover:scale-110">
        {getIcon()}
      </span>
      
      {/* 상태 표시 점 */}
      <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-blue-500 opacity-75"></div>
    </button>
  );
} 