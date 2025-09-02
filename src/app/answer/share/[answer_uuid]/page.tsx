// 回答者が回答したあとに遷移して、その後の催促を促すページ

import { Card, CardBody, CardFooter, CardHeader } from '@/components/heroui';
import { getAnswerById, getAnswersByRequestId } from '@/repositories/answers';

import ShareButton from './ShareButton';

const SharePage = async ({ params }: { params: { answer_uuid: string } }) => {
  const { answer_uuid } = params;

  const answer = await getAnswerById(answer_uuid);
  const questionId = answer?.question_id ?? '';
  // 全回答取得
  const allAnswers = questionId ? await getAnswersByRequestId(questionId) : [];
  // created_at昇順でソート
  const sortedAnswers = (allAnswers ?? []).sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
  // 自分の順位（インデックス＋1）
  const answerRank = sortedAnswers.findIndex(a => a.id === answer_uuid) + 1;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-primary text-center">
            日程調整完了！
          </h1>
        </CardHeader>
        <CardBody className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-base text-gray-700">あなたの回答順位</span>
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
