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
  // 旅行の場合：日付ベース
  if (candidate.start && candidate.end) {
    const formatDate = (dateStr: string): string => {
      return new Date(dateStr).toISOString().split('T')[0]; // YYYY-MM-DD形式
    };
    return `${formatDate(candidate.start)}_${formatDate(candidate.end)}`;
  }

  // 食事や他のタイプの場合：内容ベース + インデックス
  const contentHash = btoa(JSON.stringify(candidate)).substring(0, 8); // Base64エンコード後8文字
  const indexSuffix = index !== undefined ? `_${index}` : '';
  return `${contentHash}${indexSuffix}`;
};
