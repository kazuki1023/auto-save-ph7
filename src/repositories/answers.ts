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
    } | null;

    const newAnswerJson = {
      ...currentAnswerJson,
      candidates:
        updateData.candidates ?? (currentAnswerJson?.candidates || []),
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

/**
 * idから回答を取得する
 */
export const getAnswerById = async (
  id: string
): Promise<Tables<'answers'> | null> => {
  try {
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('id', id)
      .single();

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
 * 特定のquestion_idに対する回答の数を取得する
 */
export const countAnswersByQuestionId = async (
  questionId: string
): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('answers')
      .select('id', { count: 'exact' })
      .eq('question_id', questionId);

    if (error) {
      console.error('回答数取得エラー:', error);
      return 0;
    }

    return count ?? 0;
  } catch (err) {
    console.error('予期しないエラー:', err);
    return 0;
  }
};
