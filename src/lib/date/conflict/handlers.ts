// スケジュール競合レスポンス生成処理

import type { ScheduleResponse } from './types';

/**
 * 重複なしの場合の処理
 * @returns 参加可能レスポンス
 */
export function handleNoConflict(): ScheduleResponse {
  return {
    response: 'good',
    comment: '予定なし、参加可能です',
  };
}

/**
 * 部分的重複の場合の処理
 * @param conflictingEvents 競合する予定の配列
 * @returns 条件付き参加レスポンス
 */
export function handlePartialConflict(
  conflictingEvents: Array<{ summary: string; start: string; end: string }>
): ScheduleResponse {
  const eventDescriptions = conflictingEvents
    .map(event => `${event.summary}（${event.start}〜${event.end}）`)
    .join('、');

  return {
    response: 'conditional',
    comment: `一部予定と重複：${eventDescriptions}`,
  };
}

/**
 * 完全重複の場合の処理
 * @param conflictingEvents 競合する予定の配列
 * @returns 参加不可レスポンス
 */
export function handleCompleteConflict(
  conflictingEvents: Array<{ summary: string; start: string; end: string }>
): ScheduleResponse {
  const eventDescriptions = conflictingEvents
    .map(event => `${event.summary}（${event.start}〜${event.end}）`)
    .join('、');

  return {
    response: 'bad',
    comment: `予定と完全に重複：${eventDescriptions}`,
  };
}

/**
 * 重複タイプに応じた適切なハンドラーを実行
 * @param overlapType 重複の種類
 * @param conflictingEvents 競合する予定の配列
 * @returns 適切なスケジュールレスポンス
 */
export function handleConflictByType(
  overlapType: 'none' | 'partial' | 'complete',
  conflictingEvents: Array<{ summary: string; start: string; end: string }>
): ScheduleResponse {
  switch (overlapType) {
    case 'none':
      return handleNoConflict();
    case 'partial':
      return handlePartialConflict(conflictingEvents);
    case 'complete':
      return handleCompleteConflict(conflictingEvents);
    default:
      return handleNoConflict();
  }
}
