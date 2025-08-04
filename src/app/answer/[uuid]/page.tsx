'use client';
// 回答画面

import { useRouter } from 'next/navigation';

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

  return (
    <>
      <Button
        onPress={handleRedirect}
        className="bg-[#61C48D] text-white shadow-sm"
      >
        日程調整候補日を確定する
      </Button>
    </>
  );
};

export default AnswerPage;
