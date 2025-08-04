// 作成したアンケートを共有するためのURLをコピーできるページ

import ShareUrl from './ShareUrlComponent';

interface ShareUrlPageProps {
  params: { uuid: string };
}

const ShareUrlPage = ({ params }: ShareUrlPageProps) => {
  const { uuid } = params;

  return <ShareUrl uuid={uuid} />;
};

export default ShareUrlPage;
