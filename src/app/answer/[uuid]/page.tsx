'use client';
// 回答画面

import { Input } from '@heroui/input';
import { useRouter } from 'next/navigation';

import { Card, CardBody, CardFooter, CardHeader } from '@/components/heroui';
import Button from '@/components/heroui/Button';

// import { useParams } from 'next/navigation';

const AnswerPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const { uuid } = useParams();

  const router = useRouter();

  // ボタンを押したときにリダイレクトする関数
  const handleRedirect = () => {
    router.push('/answer/share');
  };

  const data = {
    plan: { days: 3, nights: 2 },
    notes: '旅行の日程候補を作成しました',
    candidates: [
      { end: '2025-08-06T15:00:00.000Z', start: '2025-08-04T15:00:00.000Z' },
      { end: '2025-08-12T15:00:00.000Z', start: '2025-08-10T15:00:00.000Z' },
      { end: '2025-08-19T15:00:00.000Z', start: '2025-08-17T15:00:00.000Z' },
      { end: '2025-08-26T15:00:00.000Z', start: '2025-08-24T15:00:00.000Z' },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mb-8 w-full max-w-lg">
        <div className="font-bold mb-4 text-xl text-center">候補日一覧</div>
        <ul className="flex flex-col gap-4">
          {data.candidates.map((candidate, idx) => (
            <Card
              className="max-w-[340px] border border-green-300 mx-auto"
              key={idx}
            >
              <CardHeader className="justify-between font-bold">
                {new Date(candidate.start).toLocaleDateString()} 〜{' '}
                {new Date(candidate.end).toLocaleDateString()}
              </CardHeader>
              <CardFooter className="justify-between border-t gap-2">
                <Button className="bg-[#61C48D] text-white">参加する</Button>
                <Button className="bg-white text-red-500 border border-red-500">
                  欠席する
                </Button>
                <Button className="bg-white border border-[#61C48D] text-[#61C48D]">
                  未定
                </Button>
              </CardFooter>
              <CardBody>
                <Input
                  type="text"
                  label="備考"
                  placeholder="例）授業のため欠席です"
                />
              </CardBody>
            </Card>
          ))}
        </ul>
      </div>
      <Button
        onPress={handleRedirect}
        className="bg-[#61C48D] text-white shadow-sm font-bold"
      >
        日程調整候補日を確定する
      </Button>
    </div>
  );
};

export default AnswerPage;
