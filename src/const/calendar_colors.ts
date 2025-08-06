/**
 * カレンダー用の色パレット（落ち着いた色合い）
 * 候補ごとに異なる色を割り当てるために使用
 */
export const CALENDAR_COLOR_PALETTE = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
] as const;

/**
 * 候補IDと色のマッピングを生成するヘルパー関数
 * @param candidateIds - 候補のID配列
 * @returns 候補IDをキー、色を値とするオブジェクト
 */
export const generateCandidateColors = (
  candidateIds: string[]
): Record<string, string> => {
  const colors: Record<string, string> = {};
  candidateIds.forEach((id, index) => {
    colors[id] = CALENDAR_COLOR_PALETTE[index % CALENDAR_COLOR_PALETTE.length];
  });
  return colors;
};
