'use client';

import { useSession } from 'next-auth/react';

import { SignInButton } from '@/components/auth/signin_button';
import { SignOutButton } from '@/components/auth/signout_button';
import { Card, CardBody, CardHeader, Chip, Link } from '@/components/heroui';

interface RequestPattern {
  id: string;
  name: string;
  emoji: string;
  description: string;
  href?: string;
  isComingSoon: boolean;
}

const requestPatterns: RequestPattern[] = [
  {
    id: 'meal',
    name: 'ご飯',
    emoji: '🍽️',
    description: '食事の日程を調整しましょう',
    href: '/request/create/meal',
    isComingSoon: false,
  },
  {
    id: 'travel',
    name: '旅行',
    emoji: '✈️',
    description: '旅行の日程を調整しましょう',
    href: '/request/create/travel',
    isComingSoon: false,
  },
  {
    id: 'meeting',
    name: '会議',
    emoji: '🏢',
    description: '会議の日程を調整しましょう',
    isComingSoon: true,
  },
  {
    id: 'event',
    name: 'イベント',
    emoji: '🎉',
    description: 'イベントの日程を調整しましょう',
    isComingSoon: true,
  },
  {
    id: 'study',
    name: '勉強会',
    emoji: '📚',
    description: '勉強会の日程を調整しましょう',
    isComingSoon: true,
  },
  {
    id: 'other',
    name: 'その他',
    emoji: '🔧',
    description: 'その他の日程を調整しましょう',
    isComingSoon: true,
  },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            <h1 className="font-bold text-foreground flex-1">日程調整アプリ</h1>
            {/* 認証ボタン */}
            <div className="text-center">
              {session ? <SignOutButton /> : <SignInButton />}
            </div>
          </div>
          <p className="text-xl text-foreground-500">
            用途に合わせて日程調整のパターンを選択してください
          </p>
        </div>

        {/* パターン選択カード */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {requestPatterns.map(pattern => {
            if (pattern.isComingSoon) {
              return (
                <div key={pattern.id} className="w-full h-full">
                  <Card className="opacity-60 cursor-not-allowed w-full h-full">
                    <CardHeader className="pb-2">
                      <div className="flex flex-col gap-2">
                        <div className="text-5xl">{pattern.emoji}</div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            {pattern.name}
                          </h3>
                          <Chip size="sm" color="default" variant="flat">
                            Coming Soon
                          </Chip>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0">
                      <p className="text-center text-foreground-500 text-sm">
                        {pattern.description}
                      </p>
                    </CardBody>
                  </Card>
                </div>
              );
            }

            return (
              <div key={pattern.id} className="w-full h-full">
                <Link href={pattern.href!} className="block w-full h-full">
                  <Card
                    className="hover:scale-105 transition-transform duration-200 cursor-pointer w-full h-full"
                    isPressable
                  >
                    <CardHeader className="pb-2">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-5xl">{pattern.emoji}</div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {pattern.name}
                        </h3>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0">
                      <p className="text-center text-foreground-500 text-sm">
                        {pattern.description}
                      </p>
                    </CardBody>
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
