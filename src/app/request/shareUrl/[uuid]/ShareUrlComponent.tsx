'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/heroui';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@/components/heroui/Card';
import Snippet from '@/components/heroui/Snippet';
import { getUrl } from '@/lib/env';

interface ShareUrlProps {
  uuid: string;
}

const ShareUrl = ({ uuid }: ShareUrlProps) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const router = useRouter();

  // 共有URLを生成
  const shareUrl = `${getUrl()}/answer/${uuid}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // 2秒後にメッセージを非表示
    } catch (err) {
      console.error('URLのコピーに失敗しました:', err);
    }
  };

  // Topページに戻る
  const handleGoToTop = () => {
    router.push('/');
  };

  // 別タブでアンケートページを開く
  const handleOpenInNewTab = () => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              アンケート共有URL
            </h1>
            <p className="text-gray-600">以下のURLを回答者に共有してください</p>
          </div>
        </CardHeader>

        <CardBody className="space-y-6">
          {/* URL表示 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              共有URL
            </label>
            <div className="w-full overflow-hidden">
              <Snippet
                color="primary"
                variant="bordered"
                className="w-full break-all"
                onCopy={handleCopyUrl}
              >
                {shareUrl}
              </Snippet>
            </div>
          </div>

          {/* コピー成功メッセージ */}
          {copySuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm font-medium">
                ✓ URLをクリップボードにコピーしました
              </p>
            </div>
          )}

          {/* 使用方法 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">使用方法</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 上記のURLを回答者に送信してください</li>
              <li>• 回答者はこのURLからアンケートに回答できます</li>
            </ul>
          </div>
        </CardBody>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 justify-center">
          <Button
            color="default"
            variant="bordered"
            className="w-auto"
            onPress={handleGoToTop}
            startContent={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            }
          >
            Topへ戻る
          </Button>

          <Button
            color="secondary"
            variant="bordered"
            className="w-auto"
            onPress={handleOpenInNewTab}
            startContent={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            }
          >
            別タブで開く
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ShareUrl;
