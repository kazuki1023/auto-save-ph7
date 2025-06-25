'use client';

import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FaCheck, FaCopy, FaShare } from 'react-icons/fa';

import { getUrl } from '@/lib/env';

export default function CreateCompleteComponent() {
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get('id') as string;
  const [copied, setCopied] = useState(false);

  const shareUrl = `${getUrl()}/schedule/register/${scheduleId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 w-full">
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
            <FaCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            日程調整を作成しました！
          </h1>
          <p className="text-gray-600">
            みんなにURLを共有して参加してもらいましょう
          </p>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <FaShare className="w-5 h-5 text-blue-600" />
              <span className="font-medium">共有URL</span>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg break-all text-sm mb-3">
              {shareUrl}
            </div>
            <Button
              color="primary"
              onPress={copyToClipboard}
              className="w-full"
              startContent={<FaCopy className="w-4 h-4" />}
            >
              {copied ? 'コピーしました！' : 'URLをコピー'}
            </Button>
          </Card>

          <Card className="bg-blue-50 border-blue-200 p-4">
            <h3 className="font-medium text-blue-900 mb-2">次のステップ</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• URLをLINEやメールで共有</li>
              <li>• 参加者が都合の良い時間を投票</li>
              <li>• リアルタイムで結果を確認</li>
            </ul>
          </Card>
        </div>

        <div className="mt-8 space-y-3">
          <Link href={`/schedule/view/detail?id=${scheduleId}`}>
            <Button variant="bordered" className="w-full">
              結果を確認する
            </Button>
          </Link>

          <Link href="/schedule/create">
            <Button variant="ghost" className="w-full">
              新しい日程調整を作成
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
