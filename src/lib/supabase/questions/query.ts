import { supabase } from '../supabaseClient';

export const getQuestions = async () => {
  const { data, error } = await supabase.from('questions').select('*');
  if (error) throw error;
  return data;
};
