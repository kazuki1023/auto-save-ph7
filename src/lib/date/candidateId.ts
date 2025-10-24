/**
 * 候補の識別子生成ユーティリティ
 */

/**
 * 候補オブジェクトの型定義
 */
export interface CandidateObject {
  start?: string;
  end?: string;
  [key: string]: unknown; // その他のプロパティを許可
}

/**
 * 候補オブジェクトから一意識別子を生成する
 * 旅行の場合: 日付ベース、その他の場合: 内容ベース + インデックス
 */
export const generateCandidateIdFromObject = (
  candidate: CandidateObject,
  index?: number
): string => {
  const start = candidate.start || '';
  const end = candidate.end || '';

  return `${start}_${end}${index !== undefined ? `_${index}` : ''}`;
};
