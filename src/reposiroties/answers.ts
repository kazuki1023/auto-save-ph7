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
  candidate_responses: Record<number, 'good' | 'conditional' | 'bad'>; // good=○, conditional=△, bad=×
  candidate_comments?: Record<number, string>; // 候補毎のコメント
  comment?: string; // 全体のコメント（後方互換性のため残す）
  name?: string;
}): Promise<Tables<'answers'> | null> => {
  try {
    const { data, error } = await supabase
      .from('answers')
      .insert({
        question_id: answerData.question_id,
        answer_json: {
          candidate_responses: answerData.candidate_responses,
          candidate_comments: answerData.candidate_comments,
          comment: answerData.comment,
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
 * 回答を更新する
 */
export const updateAnswer = async (
  answerId: string,
  updateData: {
    candidate_responses?: Record<number, 'good' | 'conditional' | 'bad'>; // good=○, conditional=△, bad=×
    candidate_comments?: Record<number, string>; // 候補毎のコメント
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
      candidate_responses?: Record<number, 'good' | 'conditional' | 'bad'>; // good=○, conditional=△, bad=×
      candidate_comments?: Record<number, string>; // 候補毎のコメント
      comment?: string;
    } | null;

    const newAnswerJson = {
      ...currentAnswerJson,
      candidate_responses:
        updateData.candidate_responses ??
        (currentAnswerJson?.candidate_responses || {}),
      candidate_comments:
        updateData.candidate_comments ??
        (currentAnswerJson?.candidate_comments || {}),
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
