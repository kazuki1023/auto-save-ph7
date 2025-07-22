import { supabase } from '@/lib/supabase/supabaseClient';

export const getAnswers = async () => {
  const { data, error } = await supabase.from('answers').select('*');
  if (error) throw error;
  return data;
};
