'use client';

import { useMemo, useState } from 'react';

import { Button, Card, CardBody, CardHeader } from '@/components/heroui';
import Calendar from '@/lib/react-multi-date-picker/Calendar';

import './calendar-styles.css';

interface TravelPlan {
  nights: number;
  days: number;
}

interface DateCandidate {
  id: string;
  startDate: Date;
  endDate: Date;
  displayText: string;
  formattedRange: string;
}

const travelPlans: TravelPlan[] = [
  { nights: 0, days: 1 },
  { nights: 1, days: 2 },
  { nights: 2, days: 3 },
  { nights: 3, days: 4 },
  { nights: 4, days: 5 },
  { nights: 5, days: 6 },
  { nights: 6, days: 7 },
];

const RequestTravelCreatePage = () => {
  const [step, setStep] = useState<'plan' | 'calendar'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<TravelPlan | null>(null);
  const [dateCandidates, setDateCandidates] = useState<DateCandidate[]>([]);

  // 編集機能の状態管理
  const [editingCandidate, setEditingCandidate] =
    useState<DateCandidate | null>(null);
  const [editForm, setEditForm] = useState({
    startDate: '',
    endDate: '',
  });

  // 選択済み日程の全日付一覧を計算（表示用）
  const selectedDateRanges = useMemo(() => {
    return dateCandidates.flatMap(candidate => {
      const dates = [];
      let current: Date;
      let end: Date;

      // 編集中の候補の場合は、editFormの値を使用
      if (
        editingCandidate?.id === candidate.id &&
        editForm.startDate &&
        editForm.endDate
      ) {
        // YYYY-MM-DD形式の文字列をローカル時間のDateに変換
        const [startYear, startMonth, startDay] = editForm.startDate
          .split('-')
          .map(Number);
        const [endYear, endMonth, endDay] = editForm.endDate
          .split('-')
          .map(Number);
        current = new Date(startYear, startMonth - 1, startDay);
        end = new Date(endYear, endMonth - 1, endDay);
      } else {
        current = new Date(candidate.startDate);
        end = new Date(candidate.endDate);
      }

      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    });
  }, [dateCandidates, editingCandidate, editForm.startDate, editForm.endDate]);

  // 日付フォーマット関数
  const formatDate = (date: Date): string => {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const formatDateRange = (startDate: Date, endDate: Date): string => {
    if (startDate.getTime() === endDate.getTime()) {
      return formatDate(startDate);
    }
    return `${formatDate(startDate)} 〜 ${formatDate(endDate)}`;
  };

  // 日付をYYYY-MM-DD形式にフォーマット（input[type="date"]用）
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 編集モードを開始
  const handleEditStart = (candidate: DateCandidate) => {
    const newEditForm = {
      startDate: formatDateForInput(candidate.startDate),
      endDate: formatDateForInput(candidate.endDate),
    };

    // 状態を同時に更新
    setEditingCandidate(candidate);
    setEditForm(newEditForm);
  };

  // 編集を保存
  const handleEditSave = () => {
    if (!editingCandidate || !editForm.startDate || !editForm.endDate) return;

    // YYYY-MM-DD形式の文字列をローカル時間のDateに変換
    const [startYear, startMonth, startDay] = editForm.startDate
      .split('-')
      .map(Number);
    const [endYear, endMonth, endDay] = editForm.endDate.split('-').map(Number);
    const newStartDate = new Date(startYear, startMonth - 1, startDay);
    const newEndDate = new Date(endYear, endMonth - 1, endDay);

    // バリデーション
    if (newStartDate >= newEndDate) {
      alert('終了日は開始日より後の日付を選択してください');
      return;
    }

    if (newStartDate <= new Date()) {
      alert('開始日は明日以降の日付を選択してください');
      return;
    }

    // 重複チェック（編集中の候補以外で）
    const otherCandidates = dateCandidates.filter(
      c => c.id !== editingCandidate.id
    );
    const isDuplicate = otherCandidates.some(
      candidate =>
        candidate.startDate.toDateString() === newStartDate.toDateString() &&
        candidate.endDate.toDateString() === newEndDate.toDateString()
    );

    if (isDuplicate) {
      alert('同じ日程の候補が既に存在します');
      return;
    }

    // 候補を更新
    const nights = Math.ceil(
      (newEndDate.getTime() - newStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const days = nights + 1;

    const newDisplayText = nights === 0 ? '日帰り' : `${nights}泊${days}日`;
    const newFormattedRange = formatDateRange(newStartDate, newEndDate);

    setDateCandidates(prev =>
      prev.map(candidate =>
        candidate.id === editingCandidate.id
          ? {
              ...candidate,
              startDate: newStartDate,
              endDate: newEndDate,
              displayText: newDisplayText,
              formattedRange: newFormattedRange,
            }
          : candidate
      )
    );

    setEditingCandidate(null);
    setEditForm({ startDate: '', endDate: '' });
  };

  // 編集をキャンセル
  const handleEditCancel = () => {
    setEditingCandidate(null);
    setEditForm({ startDate: '', endDate: '' });
  };

  const handlePlanSelect = (plan: TravelPlan) => {
    setSelectedPlan(plan);
    setStep('calendar');
  };

  const handleBackToPlan = () => {
    setStep('plan');
    setSelectedPlan(null);
    setDateCandidates([]);
  };

  const handleDateSelect = (selectedDate: unknown) => {
    if (!selectedDate || !selectedPlan) return;

    // DateObjectの型安全な処理
    const dateObj = selectedDate as {
      year: number;
      month: { number: number };
      day: number;
    };

    // 選択された日付をDateオブジェクトに変換
    const startDate = new Date(
      dateObj.year,
      dateObj.month.number - 1,
      dateObj.day
    );

    // 終了日を計算（宿泊数に応じて）
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + selectedPlan.nights); // 重複チェック（完全に同じ日程の候補のみをチェック）
    // 編集中の候補がある場合、その元の日程は除外して重複チェック
    let candidatesToCheck = dateCandidates;
    if (editingCandidate) {
      candidatesToCheck = dateCandidates.filter(
        candidate => candidate.id !== editingCandidate.id
      );
    }

    const isDuplicate = candidatesToCheck.some(
      candidate =>
        candidate.startDate.toDateString() === startDate.toDateString() &&
        candidate.endDate.toDateString() === endDate.toDateString()
    );

    if (isDuplicate) {
      alert('同じ日程の候補が既に存在します。');
      return;
    }

    const newCandidate: DateCandidate = {
      id: Date.now().toString(),
      startDate,
      endDate,
      displayText:
        selectedPlan.days === 1
          ? '日帰り'
          : `${selectedPlan.nights}泊${selectedPlan.days}日`,
      formattedRange: formatDateRange(startDate, endDate),
    };

    setDateCandidates(prev => [...prev, newCandidate]);
  };

  const handleRemoveCandidate = (id: string) => {
    setDateCandidates(prev => prev.filter(candidate => candidate.id !== id));
  };

  const handleCreatePlan = () => {
    if (dateCandidates.length === 0) {
      alert('日程候補を選択してください。');
      return;
    }

    console.log('選択されたプラン:', selectedPlan);
    console.log('日程候補:', dateCandidates);
    // ここで実際のプラン作成処理を行う
  };

  // カレンダーの日付スタイリング
  const mapDays = useMemo(
    () =>
      ({
        date,
      }: {
        date: { year: number; month: { number: number }; day: number };
      }) => {
        const currentDate = new Date(
          date.year,
          date.month.number - 1,
          date.day
        );

        // 選択済み出発日かチェック（同じ開始日でも異なる終了日なら許可）
        const hasExactMatch = dateCandidates.some(candidate => {
          const candidateEndDate = new Date(candidate.startDate);
          candidateEndDate.setDate(
            candidate.startDate.getDate() + (selectedPlan?.nights || 0)
          );

          return (
            candidate.startDate.getTime() === currentDate.getTime() &&
            candidateEndDate.getTime() ===
              currentDate.getTime() +
                (selectedPlan?.nights || 0) * 24 * 60 * 60 * 1000
          );
        });

        const isSelectedStartDate = hasExactMatch;

        // 選択済み期間に含まれる日付かチェック（表示用）
        const isInSelectedRange = selectedDateRanges.some(
          selectedDate => selectedDate.getTime() === currentDate.getTime()
        );

        // 過去の日付かチェック
        const isPast = currentDate < new Date(new Date().setHours(0, 0, 0, 0));

        let className = '';
        let style = {};

        if (isPast) {
          className = 'past-date';
          style = {
            color: '#ccc',
            backgroundColor: '#f5f5f5',
            cursor: 'not-allowed',
          };
        } else if (isSelectedStartDate) {
          // 出発日は選択不可（赤色）
          className = 'selected-start-date';
          style = {
            color: 'white',
            backgroundColor: '#ef4444',
            cursor: 'not-allowed',
          };
        } else if (isInSelectedRange) {
          // 宿泊期間は薄い色で表示（選択は可能）
          className = 'selected-range';
          style = { color: '#666', backgroundColor: '#fee2e2' };
        }

        return {
          className,
          style,
          disabled: isPast || isSelectedStartDate, // 出発日のみ無効化
        };
      },
    [selectedDateRanges, dateCandidates, selectedPlan?.nights]
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto">
        {/* max-widthを少し大きく */}
        {step === 'plan' && (
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold text-center w-full">
                旅行の日程を決めよう
              </h1>
              <p className="text-center text-foreground-500 w-full">
                まずは何泊の旅行にしますか？
              </p>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-4 gap-3">
                {travelPlans.map(plan => (
                  <button
                    key={`${plan.nights}-${plan.days}`}
                    onClick={() => handlePlanSelect(plan)}
                    className="aspect-square bg-background border-2 border-default-200 rounded-lg hover:border-primary hover:bg-primary/10 transition-colors flex flex-col items-center justify-center"
                  >
                    <div className="text-2xl font-bold text-foreground">
                      {plan.nights}
                    </div>
                    <div className="text-sm text-foreground-500">泊</div>
                  </button>
                ))}
              </div>

              {selectedPlan && (
                <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 text-primary">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold">
                      {selectedPlan.nights}泊{selectedPlan.days}
                      日の旅行プランです
                    </span>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {step === 'calendar' && selectedPlan && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToPlan}
                className="flex items-center gap-2 text-foreground-600 hover:text-foreground"
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
                戻る
              </button>
              <h2 className="text-xl font-bold">
                {selectedPlan.nights}泊{selectedPlan.days}日
              </h2>
            </div>

            <Card>
              <CardHeader>
                <p className="text-center text-foreground-600 w-full">
                  出発日をタップしてください
                </p>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center">
                  <Calendar
                    numberOfMonths={1}
                    onChange={handleDateSelect}
                    minDate={new Date()}
                    format="YYYY/MM/DD"
                    className="custom-calendar"
                    mapDays={mapDays}
                  />
                </div>

                {selectedPlan.nights > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-600 text-center">
                      💡 出発日を選択すると、{selectedPlan.nights}泊
                      {selectedPlan.days}日の期間が自動で設定されます
                    </div>
                  </div>
                )}

                {dateCandidates.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-semibold">日程候補</span>
                      <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded">
                        {dateCandidates.length}件
                      </span>
                    </div>

                    <div className="space-y-2">
                      {dateCandidates.map(candidate => (
                        <div
                          key={candidate.id}
                          className="bg-background border border-default-200 rounded-lg overflow-hidden"
                        >
                          {/* 通常表示 */}
                          <div className="flex items-center justify-between p-3">
                            <div>
                              <div className="font-medium">
                                {editingCandidate?.id === candidate.id &&
                                editForm.startDate &&
                                editForm.endDate
                                  ? `${formatDate(new Date(editForm.startDate))} 〜 ${formatDate(new Date(editForm.endDate))}`
                                  : candidate.formattedRange}
                              </div>
                              <div className="text-sm text-foreground-500">
                                {candidate.displayText}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  editingCandidate?.id === candidate.id
                                    ? handleEditCancel()
                                    : handleEditStart(candidate)
                                }
                                className="p-1 text-foreground-400 hover:text-foreground"
                              >
                                {editingCandidate?.id === candidate.id ? (
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
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                ) : (
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
                                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                  </svg>
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  handleRemoveCandidate(candidate.id)
                                }
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
                          </div>

                          {/* 編集フォーム（アコーディオン） */}
                          {editingCandidate?.id === candidate.id && (
                            <div className="border-t border-default-200 bg-default-50 p-4">
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-foreground-700 mb-1">
                                    開始日
                                  </label>
                                  <input
                                    type="date"
                                    value={editForm.startDate}
                                    onChange={e =>
                                      setEditForm(prev => ({
                                        ...prev,
                                        startDate: e.target.value,
                                      }))
                                    }
                                    className="w-full p-2 border border-default-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-foreground-700 mb-1">
                                    終了日
                                  </label>
                                  <input
                                    type="date"
                                    value={editForm.endDate}
                                    onChange={e =>
                                      setEditForm(prev => ({
                                        ...prev,
                                        endDate: e.target.value,
                                      }))
                                    }
                                    className="w-full p-2 border border-default-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                  />
                                </div>
                              </div>

                              <div className="flex gap-2 mt-4">
                                <Button
                                  color="default"
                                  size="sm"
                                  onPress={handleEditCancel}
                                  className="flex-1"
                                >
                                  キャンセル
                                </Button>
                                <Button
                                  color="primary"
                                  size="sm"
                                  onPress={handleEditSave}
                                  className="flex-1"
                                >
                                  保存
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      color="primary"
                      size="lg"
                      className="w-full"
                      onClick={handleCreatePlan}
                      disabled={dateCandidates.length === 0}
                    >
                      + この候補で旅行プランを作成
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestTravelCreatePage;
