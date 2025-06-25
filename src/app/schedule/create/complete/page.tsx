import CreateCompleteComponent from './complete';

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

  return <CreateCompleteComponent />;
}
