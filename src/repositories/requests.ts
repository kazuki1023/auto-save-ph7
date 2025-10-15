import { Tables } from '@/lib/supabase/database.types';
import { supabase } from '@/lib/supabase/supabaseClient';

interface TripCandidate {
  start: string;
  end: string;
}

interface MealCandidate {
  start: string;
  end: string;
  mealTime?: 'lunch' | 'dinner';
  displayText?: string;
}

export interface RequestData {
  id: string;
  title: string;
  type: string;
  content_json: {
    plan?: {
      nights: number;
      days: number;
    };
    candidates?: TripCandidate[] | MealCandidate[];
    notes?: string;
    type?: string;
  };
}

/**
 * UUIDでリクエストデータを取得する
 */
export const getRequestByUuid = async (
  uuid: string
): Promise<RequestData | null> => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('id', uuid)
      .single();

    if (error) {
      console.error('データ取得エラー:', error);
      return null;
    }

    // content_jsonを型安全に変換
    const contentJson = data.content_json as {
      plan?: {
        nights: number;
        days: number;
      };
      candidates?: TripCandidate[];
      notes?: string;
    } | null;

    return {
      id: data.id,
      title: data.title,
      type: data.type,
      content_json: contentJson || {},
    };
  } catch (err) {
    console.error('予期しないエラー:', err);
    return null;
  }
};

/**
 * 全てのリクエストを取得する
 */
export const getRequests = async (): Promise<Tables<'requests'>[] | null> => {
  const { data, error } = await supabase.from('requests').select('*');
  if (error) throw error;
  return data;
};
