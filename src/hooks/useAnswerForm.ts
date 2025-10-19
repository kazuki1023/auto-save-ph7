'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { generateCandidateIdFromObject } from '@/lib/date/candidateId';
import { createAnswer } from '@/repositories/answers';

import type { RequestData } from '@/repositories/requests';

export interface UseAnswerFormProps {
  requestData: RequestData;
}

export interface UseAnswerFormReturn {
  // 状態
  name: string;
  candidateAnswers: Map<string, 'good' | 'conditional' | 'bad'>;
  candidateComments: Map<string, string>;
  validationErrors: Map<string, string>;
  globalError: string;

  // アクション
  setName: (name: string) => void;
  setCandidateAnswer: (
    candidateId: string,
    answerType: 'good' | 'conditional' | 'bad'
  ) => void;
  setCandidateComment: (candidateId: string, comment: string) => void;
  validateAnswers: () => boolean;
  submitAnswers: () => Promise<void>;
  getAnsweredCount: () => number;

  // 自動入力機能の状態更新
  updateCandidateAnswers: (
    newAnswers: Map<string, 'good' | 'conditional' | 'bad'>
  ) => void;
  updateCandidateComments: (newComments: Map<string, string>) => void;
  clearValidationErrors: () => void;
}

export const useAnswerForm = ({
  requestData,
}: UseAnswerFormProps): UseAnswerFormReturn => {
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

  // 回答を送信
  const submitAnswers = async () => {
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
        router.push('/answer/share/' + result.id);
      } else {
        console.error('回答の保存に失敗しました');
      }
    } catch (error) {
      console.error('回答保存エラー:', error);
    }
  };

  // 自動入力機能用のヘルパー関数
  const updateCandidateAnswers = (
    newAnswers: Map<string, 'good' | 'conditional' | 'bad'>
  ) => {
    setCandidateAnswers(newAnswers);
  };

  const updateCandidateComments = (newComments: Map<string, string>) => {
    setCandidateComments(newComments);
  };

  const clearValidationErrors = () => {
    setValidationErrors(new Map());
  };

  return {
    // 状態
    name,
    candidateAnswers,
    candidateComments,
    validationErrors,
    globalError,

    // アクション
    setName,
    setCandidateAnswer,
    setCandidateComment,
    validateAnswers,
    submitAnswers,
    getAnsweredCount,

    // 自動入力機能の状態更新
    updateCandidateAnswers,
    updateCandidateComments,
    clearValidationErrors,
  };
};
