'use client';

import { createClient } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Runk = () => {
  const searchParams = useSearchParams();
  const uuid = searchParams.get('uuid');
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!uuid) return;
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from('answers')
        .select('*', { count: 'exact', head: true })
        .eq('question_id', uuid);

      if (error) {
        console.error(error);
        setCount(null);
      } else {
        setCount(count ?? 0);
      }
    };
    fetchCount();
  }, [uuid]);

  return (
    <p>
      {uuid
        ? count !== null
          ? `${count}位`
          : '読み込み中...'
        : 'uuidが指定されていません'}
    </p>
  );
};

export default Runk;
