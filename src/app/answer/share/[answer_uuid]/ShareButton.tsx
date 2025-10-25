'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaShareAlt } from 'react-icons/fa';

import Button from '@/components/heroui/Button';
import { getUrl } from '@/lib/env';

interface ShareButtonProps {
  answerUuid: string;
}

const ShareButton = ({ answerUuid }: ShareButtonProps) => {
  // シェアする文言とURL
  const shareUrl = `${getUrl()}/answer/${answerUuid}`;
  const shareText = `日程調整の回答をお願いします！`;

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
        className="w-full h-12 text-base font-bold flex items-center justify-center gap-2 rounded-lg bg-[#08C855] text-white shadow-md hover:bg-[#00b200] transition-colors duration-150"
        aria-label="LINEで送る"
        onClick={handleLineShare}
        style={{ letterSpacing: '0.05em' }}
      >
        <Image
          src="/images/LINE_Brand_icon.png"
          alt="LINE"
          width={20}
          height={20}
        />
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
