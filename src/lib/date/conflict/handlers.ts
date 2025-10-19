// スケジュール競合レスポンス生成処理

import type { ScheduleResponse } from './types';

/**
 * 日時文字列を日本語の分かりやすい形式にフォーマット
 * @param dateTimeStr 日時文字列（例: "2024/1/15 10:00:00"）
 * @returns フォーマットされた日時文字列（例: "1月15日 10:00"）
 */
function formatDateTime(dateTimeStr: string): string {
  try {
    // 日時文字列をパース
    const date = new Date(dateTimeStr);

    // 無効な日付の場合は元の文字列を返す
    if (isNaN(date.getTime())) {
      return dateTimeStr;
    }

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${month}月${day}日 ${hours}:${minutes}`;
  } catch (err) {
    console.error('formatDateTime error', err);
    // エラーの場合は元の文字列を返す
    return dateTimeStr;
  }
}

/**
 * 重複なしの場合の処理
 * @returns 参加可能レスポンス
 */
export function handleNoConflict(): ScheduleResponse {
  return {
    response: 'good',
    comment: '✅ この時間帯は予定がありません。参加可能です。',
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
  const eventCount = conflictingEvents.length;
  const eventDescriptions = conflictingEvents
    .map(
      event =>
        `・${event.summary}（${formatDateTime(event.start)}〜${formatDateTime(event.end)}）`
    )
    .join('\n');

  return {
    response: 'conditional',
    comment: `⚠️ ${eventCount}件の予定と一部重複しています。調整可能です。\n\n【重複する予定】\n${eventDescriptions}`,
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
  const eventCount = conflictingEvents.length;
  const eventDescriptions = conflictingEvents
    .map(
      event =>
        `・${event.summary}（${formatDateTime(event.start)}〜${formatDateTime(event.end)}）`
    )
    .join('\n');

  return {
    response: 'bad',
    comment: `❌ ${eventCount}件の予定と完全に重複しています。参加困難です。\n\n【重複する予定】\n${eventDescriptions}`,
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
