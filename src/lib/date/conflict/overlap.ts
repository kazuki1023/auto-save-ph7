// 時間重複分析の基本ロジック

import type { OverlapType } from './types';

/**
 * 2つの時間範囲が重複しているかチェック
 * @param start1 範囲1の開始時刻
 * @param end1 範囲1の終了時刻
 * @param start2 範囲2の開始時刻
 * @param end2 範囲2の終了時刻
 * @returns 重複している場合はtrue
 */
export function checkTimeOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && start2 < end1;
}

/**
 * 重複の程度を分析
 * @param candidateStart 候補の開始時刻
 * @param candidateEnd 候補の終了時刻
 * @param eventStart イベントの開始時刻
 * @param eventEnd イベントの終了時刻
 * @returns 重複の種類
 */
export function analyzeOverlap(
  candidateStart: Date,
  candidateEnd: Date,
  eventStart: Date,
  eventEnd: Date
): OverlapType {
  // 重複なし
  if (!checkTimeOverlap(candidateStart, candidateEnd, eventStart, eventEnd)) {
    return 'none';
  }

  // 完全に重複（候補日程が既存予定に完全に含まれる）
  if (eventStart <= candidateStart && candidateEnd <= eventEnd) {
    return 'complete';
  }

  // 部分的な重複
  return 'partial';
}
