/* eslint-disable @typescript-eslint/no-explicit-any */
import mammoth from 'mammoth';

export interface FileProcessingResult {
  text: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  success: boolean;
  error?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 지원되는 파일 형식
 */
export const SUPPORTED_FILE_TYPES = {
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
} as const;

/**
 * 최대 파일 크기 (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * 파일 유효성 검사
 */
export function validateFile(file: File): FileValidationResult {
  // 파일 크기 확인
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `파일 크기가 너무 큽니다. 최대 ${formatFileSize(MAX_FILE_SIZE)}까지 업로드 가능합니다.`,
    };
  }

  // 파일 형식 확인
  const supportedMimeTypes = Object.keys(SUPPORTED_FILE_TYPES);
  const supportedExtensions = Object.values(SUPPORTED_FILE_TYPES).flat();
  
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  const mimeTypeSupported = supportedMimeTypes.includes(file.type);
  const extensionSupported = supportedExtensions.includes(fileExtension as any);

  if (!mimeTypeSupported && !extensionSupported) {
    return {
      isValid: false,
      error: `지원되지 않는 파일 형식입니다. 지원 형식: ${supportedExtensions.join(', ')}`,
    };
  }

  return { isValid: true };
}

/**
 * 파일에서 텍스트를 추출합니다
 */
export async function extractTextFromFile(file: File): Promise<FileProcessingResult> {
  const validation = validateFile(file);
  
  if (!validation.isValid) {
    return {
      text: '',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      success: false,
      error: validation.error,
    };
  }

  try {
    let extractedText: string;
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    switch (fileExtension) {
      case '.txt':
      case '.md':
        extractedText = await extractTextFromTextFile(file);
        break;
      case '.docx':
        extractedText = await extractTextFromDocx(file);
        break;
      default:
        throw new Error('지원되지 않는 파일 형식입니다.');
    }

    return {
      text: extractedText,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      success: true,
    };
  } catch (error) {
    return {
      text: '',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      success: false,
      error: error instanceof Error ? error.message : '파일 처리 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 텍스트 파일(.txt, .md)에서 텍스트 추출
 */
async function extractTextFromTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('파일을 읽을 수 없습니다.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('파일 읽기 중 오류가 발생했습니다.'));
    };
    
    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * DOCX 파일에서 텍스트 추출
 */
async function extractTextFromDocx(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
             } catch {
         reject(new Error('DOCX 파일 처리 중 오류가 발생했습니다.'));
       }
    };
    
    reader.onerror = () => {
      reject(new Error('파일 읽기 중 오류가 발생했습니다.'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 파일 크기를 읽기 쉬운 형태로 포맷팅
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 파일 형식에 따른 아이콘 반환
 */
export function getFileIcon(fileName: string): string {
  const extension = '.' + fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case '.txt':
      return '📄';
    case '.md':
      return '📝';
    case '.docx':
      return '📘';
    default:
      return '📁';
  }
} 