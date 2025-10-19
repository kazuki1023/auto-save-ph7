'use client';

import { Card, CardBody, Chip } from '@/components/heroui';
import { generateCandidateIdFromObject } from '@/lib/date/candidateId';
import { formatDate } from '@/lib/date/formatters';

interface MealAnswerFormProps {
  requestData: {
    content_json: {
      candidates?: Array<{
        start: string;
        end: string;
        mealTime?: 'lunch' | 'dinner';
        displayText?: string;
      }>;
    };
  };
  candidateAnswers: Map<string, 'good' | 'conditional' | 'bad'>;
  candidateComments: Map<string, string>;
  validationErrors: Map<string, string>;
  onCandidateAnswer: (
    candidateId: string,
    answer: 'good' | 'conditional' | 'bad'
  ) => void;
  onCandidateComment: (candidateId: string, comment: string) => void;
}

const MealAnswerForm = ({
  requestData,
  candidateAnswers,
  candidateComments,
  validationErrors,
  onCandidateAnswer,
  onCandidateComment,
}: MealAnswerFormProps) => {
  if (!requestData.content_json.candidates) {
    return (
      <Card>
        <CardBody className="text-center p-8">
          <div className="text-foreground-500">候補が設定されていません</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {requestData.content_json.candidates.map((candidate, index) => {
        const startDate = new Date(candidate.start);
        const candidateId = generateCandidateIdFromObject(
          {
            start: candidate.start,
            end: candidate.end,
          },
          index
        );
        const currentAnswer = candidateAnswers.get(candidateId);
        const hasError = validationErrors.has(candidateId);

        // 時間帯の表示用データ
        const mealTime = candidate.mealTime || 'lunch';
        const mealTimeLabel = mealTime === 'lunch' ? 'ランチ' : 'ディナー';
        const mealTimeEmoji = mealTime === 'lunch' ? '☀️' : '🌙';
        const defaultTime =
          mealTime === 'lunch' ? '12:00-14:00' : '18:00-20:00';

        return (
          <Card
            key={candidateId}
            id={`candidate-${candidateId}`}
            className={`w-full transition-all duration-200 ${
              currentAnswer
                ? 'bg-gray-100 border-gray-300 shadow-inner'
                : hasError
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200'
            }`}
          >
            <CardBody className="p-4">
              <div
                className={`text-center mb-4 ${
                  currentAnswer ? 'opacity-50 contrast-75' : ''
                }`}
              >
                <div className="font-medium text-lg">
                  {formatDate(startDate)}
                </div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Chip
                    size="sm"
                    variant="flat"
                    color={mealTime === 'lunch' ? 'warning' : 'secondary'}
                  >
                    {mealTimeEmoji} {mealTimeLabel}（{defaultTime}）
                  </Chip>
                </div>
                {currentAnswer && (
                  <div className="mt-2 inline-flex items-center px-2 py-1 bg-white/80 rounded-full text-xs font-medium text-gray-600">
                    回答済み (
                    {currentAnswer === 'good'
                      ? '○'
                      : currentAnswer === 'conditional'
                        ? '△'
                        : '×'}
                    )
                  </div>
                )}
              </div>

              {/* 回答ボタン */}
              <div className="flex justify-center gap-2 mb-4">
                {(['good', 'conditional', 'bad'] as const).map(answer => {
                  const isSelected = currentAnswer === answer;
                  const labels = {
                    good: '○',
                    conditional: '△',
                    bad: '×',
                  };
                  const colors = {
                    good: 'bg-green-500 hover:bg-green-600',
                    conditional: 'bg-yellow-500 hover:bg-yellow-600',
                    bad: 'bg-red-500 hover:bg-red-600',
                  };

                  return (
                    <button
                      key={answer}
                      onClick={() => onCandidateAnswer(candidateId, answer)}
                      className={`w-12 h-12 rounded-full text-white font-bold text-xl transition-all ${
                        isSelected
                          ? colors[answer] + ' scale-110 shadow-lg'
                          : colors[answer] + ' hover:scale-105'
                      }`}
                      aria-label={`${labels[answer]}で回答`}
                    >
                      {labels[answer]}
                    </button>
                  );
                })}
              </div>

              {/* コメント入力 */}
              <div className="space-y-2">
                <label
                  htmlFor={`comment-${candidateId}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  コメント（任意）
                </label>
                <textarea
                  id={`comment-${candidateId}`}
                  placeholder="この候補についてコメントがあれば入力してください"
                  value={candidateComments.get(candidateId) || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    onCandidateComment(candidateId, e.target.value)
                  }
                  rows={3}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${hasError ? 'border-red-300' : 'border-gray-300'}`}
                />
                {hasError && (
                  <p className="text-sm text-red-600 mt-1">
                    この候補への回答が必要です
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

export default MealAnswerForm;
