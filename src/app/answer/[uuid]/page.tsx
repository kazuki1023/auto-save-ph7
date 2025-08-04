'use client';
// 回答画面（統一版）

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Alert, Card, CardBody, CardHeader } from '@/components/heroui';
import Button from '@/components/heroui/Button';
import { generateCandidateIdFromObject } from '@/lib/date/candidateId';
import { formatDateRange } from '@/lib/date/formatters';
import { createAnswer } from '@/reposiroties/answers';
import { getRequestByUuid, type RequestData } from '@/reposiroties/requests';

const AnswerPage = () => {
  const params = useParams();
  const router = useRouter();
  const [requestData, setRequestData] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);
  // 回答者の名前
  const [name, setName] = useState<string>('');
  // 各候補の回答状態を管理（candidateId -> 'good' | 'conditional' | 'bad'）
  const [candidateAnswers, setCandidateAnswers] = useState<
    Map<string, 'good' | 'conditional' | 'bad'>
  >(new Map());
  // 各候補のコメント状態を管理
  const [candidateComments, setCandidateComments] = useState<
    Map<string, string>
  >(new Map());
  // コメント入力欄の表示状態を管理
  const [showCommentFor, setShowCommentFor] = useState<string | null>(null);
  // バリデーションエラー状態
  const [validationErrors, setValidationErrors] = useState<Map<string, string>>(
    new Map()
  );
  // グローバルバリデーションエラー
  const [globalError, setGlobalError] = useState<string>('');

  // リクエストデータを取得
  useEffect(() => {
    const fetchRequestData = async () => {
      // uuidパラメータの型安全性チェック
      const uuid =
        typeof params.uuid === 'string' ? params.uuid : params.uuid?.[0];
      if (!uuid) {
        console.error('UUID パラメータが無効です');
        setLoading(false);
        return;
      }

      try {
        const data = await getRequestByUuid(uuid);
        setRequestData(data);
      } catch (err) {
        console.error('予期しないエラー:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();
  }, [params.uuid]);

  // 候補の回答を設定
  const setCandidateAnswer = (
    candidateId: string,
    answerType: 'good' | 'conditional' | 'bad'
  ) => {
    const newAnswers = new Map(candidateAnswers);
    const newErrors = new Map(validationErrors);

    if (newAnswers.get(candidateId) === answerType) {
      // 同じボタンを押した場合は選択解除
      newAnswers.delete(candidateId);
      newErrors.delete(candidateId);
    } else {
      // 新しい回答を設定
      newAnswers.set(candidateId, answerType);
      newErrors.delete(candidateId); // エラーをクリア

      // 自動スクロール: 次の未回答の候補にスクロール
      const candidates = requestData?.content_json.candidates || [];
      const currentIndex = candidates.findIndex(
        c =>
          generateCandidateIdFromObject(
            {
              start: c.start,
              end: c.end,
            },
            candidates.indexOf(c)
          ) === candidateId
      );

      for (
        let nextIndex = currentIndex + 1;
        nextIndex < candidates.length;
        nextIndex++
      ) {
        const nextCandidateId = generateCandidateIdFromObject(
          {
            start: candidates[nextIndex].start,
            end: candidates[nextIndex].end,
          },
          nextIndex
        );
        if (!newAnswers.has(nextCandidateId)) {
          setTimeout(() => {
            const nextElement = document.getElementById(
              `candidate-${nextCandidateId}`
            );
            if (nextElement) {
              nextElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }
          }, 300);
          break;
        }
      }
    }

    setCandidateAnswers(newAnswers);
    setValidationErrors(newErrors);
  };

  // コメントの表示/非表示を切り替え
  const toggleCommentInput = (candidateId: string) => {
    setShowCommentFor(showCommentFor === candidateId ? null : candidateId);
  };

  // コメントを設定
  const setCandidateComment = (candidateId: string, comment: string) => {
    const newComments = new Map(candidateComments);
    const newErrors = new Map(validationErrors);

    if (comment.trim() === '') {
      newComments.delete(candidateId);
      // △でコメントが空の場合はエラー
      if (candidateAnswers.get(candidateId) === 'conditional') {
        newErrors.set(candidateId, '△を選択した場合はコメントが必要です');
      }
    } else {
      newComments.set(candidateId, comment);
      newErrors.delete(candidateId); // エラーをクリア
    }

    setCandidateComments(newComments);
    setValidationErrors(newErrors);
  };

  // バリデーション実行
  const validateAnswers = (): boolean => {
    const newErrors = new Map<string, string>();
    const candidates = requestData?.content_json.candidates || [];

    // 名前の検証
    if (!name.trim()) {
      setGlobalError('お名前を入力してください');
      return false;
    }

    // すべての候補に回答が必要
    for (const candidate of candidates) {
      const candidateId = generateCandidateIdFromObject(
        {
          start: candidate.start,
          end: candidate.end,
        },
        candidates.indexOf(candidate)
      );
      if (!candidateAnswers.has(candidateId)) {
        newErrors.set(candidateId, '回答を選択してください');
      } else if (candidateAnswers.get(candidateId) === 'conditional') {
        // △の場合はコメント必須
        if (
          !candidateComments.has(candidateId) ||
          candidateComments.get(candidateId)?.trim() === ''
        ) {
          newErrors.set(candidateId, '△を選択した場合はコメントが必要です');
        }
      }
    }

    setValidationErrors(newErrors);
    setGlobalError('');

    if (newErrors.size > 0) {
      setGlobalError('すべての日程に回答してください');
      return false;
    }

    return true;
  };

  // 回答済みの候補数を取得
  const getAnsweredCount = () => candidateAnswers.size;

  // ボタンを押したときにリダイレクトする関数
  const handleRedirect = async () => {
    if (!requestData) return;

    // バリデーション実行
    if (!validateAnswers()) {
      // エラーがある場合は最初のエラー項目にスクロール
      const firstErrorCandidateId = Array.from(validationErrors.keys())[0];
      if (firstErrorCandidateId !== undefined) {
        const errorElement = document.getElementById(
          `candidate-${firstErrorCandidateId}`
        );
        if (errorElement) {
          errorElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }
      return;
    }

    try {
      // candidates配列を構築
      const candidates = (requestData.content_json.candidates || []).map(
        (candidate, index) => {
          const candidateId = generateCandidateIdFromObject(
            {
              start: candidate.start,
              end: candidate.end,
            },
            index
          );

          const response = candidateAnswers.get(candidateId);
          const status: 'accepted' | 'pending' | 'rejected' =
            response === 'good'
              ? 'accepted'
              : response === 'conditional'
                ? 'pending'
                : 'rejected';
          const note = candidateComments.get(candidateId) || '';

          return {
            start: candidate.start,
            end: candidate.end,
            status,
            note,
          };
        }
      );

      // 回答を作成（新しいcandidates配列ベース版を使用）
      const result = await createAnswer({
        question_id: requestData.id,
        candidates,
        name: name.trim(),
      });

      if (result) {
        console.log('回答が保存されました:', result);
        router.push('/answer/share');
      } else {
        console.error('回答の保存に失敗しました');
      }
    } catch (error) {
      console.error('回答保存エラー:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!requestData) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600">
            データが見つかりませんでした
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* ヘッダー */}
        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-center w-full">
              日程を選択してください
            </h1>
            <div className="text-center text-sm text-foreground-500 w-full">
              {getAnsweredCount()}/
              {requestData.content_json.candidates?.length || 0}
            </div>
          </CardHeader>
        </Card>

        {/* 名前入力 */}
        <Card>
          <CardBody className="p-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                お名前 <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="回答者のお名前を入力してください"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </CardBody>
        </Card>

        {/* グローバルエラー表示 */}
        {globalError && (
          <Alert color="danger" variant="bordered">
            {globalError}
          </Alert>
        )}

        {/* 旅行プランの場合の候補リスト */}
        {requestData.type === 'trip' && requestData.content_json.candidates && (
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
                (endDate.getTime() - startDate.getTime()) /
                  (1000 * 60 * 60 * 24)
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
                        onClick={() => setCandidateAnswer(candidateId, 'good')}
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
                        onClick={() =>
                          setCandidateAnswer(candidateId, 'conditional')
                        }
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
                        onClick={() => setCandidateAnswer(candidateId, 'bad')}
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
                              setCandidateComment(candidateId, e.target.value)
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
        )}

        {/* その他のタイプの場合 */}
        {requestData.type !== 'trip' && (
          <Card>
            <CardBody className="text-center p-8">
              <div className="text-foreground-500">
                このタイプ（{requestData.type}）はまだ対応していません
              </div>
            </CardBody>
          </Card>
        )}

        {/* 確定ボタン */}
        <Button
          onPress={handleRedirect}
          className="bg-[#61C48D] text-white shadow-sm w-full"
          size="lg"
          disabled={
            candidateAnswers.size === 0 ||
            candidateAnswers.size <
              (requestData.content_json.candidates?.length || 0)
          }
        >
          日程調整候補日を確定する
        </Button>
      </div>
    </div>
  );
};

export default AnswerPage;
