// スケジュール競合分析

import { parseDateTime } from '@/lib/date/parse';

import { analyzeOverlap } from './overlap';

import type { CalendarEvent, OverlapAnalysis, OverlapType } from './types';

/**
 * 候補日程と既存予定の重複状況を分析
 * @param candidateStart 候補の開始日時（ISO文字列）
 * @param candidateEnd 候補の終了日時（ISO文字列）
 * @param events Googleカレンダーのイベント配列
 * @returns 重複分析結果
 */
export function analyzeScheduleConflicts(
  candidateStart: string,
  candidateEnd: string,
  events: CalendarEvent[]
): OverlapAnalysis {
  const candidateStartDate = parseDateTime(candidateStart);
  const candidateEndDate = parseDateTime(candidateEnd);

  const conflictingEvents = [];
  let maxOverlapType: OverlapType = 'none';

  for (const event of events) {
    if (!event.start || !event.end) continue;

    // イベントの開始・終了日時を取得
    const eventStartDate = parseDateTime(
      event.start.dateTime ||
        (event.start.date ? event.start.date + 'T00:00:00' : '')
    );
    const eventEndDate = parseDateTime(
      event.end.dateTime || (event.end.date ? event.end.date + 'T23:59:59' : '')
    );

    // 日時の取得に失敗した場合はスキップ
    if (isNaN(eventStartDate.getTime()) || isNaN(eventEndDate.getTime())) {
      continue;
    }

    const overlapType = analyzeOverlap(
      candidateStartDate,
      candidateEndDate,
      eventStartDate,
      eventEndDate
    );

    if (overlapType !== 'none') {
      conflictingEvents.push({
        summary: event.summary ?? '無題の予定',
        start: eventStartDate.toLocaleString('ja-JP'),
        end: eventEndDate.toLocaleString('ja-JP'),
      });

      // より重要な重複タイプで更新
      if (overlapType === 'complete' || maxOverlapType === 'none') {
        maxOverlapType = overlapType;
      }
    }
  }

  return {
    type: maxOverlapType,
    conflictingEvents,
  };
}
