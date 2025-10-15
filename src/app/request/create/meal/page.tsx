'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Card, CardBody, CardHeader } from '@/components/heroui';
import { supabase } from '@/lib/supabase/supabaseClient';

// 食事の時間帯を定義
const MEAL_TIMES = [
  { id: 'lunch', name: 'ランチ', emoji: '☀️', defaultTime: '12:00-14:00' },
  { id: 'dinner', name: 'ディナー', emoji: '🌙', defaultTime: '18:00-20:00' },
] as const;

type MealTime = (typeof MEAL_TIMES)[number]['id'];

// 今週と来週の日程候補を生成
const generateDateCandidates = (): Array<{
  date: Date;
  dayName: string;
  dayNumber: number;
  month: string;
  isNextWeek: boolean;
}> => {
  const today = new Date();
  const candidates = [];

  // 今週（今日から6日間）
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    candidates.push({
      date,
      dayName: dayNames[date.getDay()],
      dayNumber: date.getDate(),
      month: `${date.getMonth() + 1}月`,
      isNextWeek: false,
    });
  }

  // 来週（7日間）
  for (let i = 7; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    candidates.push({
      date,
      dayName: dayNames[date.getDay()],
      dayNumber: date.getDate(),
      month: `${date.getMonth() + 1}月`,
      isNextWeek: true,
    });
  }

  return candidates;
};

const RequestMealCreatePage = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(
    new Set()
  );
  const router = useRouter();

  const dateOptions = generateDateCandidates();

  // 戻るボタンの処理
  const handleBack = () => {
    router.back();
  };

  const toggleCandidate = (dateStr: string, mealTime: MealTime) => {
    const candidateKey = `${dateStr}-${mealTime}`;
    const newSelected = new Set(selectedCandidates);

    console.log('Toggle candidate:', { dateStr, mealTime, candidateKey });

    if (newSelected.has(candidateKey)) {
      newSelected.delete(candidateKey);
    } else {
      newSelected.add(candidateKey);
    }

    console.log('Selected candidates:', Array.from(newSelected));
    setSelectedCandidates(newSelected);
  };

  const handleCreatePlan = async () => {
    if (selectedCandidates.size === 0) {
      alert('日程候補を選択してください。');
      return;
    }

    try {
      // 選択された候補をデータベース形式に変換
      const candidates = Array.from(selectedCandidates).map(candidateKey => {
        const [dateStr, mealTime] = candidateKey.split('-') as [
          string,
          MealTime,
        ];
        const date = new Date(dateStr);

        // 時間の開始と終了を設定
        const startTime = mealTime === 'lunch' ? '12:00' : '18:00';
        const endTime = mealTime === 'lunch' ? '14:00' : '20:00';

        const startDateTime = new Date(date);
        const [startHour, startMinute] = startTime.split(':').map(Number);
        startDateTime.setHours(startHour, startMinute, 0, 0);

        const endDateTime = new Date(date);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        endDateTime.setHours(endHour, endMinute, 0, 0);

        return {
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          mealTime,
          displayText: `${MEAL_TIMES.find(t => t.id === mealTime)?.name}（${MEAL_TIMES.find(t => t.id === mealTime)?.defaultTime}）`,
        };
      });

      const requestData = {
        title: 'ご飯の日程調整',
        content_json: {
          type: 'meal',
          candidates,
          notes: 'ご飯の日程候補を作成しました',
        },
        type: 'meal' as const,
      };

      // Supabaseに登録
      const { data, error } = await supabase
        .from('requests')
        .insert(requestData)
        .select('id');

      if (error) {
        console.error('登録エラー:', error);
        alert('登録に失敗しました。もう一度お試しください。');
        return;
      }
      await router.push(`/request/shareUrl/${data[0].id}`);
    } catch (err) {
      console.error('予期しないエラー:', err);
      alert('予期しないエラーが発生しました。');
    }
  };

  const renderWeekSection = (
    title: string,
    dates: typeof dateOptions,
    isNextWeek: boolean
  ) => {
    const weekDates = dates.filter(d => d.isNextWeek === isNextWeek);
    if (weekDates.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground-700 mb-3">
          {title}
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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto">
        <Card className="w-full mb-6">
          <CardHeader className="text-center">
            <div className="flex items-center gap-2 justify-center mb-2">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-default-100 rounded-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-bold">日程候補を選択</h1>
            </div>
            <p className="text-foreground-500 text-sm">
              日付と時間帯を追加してください
            </p>
          </CardHeader>
        </Card>

        {renderWeekSection('今週', dateOptions, false)}
        {renderWeekSection('来週', dateOptions, true)}

        {/* 選択された候補の表示 */}
        {selectedCandidates.size > 0 && (
          <Card className="mb-6">
            <CardBody className="p-4">
              <div className="mb-3">
                <span className="font-semibold">
                  選択された候補（{selectedCandidates.size}件）
                </span>
              </div>
              <div className="space-y-2">
                {Array.from(selectedCandidates)
                  .map(candidateKey => {
                    const [dateStr, mealTime] = candidateKey.split('-') as [
                      string,
                      MealTime,
                    ];
                    const date = new Date(dateStr);
                    const mealTimeData = MEAL_TIMES.find(
                      t => t.id === mealTime
                    );

                    // mealTimeDataが見つからない場合はスキップ
                    if (!mealTimeData) {
                      console.error('Invalid mealTime:', mealTime);
                      return null;
                    }

                    return (
                      <div
                        key={candidateKey}
                        className="flex items-center justify-between p-2 bg-default-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span>{mealTimeData.emoji}</span>
                          <span className="font-medium">
                            {date.getMonth() + 1}月{date.getDate()}日(
                            {
                              ['日', '月', '火', '水', '木', '金', '土'][
                                date.getDay()
                              ]
                            }
                            ) （{mealTimeData.name}）
                          </span>
                        </div>
                        <button
                          onClick={() => toggleCandidate(dateStr, mealTime)}
                          className="p-1 text-red-400 hover:text-red-600"
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
                  })
                  .filter(Boolean)}
              </div>
            </CardBody>
          </Card>
        )}

        <Button
          color="primary"
          size="lg"
          className="w-full"
          onClick={handleCreatePlan}
          disabled={selectedCandidates.size === 0}
        >
          調整URLを発行
        </Button>
      </div>
    </div>
  );
};

export default RequestMealCreatePage;
