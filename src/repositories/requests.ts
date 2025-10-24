import {
  Tables,
  type Database,
  type Json,
} from '@/lib/supabase/database.types';
import { supabase } from '@/lib/supabase/supabaseClient';

/**
 * Question type の定義を取得
 */
type QuestionsType = Database['public']['Enums']['questions_type'];

interface Candidate {
  start: string;
  end: string;
  // ドメイン固有の追加情報は meta や options として任意で保持する
  meta?: Record<string, string>;
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
    candidates?: Candidate[];
    notes?: string;
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
      candidates?: Candidate[];
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

/**
 * リクエストを作成する
 */
export const createRequest = async (
  title: string,
  contentJson: Json,
  type: QuestionsType
): Promise<{ id: string } | null> => {
  try {
    const requestData = {
      title,
      content_json: contentJson,
      type,
    };

    const { data, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select('id');

    if (error) {
      console.error('登録エラー:', error);
      return null;
    }

    if (Array.isArray(data) && data.length > 0 && data[0]?.id) {
      return { id: data[0].id };
    } else {
      console.error('登録結果が空です。');
      return null;
    }
  } catch (err) {
    console.error('予期しないエラー:', err);
    return null;
  }
};
