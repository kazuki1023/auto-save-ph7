import { Tables } from '@/lib/supabase/database.types';
import { supabase } from '@/lib/supabase/supabaseClient';

export const getQuestions = async (): Promise<Tables<'questions'>[] | null> => {
  const { data, error } = await supabase.from('questions').select('*');
  if (error) throw error;
  return data;
};
