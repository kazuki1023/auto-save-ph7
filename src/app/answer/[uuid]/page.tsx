// 回答画面

import { getRequestByUuid } from '@/reposiroties/requests';

import Answer from './answer';

interface AnswerPageProps {
  params: { uuid: string };
}

const AnswerPage = async ({ params }: AnswerPageProps) => {
  try {
    const requestData = await getRequestByUuid(params.uuid);

    if (!requestData) {
      return (
        <div className="min-h-screen bg-background p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg text-red-600">
              データが見つかりませんでした
            </div>
          </div>
        </div>
      );
    }

    return <Answer requestData={requestData} />;
  } catch (err) {
    console.error('予期しないエラー:', err);
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600">
            データが見つかりませんでした
          </div>
        </div>
      </div>
    );
  }
};

export default AnswerPage;
