export interface DiffResult {
  operation: 'equal' | 'insert' | 'delete';
  text: string;
}

export interface DiffStatistics {
  totalCharacters: number;
  addedCharacters: number;
  deletedCharacters: number;
  unchangedCharacters: number;
  addedWords: number;
  deletedWords: number;
  addedLines: number;
  deletedLines: number;
}

export type ComparisonMode = 'character' | 'word' | 'line';

export interface DiffConfig {
  mode: ComparisonMode;
  timeout: number;
  editCost: number;
  maxTextLength: number;
} 