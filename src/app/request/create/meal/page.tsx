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

// 指定した週数分の日程候補を生成
const generateDateCandidates = (
  weeks: number = 2
): Array<{
  date: Date;
  dayName: string;
  dayNumber: number;
  month: string;
  weekIndex: number;
  weekLabel: string;
}> => {
  const today = new Date();
  const candidates = [];

  for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const dayOffset = weekIndex * 7 + dayIndex;
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);

      const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

      // 週のラベルを生成
      let weekLabel = '';
      if (weekIndex === 0) {
        weekLabel = '今週';
      } else if (weekIndex === 1) {
        weekLabel = '来週';
      } else {
        const weekStartDate = new Date(today);
        weekStartDate.setDate(today.getDate() + weekIndex * 7);
        weekLabel = `${weekStartDate.getMonth() + 1}月${Math.ceil(weekStartDate.getDate() / 7)}週目`;
      }

      candidates.push({
        date,
        dayName: dayNames[date.getDay()],
        dayNumber: date.getDate(),
        month: `${date.getMonth() + 1}月`,
        weekIndex,
        weekLabel,
      });
    }
  }

  return candidates;
};

const RequestMealCreatePage = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(
    new Set()
  );
  const [visibleWeeks, setVisibleWeeks] = useState(2);
  const router = useRouter();

  const dateOptions = generateDateCandidates(visibleWeeks);

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
        // candidateKeyの最後の'-'で分割して、日付部分と食事時間部分を正しく取得
        const lastDashIndex = candidateKey.lastIndexOf('-');
        const dateStr = candidateKey.substring(0, lastDashIndex);
        const mealTime = candidateKey.substring(lastDashIndex + 1) as MealTime;

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

  const renderWeekSection = (weekIndex: number, dates: typeof dateOptions) => {
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

        {/* 週ごとのセクションを表示 */}
        {Array.from({ length: visibleWeeks }, (_, weekIndex) =>
          renderWeekSection(weekIndex, dateOptions)
        )}

        {/* もっと見るボタン */}
        <Card className="mb-6">
          <CardBody className="p-4 text-center">
            <Button
              variant="ghost"
              onClick={() => setVisibleWeeks(prev => prev + 2)}
              className="w-full"
            >
              もっと見る（さらに2週間）
            </Button>
          </CardBody>
        </Card>

        {/* 選択候補がある場合は下部余白を追加（固定バーの分） */}
        {selectedCandidates.size > 0 && <div className="h-44" />}

        {/* 選択候補がない場合のみ通常の発行ボタンを表示 */}
        {selectedCandidates.size === 0 && (
          <Card className="mb-6">
            <CardBody className="p-4 text-center">
              <p className="text-foreground-500 mb-4">
                日程と時間帯を選択してください
              </p>
              <Button color="default" size="lg" className="w-full" disabled>
                調整URLを発行
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* 選択された候補の固定表示 */}
      {selectedCandidates.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-default-200 shadow-lg z-50">
          <div className="max-w-lg mx-auto">
            {/* ヘッダー部分 */}
            <div className="flex items-start justify-between p-4 border-b border-default-100">
              <div className="flex-1 mr-3">
                <div className="font-semibold text-lg mb-1">
                  選択された候補（{selectedCandidates.size}件）
                </div>
                <div className="text-sm text-foreground-600 flex flex-wrap gap-1">
                  {Array.from(selectedCandidates)
                    .sort()
                    .slice(0, 3) // 最初の3件のみ表示
                    .map(candidateKey => {
                      // candidateKeyの最後の'-'で分割して、日付部分と食事時間部分を正しく取得
                      const lastDashIndex = candidateKey.lastIndexOf('-');
                      const dateStr = candidateKey.substring(0, lastDashIndex);
                      const mealTime = candidateKey.substring(
                        lastDashIndex + 1
                      ) as MealTime;

                      const date = new Date(dateStr);
                      const mealTimeData = MEAL_TIMES.find(
                        t => t.id === mealTime
                      );

                      if (!mealTimeData) return null;

                      return (
                        <span
                          key={candidateKey}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-default-100 rounded-md"
                        >
                          <span className="text-xs">{mealTimeData.emoji}</span>
                          <span className="text-xs">
                            {date.getMonth() + 1}/{date.getDate()}
                          </span>
                        </span>
                      );
                    })
                    .filter(Boolean)}
                  {selectedCandidates.size > 3 && (
                    <span className="text-xs text-foreground-500 px-2 py-1">
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

            {/* 詳細リストセクション */}
            <div className="bg-gray-50 border-b border-default-100">
              <div className="px-4 py-2">
                <div className="text-xs text-gray-600 font-medium mb-2">
                  選択中の日程一覧
                </div>
              </div>
            </div>

            {/* スクロール可能な候補詳細リスト */}
            <div className="max-h-48 overflow-y-auto bg-gray-50">
              <div className="p-4 space-y-2">
                {Array.from(selectedCandidates)
                  .sort() // 日付順にソート
                  .map(candidateKey => {
                    // candidateKeyの最後の'-'で分割して、日付部分と食事時間部分を正しく取得
                    const lastDashIndex = candidateKey.lastIndexOf('-');
                    const dateStr = candidateKey.substring(0, lastDashIndex);
                    const mealTime = candidateKey.substring(
                      lastDashIndex + 1
                    ) as MealTime;

                    const date = new Date(dateStr);
                    const mealTimeData = MEAL_TIMES.find(
                      t => t.id === mealTime
                    );

                    // mealTimeDataが見つからない場合はスキップ
                    if (!mealTimeData) {
                      console.error(
                        'Invalid mealTime:',
                        mealTime,
                        'from candidateKey:',
                        candidateKey
                      );
                      return null;
                    }

                    return (
                      <div
                        key={candidateKey}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{mealTimeData.emoji}</span>
                          <div>
                            <div className="font-medium text-sm">
                              {date.getMonth() + 1}月{date.getDate()}日 (
                              {
                                ['日', '月', '火', '水', '木', '金', '土'][
                                  date.getDay()
                                ]
                              }
                              )
                            </div>
                            <div className="text-xs text-gray-500">
                              {mealTimeData.name}
                            </div>
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
                  })
                  .filter(Boolean)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestMealCreatePage;
