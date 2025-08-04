/**
 * 候補の識別子生成とパース用ユーティリティ
 */

/**
 * SHA-256ベースの短いハッシュを生成
 */
const generateHash = async (input: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  // 最初の8文字を使用（十分にユニーク）
  return hashHex.substring(0, 8);
};

/**
 * 候補オブジェクトの型定義
 */
export interface CandidateObject {
  start?: string;
  end?: string;
  [key: string]: unknown; // その他のプロパティを許可
}

/**
 * 候補オブジェクトから一意識別子を生成する（非同期版）
 */
export const generateCandidateIdFromObjectAsync = async (
  candidate: CandidateObject
): Promise<string> => {
  // 候補の全内容をJSON文字列化してハッシュ化
  const candidateString = JSON.stringify(
    candidate,
    Object.keys(candidate).sort()
  );
  return await generateHash(candidateString);
};

/**
 * 候補オブジェクトから一意識別子を生成する（同期版・簡易）
 * 日付ベース + インデックスのフォールバック
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

/**
 * 旅行候補の一意識別子を生成する（後方互換性用）
 * フォーマット: "YYYY-MM-DD_YYYY-MM-DD" (start_date_end_date)
 */
export const generateCandidateId = (startDate: Date, endDate: Date): string => {
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD形式
  };

  return `${formatDate(startDate)}_${formatDate(endDate)}`;
};

/**
 * 候補識別子から日付範囲を復元する
 */
export const parseCandidateId = (
  candidateId: string
): { start: Date; end: Date } | null => {
  try {
    const [startStr, endStr] = candidateId.split('_');
    if (!startStr || !endStr) return null;

    const start = new Date(startStr);
    const end = new Date(endStr);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    return { start, end };
  } catch (error) {
    console.error('候補ID解析エラー:', error);
    return null;
  }
};

/**
 * 候補識別子が有効かチェックする
 */
export const isValidCandidateId = (candidateId: string): boolean => {
  return parseCandidateId(candidateId) !== null;
};

/**
 * 候補リストから候補IDマップを生成する
 * インデックスベースから候補IDベースへの移行用ヘルパー
 */
export const createCandidateIdMap = (
  candidates: { start: string; end: string }[]
): Map<number, string> => {
  const map = new Map<number, string>();
  candidates.forEach((candidate, index) => {
    const candidateId = generateCandidateIdFromObject(candidate);
    map.set(index, candidateId);
  });
  return map;
};

/**
 * インデックスベースのデータを候補IDベースに変換する
 */
export const convertIndexDataToCandidateIdData = <T>(
  indexData: Record<number, T>,
  indexToCandidateIdMap: Map<number, string>
): Record<string, T> => {
  const candidateIdData: Record<string, T> = {};

  Object.entries(indexData).forEach(([indexStr, value]) => {
    const index = parseInt(indexStr, 10);
    const candidateId = indexToCandidateIdMap.get(index);
    if (candidateId) {
      candidateIdData[candidateId] = value;
    }
  });

  return candidateIdData;
};

/**
 * 候補IDベースのデータをインデックスベースに変換する（後方互換性用）
 */
export const convertCandidateIdDataToIndexData = <T>(
  candidateIdData: Record<string, T>,
  candidates: { start: string; end: string }[]
): Record<number, T> => {
  const indexData: Record<number, T> = {};

  candidates.forEach((candidate, index) => {
    const candidateId = generateCandidateIdFromObject(candidate);
    if (candidateIdData[candidateId] !== undefined) {
      indexData[index] = candidateIdData[candidateId];
    }
  });

  return indexData;
};
