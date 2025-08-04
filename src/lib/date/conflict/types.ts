// スケジュール競合分析用の型定義

// 予定の重複状況を分類する型
export type OverlapType = 'none' | 'partial' | 'complete';

// Google Calendar Event型定義
export interface CalendarEvent {
  summary?: string | null;
  start?: {
    dateTime?: string | null;
    date?: string | null;
  } | null;
  end?: {
    dateTime?: string | null;
    date?: string | null;
  } | null;
}

// 予定の重複分析結果
export interface OverlapAnalysis {
  type: OverlapType;
  conflictingEvents: Array<{
    summary: string;
    start: string;
    end: string;
  }>;
}

// スケジュール回答の型
export interface ScheduleResponse {
  response: 'good' | 'conditional' | 'bad';
  comment: string;
}
