import { Suspense } from 'react';

import CreateCompleteComponent from './complete';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 w-full">
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-4 animate-pulse">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default function CreateCompletePage() {
  // 必要に応じて認証チェック
  // const session = await auth();
  // if (!session) {
  //   redirect('/auth/signin');
  // }

  // 必要に応じてスケジュールの存在確認
  // const schedule = await getScheduleById(params.id);
  // if (!schedule) {
  //   redirect('/schedule/create');
  // }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <CreateCompleteComponent />
    </Suspense>
  );
}
