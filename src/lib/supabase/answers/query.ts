import { supabase } from '../supabaseClient';

export const getAnswers = async () => {
  const { data, error } = await supabase.from('answers').select('*');
  if (error) throw error;
  return data;
};
