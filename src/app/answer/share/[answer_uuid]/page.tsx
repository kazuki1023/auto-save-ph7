// 回答者が回答したあとに遷移して、その後の催促を促すページ

import { Card, CardBody, CardFooter, CardHeader } from '@/components/heroui';
import { generateAnswerShareMetadata } from '@/lib/metadata/createAnswerShare';
import { getAnswerRank } from '@/repositories/answers';

import ShareButton from './ShareButton';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { answer_uuid: string };
}): Promise<Metadata> {
  const { answer_uuid } = params;
  return generateAnswerShareMetadata(answer_uuid);
}

const SharePage = async ({ params }: { params: { answer_uuid: string } }) => {
  const { answer_uuid } = params;

  // 効率的に順位を取得
  const rankData = await getAnswerRank(answer_uuid);
  const answerRank = rankData?.rank ?? 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-primary text-center">
            回答を受け付けました！
          </h1>
        </CardHeader>
        <CardBody className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-base text-gray-700">あなたの回答順位は</span>
            <span className="text-5xl font-extrabold text-primary mt-2 mb-1">
              {answerRank > 0 ? `${answerRank}位` : '—'}
            </span>
            <span className="text-base text-gray-700">でした！</span>
          </div>
          <ShareButton answerUuid={answer_uuid} />
        </CardBody>
        <CardFooter />
      </Card>
    </div>
  );
};

export default SharePage;
