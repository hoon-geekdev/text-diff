'use client';

import React from 'react';

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TextDiff Viewer",
    "alternateName": "실시간 텍스트 비교 도구",
    "description": "두 텍스트를 실시간으로 비교하고 변경점을 색상으로 하이라이팅해주는 무료 온라인 도구입니다. 글자/단어/줄 단위 비교, 다크모드, 20+ 파일 형식 지원.",
    "url": "https://hoon-geekdev.github.io/text-diff/",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Hoon Park",
      "url": "https://github.com/hoon-geekdev"
    },
    "publisher": {
      "@type": "Person",
      "name": "Hoon Park",
      "url": "https://github.com/hoon-geekdev"
    },
    "datePublished": "2025-01-06",
    "dateModified": "2025-01-06",
    "inLanguage": "ko-KR",
    "keywords": [
      "텍스트 비교",
      "diff",
      "문서 비교",
      "코드 비교",
      "실시간 비교",
      "텍스트 차이점",
      "온라인 도구",
      "무료"
    ],
    "featureList": [
      "실시간 텍스트 비교",
      "글자/단어/줄 단위 비교",
      "색상 하이라이팅",
      "다크 모드",
      "20+ 파일 형식 지원",
      "파일 업로드",
      "비교 통계",
      "반응형 디자인"
    ],
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0.0",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
} 