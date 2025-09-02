'use client';

import { FaShareAlt } from 'react-icons/fa';

import Button from '@/components/heroui/Button';

const ShareButton = () => {
  // シェアボタンのクリック処理（URLコピーのみ）
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };
  return (
    <Button
      color="primary"
      className="w-full h-12 text-lg flex items-center justify-center gap-2 font-bold tracking-wide shadow-sm"
      aria-label="回答順位をシェアする"
      onPress={handleShare}
    >
      <FaShareAlt className="w-5 h-5" />
      回答順位をシェアする
    </Button>
  );
};

export default ShareButton;
