import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '../components/Header';
import { DiffProvider } from '../context/DiffContext';
import { ThemeProvider } from '../components/ThemeProvider';
import StructuredData from '../components/StructuredData';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TextDiff Viewer - 실시간 텍스트 비교 도구',
  description:
    '두 텍스트를 실시간으로 비교하고 변경점을 색상으로 하이라이팅해주는 무료 온라인 도구입니다. 글자/단어/줄 단위 비교, 다크모드, 20+ 파일 형식 지원.',
  keywords:
    '텍스트 비교, diff, 문서 비교, 코드 비교, 실시간 비교, 텍스트 차이점, 온라인 도구, 무료',
  authors: [{ name: 'Hoon Park', url: 'https://github.com/hoon-geekdev' }],
  creator: 'Hoon Park',
  publisher: 'Hoon Park',
  robots: 'index, follow',
  verification: {
    google: 'P5oYKVsFYJYZ8e0ojtCHRLuWf7JrIEn0HICP8RI27eU',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://hoon-geekdev.github.io/text-diff/',
    siteName: 'TextDiff Viewer',
    title: 'TextDiff Viewer - 실시간 텍스트 비교 도구',
    description:
      '두 텍스트를 실시간으로 비교하고 변경점을 색상으로 하이라이팅해주는 무료 온라인 도구입니다.',
    images: [
      {
        url: 'https://hoon-geekdev.github.io/text-diff/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TextDiff Viewer - 실시간 텍스트 비교 도구',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@hoongeekdev',
    creator: '@hoongeekdev',
    title: 'TextDiff Viewer - 실시간 텍스트 비교 도구',
    description:
      '두 텍스트를 실시간으로 비교하고 변경점을 색상으로 하이라이팅해주는 무료 온라인 도구입니다.',
    images: ['https://hoon-geekdev.github.io/text-diff/og-image.png'],
  },
  alternates: {
    canonical: 'https://hoon-geekdev.github.io/text-diff/',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-44DKQFVVSD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-44DKQFVVSD');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors`}
      >
        <ThemeProvider>
          <DiffProvider>
            <StructuredData />
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </DiffProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
