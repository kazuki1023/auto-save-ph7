'use client';
// 回答画面

import { Input } from '@heroui/input';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Card, CardBody, CardFooter, CardHeader } from '@/components/heroui';
import Button from '@/components/heroui/Button';
import { supabase } from '@/lib/supabase/supabaseClient';

// import { useParams } from 'next/navigation';

const AnswerPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { uuid } = useParams();

  // データ取得用のstate
  const [request, setRequest] = useState(null);

  // uuidを元にrequestsテーブルからデータ取得
  useEffect(() => {
    if (!uuid) return;
    const fetchRequest = async () => {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('id', uuid)
        .single();
      if (error) {
        console.error(error);
        return;
      }
      setRequest(data);
    };
    fetchRequest();
  }, [uuid]);

  const router = useRouter();

  // ボタンを押したときにリダイレクトする関数
  const handleRedirect = () => {
    router.push('/answer/share');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mb-8 w-full max-w-lg">
        <div className="font-bold mb-4 text-xl text-center">候補日一覧</div>
        <ul className="flex flex-col gap-4">
          {request?.content_json?.candidates.map((candidate, idx) => (
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
