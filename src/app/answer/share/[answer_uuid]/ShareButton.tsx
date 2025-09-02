'use client';

import { useState } from 'react';
import { FaShareAlt } from 'react-icons/fa';

import Button from '@/components/heroui/Button';

interface ShareButtonProps {
  answerUuid: string;
}

const ShareButton = ({ answerUuid }: ShareButtonProps) => {
  // シェアする文言とURL
  const shareUrl = `${window.location.origin}/answer/${answerUuid}`;
  const shareText = `日程調整の回答をお願いします！\n${shareUrl}`;

  // LINEシェアボタンのクリック処理
  const handleLineShare = () => {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(lineUrl, '_blank');
  };

  // テキストコピーのクリック処理
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full mt-2">
      <button
        type="button"
        className="w-full h-12 text-base font-bold flex items-center justify-center gap-2 rounded-lg bg-[#00c300] text-white shadow-md hover:bg-[#00b200] transition-colors duration-150"
        aria-label="LINEで送る"
        onClick={handleLineShare}
        style={{ letterSpacing: '0.05em' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect width="24" height="24" rx="6" fill="#00c300" />
          <path
            d="M12 6C8.13 6 5 8.69 5 12.07c0 2.13 1.38 3.99 3.47 4.97.16.07.34.13.52.16.62.13 1.13.23 1.63.31.52.09 1.01.16 1.56.16.55 0 1.04-.07 1.56-.16.5-.08 1.01-.18 1.63-.31.18-.03.36-.09.52-.16C17.62 16.06 19 14.2 19 12.07 19 8.69 15.87 6 12 6zm-2.47 7.13h-.97v-2.26h.97v2.26zm2.47 0h-.97v-2.26h.97v2.26zm2.47 0h-.97v-2.26h.97v2.26z"
            fill="white"
          />
        </svg>
        LINEで送る
      </button>
      <Button
        color="primary"
        className="w-full h-12 text-base flex items-center justify-center gap-2 font-bold tracking-wide shadow-md rounded-lg"
        aria-label="URLと依頼文をコピーする"
        onPress={handleCopy}
        style={{ letterSpacing: '0.05em' }}
      >
        <FaShareAlt className="w-5 h-5" />
        URLをコピーする
      </Button>
      {copied && (
        <div className="w-full bg-green-50 border border-green-200 rounded-lg p-3 mt-1 text-center">
          <span className="text-green-800 text-sm font-medium">
            ✓ 回答依頼文とURLをクリップボードにコピーしました
          </span>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
