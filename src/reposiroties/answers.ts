import { generateCandidateIdFromObject } from '@/lib/date/candidateId';
import { Tables } from '@/lib/supabase/database.types';
import { supabase } from '@/lib/supabase/supabaseClient';

export const getAnswers = async (): Promise<Tables<'answers'>[] | null> => {
  const { data, error } = await supabase.from('answers').select('*');
  if (error) throw error;
  return data;
};

/**
 * 特定のリクエストに対する回答を取得する
 */
export const getAnswersByRequestId = async (
  requestId: string
): Promise<Tables<'answers'>[] | null> => {
  try {
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('question_id', requestId);

    if (error) {
      console.error('回答データ取得エラー:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('予期しないエラー:', err);
    return null;
  }
};

/**
 * 新しい回答を作成する
 */
export const createAnswer = async (answerData: {
  question_id: string;
  candidates: Array<{
    start: string;
    end: string;
    status: 'accepted' | 'pending' | 'rejected';
    note: string;
  }>;
  name?: string;
}): Promise<Tables<'answers'> | null> => {
  try {
    const { data, error } = await supabase
      .from('answers')
      .insert({
        question_id: answerData.question_id,
        answer_json: {
          candidates: answerData.candidates,
        },
        name: answerData.name,
      })
      .select()
      .single();

    if (error) {
      console.error('回答作成エラー:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('予期しないエラー:', err);
    return null;
  }
};

/**
 * 候補IDベースから新しいcandidates配列ベースに変換して作成する
 */
export const createAnswerWithCandidateIdsMigration = async (answerData: {
  question_id: string;
  candidate_responses: Record<string, 'good' | 'conditional' | 'bad'>; // candidateId -> answer
  candidate_comments?: Record<string, string>; // candidateId -> comment
  requestCandidates: { start: string; end: string }[]; // 元の候補リスト
  comment?: string;
  name?: string;
}): Promise<Tables<'answers'> | null> => {
  try {
    // candidates配列を構築
    const candidates = answerData.requestCandidates.map((candidate, index) => {
      const candidateId = generateCandidateIdFromObject(
        {
          start: candidate.start,
          end: candidate.end,
        },
        index
      );

      const response = answerData.candidate_responses[candidateId];
      const status: 'accepted' | 'pending' | 'rejected' =
        response === 'good'
          ? 'accepted'
          : response === 'conditional'
            ? 'pending'
            : 'rejected';
      const note = answerData.candidate_comments?.[candidateId] || '';

      return {
        start: candidate.start,
        end: candidate.end,
        status,
        note,
      };
    });

    // 新しいcandidates配列ベースの関数を使用
    return await createAnswer({
      question_id: answerData.question_id,
      candidates,
      name: answerData.name,
    });
  } catch (err) {
    console.error('回答作成（候補ID移行版）エラー:', err);
    return null;
  }
};

/**
 * 回答を更新する
 */
export const updateAnswer = async (
  answerId: string,
  updateData: {
    candidates?: Array<{
      start: string;
      end: string;
      status: 'accepted' | 'pending' | 'rejected';
      note: string;
    }>;
    comment?: string;
    name?: string;
  }
): Promise<Tables<'answers'> | null> => {
  try {
    const currentAnswer = await supabase
      .from('answers')
      .select('answer_json')
      .eq('id', answerId)
      .single();

    if (currentAnswer.error) {
      console.error('現在の回答取得エラー:', currentAnswer.error);
      return null;
    }

    const currentAnswerJson = currentAnswer.data.answer_json as {
      candidates?: Array<{
        start: string;
        end: string;
        status: 'accepted' | 'pending' | 'rejected';
        note: string;
      }>;
      comment?: string;
    } | null;

    const newAnswerJson = {
      ...currentAnswerJson,
      candidates:
        updateData.candidates ?? (currentAnswerJson?.candidates || []),
      comment: updateData.comment ?? currentAnswerJson?.comment,
    };

    const { data, error } = await supabase
      .from('answers')
      .update({
        answer_json: newAnswerJson,
        name: updateData.name,
      })
      .eq('id', answerId)
      .select()
      .single();

    if (error) {
      console.error('回答更新エラー:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('予期しないエラー:', err);
    return null;
  }
};
