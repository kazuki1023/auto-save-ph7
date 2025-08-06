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
  const [copySuccess, setCopySuccess] = useState<{
    answer: boolean;
    result: boolean;
  }>({ answer: false, result: false });
  const router = useRouter();

  // 共有URLを生成
  const answerUrl = `${getUrl()}/answer/${uuid}`;
  const resultUrl = `${getUrl()}/result/${uuid}`;

  const handleCopyUrl = async (type: 'answer' | 'result') => {
    try {
      const url = type === 'answer' ? answerUrl : resultUrl;
      await navigator.clipboard.writeText(url);
      setCopySuccess(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopySuccess(prev => ({ ...prev, [type]: false }));
      }, 2000); // 2秒後にメッセージを非表示
    } catch (err) {
      console.error('URLのコピーに失敗しました:', err);
    }
  };

  // Topページに戻る
  const handleGoToTop = () => {
    router.push('/');
  };

  // 別タブでページを開く
  const handleOpenInNewTab = (type: 'answer' | 'result') => {
    const url = type === 'answer' ? answerUrl : resultUrl;
    window.open(url, '_blank', 'noopener,noreferrer');
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
          {/* 回答者用URL */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              回答者用URL
            </label>
            <div className="w-full overflow-hidden">
              <Snippet
                color="primary"
                variant="bordered"
                className="w-full break-all"
                onCopy={() => handleCopyUrl('answer')}
              >
                {answerUrl}
              </Snippet>
            </div>
            {/* コピー成功メッセージ */}
            {copySuccess.answer && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm font-medium">
                  ✓ 回答者用URLをクリップボードにコピーしました
                </p>
              </div>
            )}
          </div>

          {/* 結果確認用URL */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              結果確認用URL
            </label>
            <div className="w-full overflow-hidden">
              <Snippet
                color="secondary"
                variant="bordered"
                className="w-full break-all"
                onCopy={() => handleCopyUrl('result')}
              >
                {resultUrl}
              </Snippet>
            </div>
            {/* コピー成功メッセージ */}
            {copySuccess.result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm font-medium">
                  ✓ 結果確認用URLをクリップボードにコピーしました
                </p>
              </div>
            )}
          </div>

          {/* 使用方法 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">使用方法</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • <strong>回答者用URL</strong>:
                回答者に送信してアンケートに回答してもらう
              </li>
              <li>
                • <strong>結果確認用URL</strong>:
                回答結果を確認する（管理者・参加者用）
              </li>
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
            color="primary"
            variant="bordered"
            className="w-auto"
            onPress={() => handleOpenInNewTab('answer')}
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
            回答ページを開く
          </Button>

          <Button
            color="secondary"
            variant="bordered"
            className="w-auto"
            onPress={() => handleOpenInNewTab('result')}
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
          >
            結果ページを開く
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ShareUrl;
