import { Button } from '@/components/heroui';

type MealTime = 'lunch' | 'dinner';

type Props = {
  selectedCandidates: Set<string>;
  toggleCandidate: (dateStr: string, mealTime: MealTime) => void;
  handleCreatePlan: () => void;
};

const SelectedBar = ({
  selectedCandidates,
  toggleCandidate,
  handleCreatePlan,
}: Props) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-default-200 shadow-lg z-50">
      <div className="max-w-lg mx-auto">
        <div className="flex items-start justify-between p-4 border-b border-default-100">
          <div className="flex-1 mr-3">
            <div className="font-semibold text-lg mb-1">
              選択された候補（{selectedCandidates.size}件）
            </div>
            <div className="text-sm text-foreground-600 flex flex-wrap gap-1">
              {Array.from(selectedCandidates)
                .sort()
                .slice(0, 3)
                .map(candidateKey => {
                  const lastDashIndex = candidateKey.lastIndexOf('-');
                  const dateStr = candidateKey.substring(0, lastDashIndex);
                  const mealTime = candidateKey.substring(
                    lastDashIndex + 1
                  ) as MealTime;
                  const date = new Date(dateStr);
                  const emoji = mealTime === 'lunch' ? '☀️' : '🌙';

                  return (
                    <span
                      key={candidateKey}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-default-100 rounded-md"
                    >
                      <span className="text-xs">{emoji}</span>
                      <span className="text-xs">
                        {date.getMonth() + 1}/{date.getDate()}
                      </span>
                    </span>
                  );
                })}
              {selectedCandidates.size > 3 && (
                <span className="text-xs text-foreground-500 px-2 py-1">
                  {' '}
                  他{selectedCandidates.size - 3}件
                </span>
              )}
            </div>
          </div>
          <Button
            color="primary"
            size="sm"
            onClick={handleCreatePlan}
            disabled={selectedCandidates.size === 0}
          >
            調整URLを発行
          </Button>
        </div>

        <div className="bg-gray-50 border-b border-default-100">
          <div className="px-4 py-2">
            <div className="text-xs text-gray-600 font-medium mb-2">
              選択中の日程一覧
            </div>
          </div>
        </div>

        <div className="max-h-48 overflow-y-auto bg-gray-50">
          <div className="p-4 space-y-2">
            {Array.from(selectedCandidates)
              .sort()
              .map(candidateKey => {
                const lastDashIndex = candidateKey.lastIndexOf('-');
                const dateStr = candidateKey.substring(0, lastDashIndex);
                const mealTime = candidateKey.substring(
                  lastDashIndex + 1
                ) as MealTime;
                const date = new Date(dateStr);
                const name = mealTime === 'lunch' ? 'ランチ' : 'ディナー';

                return (
                  <div
                    key={candidateKey}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {mealTime === 'lunch' ? '☀️' : '🌙'}
                      </span>
                      <div>
                        <div className="font-medium text-sm">
                          {date.getMonth() + 1}月{date.getDate()}日
                        </div>
                        <div className="text-xs text-gray-500">{name}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCandidate(dateStr, mealTime)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="候補を削除"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedBar;
