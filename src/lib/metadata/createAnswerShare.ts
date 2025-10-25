// src/lib/metadata/createAnswerShare.ts
import { Metadata } from 'next';

import { getAnswerById, getAnswerRank } from '@/repositories/answers';

export async function generateAnswerShareMetadata(
  answerUuid: string
): Promise<Metadata> {
  // データベースから回答データを取得
  const answerData = await getAnswerById(answerUuid);
  const answerRank = await getAnswerRank(answerUuid);

  if (!answerData) {
    return {
      title: '回答が見つかりません',
      description: '指定された回答は存在しません。',
    };
  }
  if (!answerRank) {
    return {
      title: '回答が見つかりません',
      description: '指定された回答は存在しません。',
    };
  }

  return {
    title: `${answerData.name}さんは${answerRank.rank}位でした。みんな回答してね！`,
  };
}
