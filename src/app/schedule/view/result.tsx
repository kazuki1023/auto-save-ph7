'use client'
import {
  Heart,
  Star,
  Calendar,
  Users,
  BarChart2,
  Clock,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface User {
  name: string;
  level: number;
  avatarEmoji: string;
  description: string;
  points: number;
  thanksReceived: number;
  totalEvents: number;
  progressPercent: number;
}

interface EventItem {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  participants: number;
  acceptanceRate: number;
  timeAgo: string;
  role: '参加' | '主催';
}

export const Dashboard: React.FC = () => {

  const router = useRouter();

  const user: User = {
    name: 'ぽんちゃん',
    level: 3,
    avatarEmoji: '🐰',
    description: '感謝の気持ちが人間関係を豊かにするよ！',
    points: 12,
    thanksReceived: 12,
    totalEvents: 3,
    progressPercent: 60,
  };

  const ongoingEvents: EventItem[] = [
    {
      id: 1,
      title: '春合宿',
      subtitle: '旅行・合宿',
      icon: <Calendar className="w-6 h-6 text-blue-500" />,
      participants: 12,
      acceptanceRate: 75,
      timeAgo: '1時間前',
      role: '参加',
    },
    {
      id: 2,
      title: '新入生歓迎会',
      subtitle: '大型イベント',
      icon: <Users className="w-6 h-6 text-green-500" />,
      participants: 45,
      acceptanceRate: 68,
      timeAgo: '30分前',
      role: '主催',
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* User Card */}
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
            {user.avatarEmoji}
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {user.name} <span className="text-sm text-gray-500">Lv.{user.level}</span>
            </h2>
            <p className="text-gray-600">{user.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <div className="flex flex-col items-center">
            <Heart className="w-6 h-6 text-pink-500" />
            <span className="mt-1 text-lg font-bold">{user.points}</span>
            <span className="text-gray-600">感謝ポイント</span>
          </div>
          <div className="flex flex-col items-center">
            <Star className="w-6 h-6 text-yellow-500" />
            <span className="mt-1 text-lg font-bold">{user.thanksReceived}</span>
            <span className="text-gray-600">もらった感謝</span>
          </div>
          <div className="flex flex-col items-center">
            <Calendar className="w-6 h-6 text-blue-500" />
            <span className="mt-1 text-lg font-bold">{user.totalEvents}</span>
            <span className="text-gray-600">総イベント数</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>次のレベルまで</span>
            <span>{user.progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${user.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Create Button */}
      <button className="w-full max-w-md mx-auto py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg flex items-center justify-center">
        <Plus className="w-5 h-5 mr-2" />
        <span>新しい日程調整を作成</span>
      </button>

      {/* Ongoing Events */}
      <div className="max-w-md mx-auto space-y-6">
        <h3 className="text-lg font-semibold flex items-center">
          <ArrowUpRight className="w-5 h-5 mr-2" /> 進行中のイベント
        </h3>

        <div className="space-y-4">
          {ongoingEvents.map((ev) => (
            <div key={ev.id} className="bg-white rounded-lg shadow p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  {ev.icon}
                  <div>
                    <h4 className="font-bold">{ev.title}</h4>
                    <p className="text-sm text-gray-500">{ev.subtitle}</p>
                  </div>
                </div>
                <button className="py-1 px-3 border border-gray-300 text-gray-700 rounded-lg text-sm" onClick={() => router.replace(`/schedule/view/detail`)}>
                  {ev.role}
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{ev.participants}人</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BarChart2 className="w-4 h-4" />
                  <span>{ev.acceptanceRate}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{ev.timeAgo}</span>
                </div>
              </div>

              <button className="w-full py-2 border border-blue-500 text-blue-500 rounded-lg text-sm">
                結果を確認
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
