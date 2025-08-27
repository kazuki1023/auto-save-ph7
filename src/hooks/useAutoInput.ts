'use client';

import { useState } from 'react';

import { checkAnswerSchedule } from '@/app/answer/[uuid]/action';
import { generateCandidateIdFromObject } from '@/lib/date/candidateId';

import type { RequestData } from '@/reposiroties/requests';

export interface UseAutoInputProps {
  requestData: RequestData;
  candidateAnswers: Map<string, 'good' | 'conditional' | 'bad'>;
  candidateComments: Map<string, string>;
  validationErrors: Map<string, string>;
  onUpdateAnswers: (
    newAnswers: Map<string, 'good' | 'conditional' | 'bad'>
  ) => void;
  onUpdateComments: (newComments: Map<string, string>) => void;
  onClearErrors: () => void;
}

export interface UseAutoInputReturn {
  isAutoInputOpen: boolean;
  isAutoInputLoading: boolean;
  progressMessage: string;
  setIsAutoInputOpen: (open: boolean) => void;
  handleAutoInput: () => Promise<void>;
}

export const useAutoInput = ({
  requestData,
  candidateAnswers,
  candidateComments,
  validationErrors,
  onUpdateAnswers,
  onUpdateComments,
  onClearErrors,
}: UseAutoInputProps): UseAutoInputReturn => {
  const [isAutoInputOpen, setIsAutoInputOpen] = useState(false);
  const [isAutoInputLoading, setIsAutoInputLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState(
    'google calendar の予定を確認中...'
  );

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

        onUpdateAnswers(newAnswers);
        onUpdateComments(newComments);
        onClearErrors();
      }

      setIsAutoInputLoading(false);
      setIsAutoInputOpen(false);
    } catch (error) {
      console.error('自動入力エラー:', error);
      setIsAutoInputLoading(false);
      setIsAutoInputOpen(false);
    }
  };

  return {
    isAutoInputOpen,
    isAutoInputLoading,
    progressMessage,
    setIsAutoInputOpen,
    handleAutoInput,
  };
};
