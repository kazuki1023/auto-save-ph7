/**
 * 日付を「月日」形式でフォーマットする
 * @param date - フォーマットする日付
 * @returns "8月15日" のような形式の文字列
 */
export const formatDate = (date: Date): string => {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

/**
 * 日付範囲を「開始日 〜 終了日」形式でフォーマットする
 * 開始日と終了日が同じ場合は単一の日付のみを返す
 * @param startDate - 開始日
 * @param endDate - 終了日
 * @returns "8月15日 〜 8月17日" または "8月15日" のような形式の文字列
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  if (startDate.getTime() === endDate.getTime()) {
    return formatDate(startDate);
  }
  return `${formatDate(startDate)} 〜 ${formatDate(endDate)}`;
};

/**
 * 日付をYYYY-MM-DD形式でフォーマットする（input[type="date"]用）
 * @param date - フォーマットする日付
 * @returns "2025-08-15" のような形式の文字列
 */
export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * YYYY-MM-DD形式の文字列をローカル時間のDateオブジェクトに変換する
 * @param dateString - "2025-08-15" 形式の日付文字列
 * @returns Dateオブジェクト
 */
export const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};
