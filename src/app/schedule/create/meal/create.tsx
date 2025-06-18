'use client';

import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CiClock1 } from 'react-icons/ci';
import { FaArrowLeft, FaCalendarAlt, FaBolt } from 'react-icons/fa';

import { supabase } from '@/lib/supabase/supabaseClient';

const timeSlots = [
  { id: 'lunch', label: 'ランチ', time: '12:00-15:00', icon: '🍽️' },
  { id: 'afternoon', label: 'カフェタイム', time: '15:00-17:00', icon: '☕' },
  { id: 'dinner', label: 'ディナー', time: '18:00-21:00', icon: '🍻' },
  { id: 'night', label: '夜遅め', time: '21:00-24:00', icon: '🌙' },
];

const quickDates = [
  { label: '今日', offset: 0 },
  { label: '明日', offset: 1 },
  { label: '明後日', offset: 2 },
  { label: '今度の土曜', offset: 'saturday' },
  { label: '今度の日曜', offset: 'sunday' },
];

export default function CreateMealPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  useEffect(() => {
    const titleParam = searchParams.get('title');
    if (titleParam) setTitle(titleParam);
  }, [searchParams]);

  const getDateFromOffset = (offset: number | string) => {
    const today = new Date();
    if (typeof offset === 'number') {
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      return date.toISOString().split('T')[0];
    } else if (offset === 'saturday') {
      const daysUntilSaturday = (6 - today.getDay() + 7) % 7 || 7;
      const date = new Date(today);
      date.setDate(today.getDate() + daysUntilSaturday);
      return date.toISOString().split('T')[0];
    } else if (offset === 'sunday') {
      const daysUntilSunday = (7 - today.getDay()) % 7 || 7;
      const date = new Date(today);
      date.setDate(today.getDate() + daysUntilSunday);
      return date.toISOString().split('T')[0];
    }
    return '';
  };

  const toggleTime = (timeId: string) => {
    setSelectedTimes(prev =>
      prev.includes(timeId)
        ? prev.filter(id => id !== timeId)
        : [...prev, timeId]
    );
  };

  const toggleDate = (dateStr: string) => {
    setSelectedDates(prev =>
      prev.includes(dateStr)
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  const createPoll = async () => {
    if (selectedTimes.length > 0 && selectedDates.length > 0) {
      const { data, error } = await supabase
        .from('questions')
        .insert({ id: crypto.randomUUID(), title: title })
        .select();
      if (error) {
        console.error('Error creating poll:', error);
        return;
      }
      console.log('Poll created successfully:', data);
      if (data && data.length > 0) {
        router.push(`/`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 w-full">
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="mb-6">
          <Link href="/create">
            <Button variant="ghost" className="mb-4 h-12 px-4">
              <FaArrowLeft className="w-5 h-5 mr-2" />
              戻る
            </Button>
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🍽️</span>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <p className="text-sm text-gray-600">サクッと時間と日程を選ぼう！</p>
        </div>

        <div className="space-y-6">
          <Card className="p-0">
            <div className="p-4 border-b flex flex-col gap-1">
              <div className="flex items-center gap-2 text-lg font-bold">
                <CiClock1 className="w-5 h-5" />
                時間帯を選択
              </div>
              <div className="text-sm text-gray-500">
                複数選択OK！みんなの都合に合わせて調整します
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map(slot => (
                  <Button
                    key={slot.id}
                    color={
                      selectedTimes.includes(slot.id) ? 'primary' : 'default'
                    }
                    className="h-16 flex flex-col items-center justify-center"
                    onPress={() => toggleTime(slot.id)}
                  >
                    <span className="text-lg mb-1">{slot.icon}</span>
                    <span className="text-xs font-medium">{slot.label}</span>
                    <span className="text-xs opacity-70">{slot.time}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-0">
            <div className="p-4 border-b flex flex-col gap-1">
              <div className="flex items-center gap-2 text-lg font-bold">
                <FaCalendarAlt className="w-5 h-5" />
                日程を選択
              </div>
              <div className="text-sm text-gray-500">
                いつでもOKな日を選んでください
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {quickDates.map((dateOption, index) => {
                  const dateStr = getDateFromOffset(dateOption.offset);
                  const date = new Date(dateStr);
                  const isSelected = selectedDates.includes(dateStr);

                  return (
                    <Button
                      key={index}
                      className="w-full h-12 justify-between"
                      color={isSelected ? 'primary' : 'default'}
                      onPress={() => toggleDate(dateStr)}
                    >
                      <span className="font-medium">{dateOption.label}</span>
                      <span className="text-sm opacity-70">
                        {date.toLocaleDateString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                          weekday: 'short',
                        })}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card className="bg-orange-50 border-orange-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaBolt className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-800">ご飯会モード</span>
            </div>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• 投票は超簡単！ワンタップで完了</li>
              <li>• 「とりあえず参加」で後から調整OK</li>
              <li>• リアルタイムで結果が見える</li>
            </ul>
          </Card>
        </div>

        <div className="mt-8">
          <Button
            color="primary"
            onPress={createPoll}
            disabled={selectedTimes.length === 0 || selectedDates.length === 0}
            className="w-full h-12 text-base"
          >
            日程調整を作成 🚀
          </Button>
        </div>
      </div>
    </div>
  );
}
