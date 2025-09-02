'use client';
// 旅行回答フォーム

import { useState } from 'react';

import { Alert, Card, CardBody } from '@/components/heroui';
import { generateCandidateIdFromObject } from '@/lib/date/candidateId';
import { formatDateRange } from '@/lib/date/formatters';
import { type RequestData } from '@/repositories/requests';

interface TripAnswerFormProps {
  requestData: RequestData;
  candidateAnswers: Map<string, 'good' | 'conditional' | 'bad'>;
  candidateComments: Map<string, string>;
  validationErrors: Map<string, string>;
  onCandidateAnswer: (
    candidateId: string,
    answerType: 'good' | 'conditional' | 'bad'
  ) => void;
  onCandidateComment: (candidateId: string, comment: string) => void;
}

const TripAnswerForm = ({
  requestData,
  candidateAnswers,
  candidateComments,
  validationErrors,
  onCandidateAnswer,
  onCandidateComment,
}: TripAnswerFormProps) => {
  // コメント入力欄の表示状態を管理
  const [showCommentFor, setShowCommentFor] = useState<string | null>(null);

  // コメントの表示/非表示を切り替え
  const toggleCommentInput = (candidateId: string) => {
    setShowCommentFor(showCommentFor === candidateId ? null : candidateId);
  };

  if (!requestData.content_json.candidates) {
    return null;
  }

  return (
    <div className="space-y-3">
      {requestData.content_json.candidates.map((candidate, index) => {
        const startDate = new Date(candidate.start);
        const endDate = new Date(candidate.end);
        const candidateId = generateCandidateIdFromObject(
          {
            start: candidate.start,
            end: candidate.end,
          },
          index
        );
        const currentAnswer = candidateAnswers.get(candidateId);
        const hasError = validationErrors.has(candidateId);

        // 宿泊数を計算
        const nights = Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const days = nights + 1;

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
                  {formatDateRange(startDate, endDate)}
                </div>
                <div className="text-sm text-foreground-500">
                  {nights === 0 ? '日帰り' : `${nights}泊${days}日`}
                </div>
                {/* デバッグ用：候補ID表示 */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-gray-400 mt-1">
                    ID: {candidateId}
                  </div>
                )}
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

              {/* バリデーションエラー表示 */}
              {hasError && (
                <div className="mb-3">
                  <Alert color="danger" variant="bordered">
                    {validationErrors.get(candidateId)}
                  </Alert>
                </div>
              )}

              {/* 回答ボタン */}
              <div className="flex justify-center gap-4 mb-3">
                <button
                  onClick={() => onCandidateAnswer(candidateId, 'good')}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                    currentAnswer === 'good'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400 text-gray-400'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full ${
                      currentAnswer === 'good'
                        ? 'bg-white'
                        : 'border-2 border-current'
                    }`}
                  />
                </button>

                <button
                  onClick={() => onCandidateAnswer(candidateId, 'conditional')}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                    currentAnswer === 'conditional'
                      ? 'bg-yellow-500 border-yellow-500 text-white'
                      : 'border-gray-300 hover:border-yellow-400 text-gray-400'
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L22 20H2L12 2Z" />
                  </svg>
                </button>

                <button
                  onClick={() => onCandidateAnswer(candidateId, 'bad')}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                    currentAnswer === 'bad'
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'border-gray-300 hover:border-red-400 text-gray-400'
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* コメント追加ボタンとアコーディオン */}
              <div className="text-center">
                <button
                  onClick={() => toggleCommentInput(candidateId)}
                  className="text-sm text-blue-600 hover:text-blue-800 mb-2"
                >
                  コメント追加
                </button>

                {/* コメント入力欄（アコーディオン） */}
                {showCommentFor === candidateId && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <textarea
                      value={candidateComments.get(candidateId) || ''}
                      onChange={e =>
                        onCandidateComment(candidateId, e.target.value)
                      }
                      placeholder="この候補についてコメントがあれば入力してください"
                      className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

export default TripAnswerForm;
