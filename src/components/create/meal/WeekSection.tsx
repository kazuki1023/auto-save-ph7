import { Card, CardBody } from '@/components/heroui';

type MealTime = 'lunch' | 'dinner';

type DateOption = {
  date: Date;
  dayName: string;
  dayNumber: number;
  month: string;
  weekIndex: number;
  weekLabel: string;
};

type Props = {
  weekIndex: number;
  dates: DateOption[];
  selectedCandidates: Set<string>;
  toggleCandidate: (dateStr: string, mealTime: MealTime) => void;
};

const WeekSection = ({
  weekIndex,
  dates,
  selectedCandidates,
  toggleCandidate,
}: Props) => {
  const weekDates = dates.filter(d => d.weekIndex === weekIndex);
  if (weekDates.length === 0) return null;

  const weekLabel = weekDates[0]?.weekLabel || `第${weekIndex + 1}週`;

  return (
    <div className="mb-6" key={`week-${weekIndex}`}>
      <h3 className="text-lg font-medium text-foreground-700 mb-3">
        {weekLabel}
      </h3>
      <div className="space-y-2">
        {weekDates.map(dateOption => {
          const dateStr = dateOption.date.toISOString().split('T')[0];
          const lunchKey = `${dateStr}-lunch`;
          const dinnerKey = `${dateStr}-dinner`;

          return (
            <Card key={dateStr} className="border border-default-200">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <div className="text-sm text-foreground-500">
                        {dateOption.dayName}
                      </div>
                      <div className="text-2xl font-bold">
                        {dateOption.dayNumber}日
                      </div>
                      <div className="text-sm text-foreground-500">
                        {dateOption.month}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleCandidate(dateStr, 'lunch')}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors flex items-center gap-2 ${
                        selectedCandidates.has(lunchKey)
                          ? 'border-orange-400 bg-orange-400 text-white'
                          : 'border-default-200 bg-background hover:border-orange-400/50'
                      }`}
                    >
                      <span>☀️</span>
                      <span className="font-medium">ランチ</span>
                    </button>

                    <button
                      onClick={() => toggleCandidate(dateStr, 'dinner')}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors flex items-center gap-2 ${
                        selectedCandidates.has(dinnerKey)
                          ? 'border-purple-400 bg-purple-400 text-white'
                          : 'border-default-200 bg-background hover:border-purple-400/50'
                      }`}
                    >
                      <span>🌙</span>
                      <span className="font-medium">ディナー</span>
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WeekSection;
