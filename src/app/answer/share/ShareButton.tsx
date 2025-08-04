'use client';

import { Button } from '@heroui/button';
import { FaShareAlt } from 'react-icons/fa';

const ShareButton = () => {
  // シェアボタンのクリック処理（URLコピーのみ）
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('URLをコピーしました！');
  };
  return (
    <Button
      color="primary"
      className="w-full h-14 text-lg flex items-center justify-center gap-2 mb-8 font-bold tracking-wide shadow-sm bg-white text-[#8B2C4B]"
      onPress={handleShare}
    >
      <FaShareAlt className="w-6 h-6" />
      回答順位をシェアする
    </Button>
  );
};

export default ShareButton;
