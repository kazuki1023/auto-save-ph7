'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import CreateHeader from '@/components/create/meal/CreateHeader';
import SelectedBar from '@/components/create/meal/SelectedBar';
import WeekSection from '@/components/create/meal/WeekSection';
import { Button, Card, CardBody } from '@/components/heroui';
import { createRequest } from '@/repositories/requests';

type MealTime = 'lunch' | 'dinner';

type DateOption = {
  date: Date;
  dayName: string;
  dayNumber: number;
  month: string;
  weekIndex: number;
  weekLabel: string;
};

const generateDateCandidates = (weeks = 2) => {
  const today = new Date();
  const candidates: DateOption[] = [];

  for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const dayOffset = weekIndex * 7 + dayIndex;
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);

      const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

      let weekLabel = '';
      if (weekIndex === 0) weekLabel = '今週';
      else if (weekIndex === 1) weekLabel = '来週';
      else {
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

const Meal = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(
    new Set()
  );
  const [visibleWeeks, setVisibleWeeks] = useState(2);

  const dateOptions = generateDateCandidates(visibleWeeks);

  const toggleCandidate = (dateStr: string, mealTime: MealTime) => {
    const candidateKey = `${dateStr}-${mealTime}`;
    const newSelected = new Set(selectedCandidates);

    if (newSelected.has(candidateKey)) newSelected.delete(candidateKey);
    else newSelected.add(candidateKey);

    setSelectedCandidates(newSelected);
  };

  const handleCreatePlan = async () => {
    if (selectedCandidates.size === 0) {
      alert('日程候補を選択してください。');
      return;
    }

    // 選択をDB形式に変換
    const candidates = Array.from(selectedCandidates)
      .map(candidateKey => {
        const lastDashIndex = candidateKey.lastIndexOf('-');
        const dateStr = candidateKey.substring(0, lastDashIndex);
        const mealTime = candidateKey.substring(lastDashIndex + 1) as MealTime;

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return null;

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
        };
      })
      .filter(Boolean) as { start: string; end: string; mealTime: MealTime }[];

    if (candidates.length === 0) {
      alert('有効な日程候補がありません。再度選択してください。');
      return;
    }

    const dbCandidates = candidates.map(c => ({
      start: c.start,
      end: c.end,
      meta: { mealTime: c.mealTime },
    }));

    const requestData = {
      title: 'ご飯の日程調整',
      content_json: {
        type: 'meal',
        candidates: dbCandidates,
        notes: 'ご飯の日程候補を作成しました',
      },
      type: 'meal' as const,
    };

    const result = await createRequest(
      requestData.title,
      requestData.content_json,
      'meal'
    );
    if (!result) {
      alert('登録に失敗しました。もう一度お試しください。');
      return;
    }

    // router.push は page 側で担当する想定（ここでは簡潔化のため location を使う）
    window.location.href = `/request/shareUrl/${result.id}`;
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto">
        <CreateHeader onBack={() => router.back()} />

        {Array.from({ length: visibleWeeks }, (_, weekIndex) => (
          <WeekSection
            key={weekIndex}
            weekIndex={weekIndex}
            dates={dateOptions}
            selectedCandidates={selectedCandidates}
            toggleCandidate={toggleCandidate}
          />
        ))}

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

        {selectedCandidates.size > 0 && <div className="h-44" />}

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

      {selectedCandidates.size > 0 && (
        <SelectedBar
          selectedCandidates={selectedCandidates}
          toggleCandidate={toggleCandidate}
          handleCreatePlan={handleCreatePlan}
        />
      )}
    </div>
  );
};

export default Meal;
