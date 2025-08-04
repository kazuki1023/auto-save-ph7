'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getAnswersCountByRequestId } from '@/reposiroties/answers';

const Rank = () => {
  const searchParams = useSearchParams();
  const uuid = searchParams.get('uuid');
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!uuid) return;
    const fetchCount = async () => {
      const answeredCount = await getAnswersCountByRequestId(uuid);
      setCount(answeredCount);
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

export default Rank;
