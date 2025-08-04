'use client';
// 回答画面（統一版）- UIコンポーネント

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaWandMagicSparkles } from 'react-icons/fa6';

import { SignInButton } from '@/components/auth/signin_button';
import { Alert, Button, Card, CardBody, CardHeader } from '@/components/heroui';
import { generateCandidateIdFromObject } from '@/lib/date/candidateId';
import { createAnswer } from '@/reposiroties/answers';

import { checkAnswerSchedule } from './action';
import TripAnswerForm from './components/TripAnswerForm';

import type { RequestData } from '@/reposiroties/requests';
import type { Session } from 'next-auth';

interface AnswerProps {
  requestData: RequestData;
  session: Session | null;
}

const Answer = ({ requestData, session }: AnswerProps) => {
  const router = useRouter();
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
  // バリデーションエラー状態
  const [validationErrors, setValidationErrors] = useState<Map<string, string>>(
    new Map()
  );
  // グローバルバリデーションエラー
  const [globalError, setGlobalError] = useState<string>('');
  // 自動入力機能用の状態
  const [isAutoInputOpen, setIsAutoInputOpen] = useState(false);
  const [isAutoInputLoading, setIsAutoInputLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState(
    'google calendar の予定を確認中...'
  );

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

  // 自動入力処理
  const handleAutoInput = async () => {
    if (!requestData?.content_json.candidates) return;

    try {
      setIsAutoInputLoading(true);
      setProgressMessage('google calendar の予定を確認中...');

      // 候補データを準備
      const candidates = requestData.content_json.candidates.map(
        (candidate, index) => ({
          start: candidate.start,
          end: candidate.end,
          index,
        })
      );

      // バッチ処理（一度に全て処理）
      const result = await checkAnswerSchedule(candidates);

      if (result) {
        // 結果を既存の状態に反映
        const newAnswers = new Map(candidateAnswers);
        const newComments = new Map(candidateComments);
        const newErrors = new Map(validationErrors);

        result.forEach(r => {
          const candidateId = generateCandidateIdFromObject(
            {
              start: r.start,
              end: r.end,
            },
            r.index
          );

          // 回答を設定
          newAnswers.set(candidateId, r.response);

          // コメントを設定（conditionalの場合）
          if (r.response === 'conditional' && r.comment) {
            newComments.set(candidateId, r.comment);
          }

          // エラーをクリア
          newErrors.delete(candidateId);
        });

        setCandidateAnswers(newAnswers);
        setCandidateComments(newComments);
        setValidationErrors(newErrors);
      }

      setIsAutoInputLoading(false);
      setIsAutoInputOpen(false);
    } catch (error) {
      console.error('自動入力エラー:', error);
      setIsAutoInputLoading(false);
      setIsAutoInputOpen(false);
    }
  };

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
        router.push('/answer/share');
      } else {
        console.error('回答の保存に失敗しました');
      }
    } catch (error) {
      console.error('回答保存エラー:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* ヘッダー */}
        <Card>
          <CardHeader>
            <div className="flex flex-col w-full space-y-3">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">日程を選択してください</h1>
                <Button
                  color="primary"
                  size="sm"
                  startContent={<FaWandMagicSparkles />}
                  onPress={() => setIsAutoInputOpen(true)}
                >
                  自動入力
                </Button>
              </div>
              <div className="text-center text-sm text-foreground-500">
                {getAnsweredCount()}/
                {requestData.content_json.candidates?.length || 0}
              </div>
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
        {/* リクエストタイプ別のフォーム */}
        {requestData.type === 'trip' && requestData.content_json.candidates && (
          <TripAnswerForm
            requestData={requestData}
            candidateAnswers={candidateAnswers}
            candidateComments={candidateComments}
            validationErrors={validationErrors}
            onCandidateAnswer={setCandidateAnswer}
            onCandidateComment={setCandidateComment}
          />
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
        >
          日程調整候補日を確定する
        </Button>
      </div>

      {/* 自動入力モーダル */}
      <Modal
        isOpen={isAutoInputOpen}
        onClose={() => setIsAutoInputOpen(false)}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>google calendar から予定を取得します</ModalHeader>
          <ModalBody>
            {!session?.user ? (
              <>
                <p>Google連携が必要な機能です</p>
                <p>こちらからGoogle連携を許可してください</p>
                <SignInButton />
              </>
            ) : (
              <ol className="list-decimal list-inside text-sm flex flex-col gap-2">
                <li>Google Calendar の予定を取得する</li>
                <li>
                  取得した予定と日程調整候補日が被っていない場合は、参加とします
                </li>
                <li>
                  取得した予定と日程調整候補日が一部被っている場合は、条件付き参加とします
                </li>
                <li>
                  取得した予定と日程調整候補日が完全に被っている場合は、参加不可とします
                </li>
              </ol>
            )}
          </ModalBody>
          <ModalFooter className="w-full">
            <Button
              color="primary"
              className="w-full"
              onPress={handleAutoInput}
              isLoading={isAutoInputLoading}
              isDisabled={isAutoInputLoading || !session?.user}
            >
              {isAutoInputLoading ? progressMessage : '予定を取得して自動入力'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Answer;
