import React from 'react';
import {
  ChevronLeft,
  Share2,
  Tag,
  Users,
  MapPin,
  PieChart,
  Trophy,
  Clock,
  CheckCircle2,
  Activity,
} from 'lucide-react';

// --- データ構造の型定義 ---
interface EventDetails {
  title: string;
  description: string;
  category: string;
  capacity: number;
  location: string;
  responseRate: number;
}

interface ConfirmedInfo {
  date: string;
  time: string;
  expectedParticipants: number;
  participationRate: number;
}

interface SummaryItem {
  rank: number;
  date: string;
  time: string;
  totalRate: number;
  status: '適正' | '余裕あり';
  attending: number;
  considering: number;
}

interface NonParticipationReason {
  reason: string;
  count: number;
}


// --- ダミーデータ ---
const eventDetailsData: EventDetails = {
  title: '新入生歓迎会',
  description: '新入生のみなさん、ぜひご参加ください！軽食とドリンクを用意します🎉',
  category: '新歓イベント',
  capacity: 100,
  location: '大学講堂',
  responseRate: 89,
};

const confirmedInfoData: ConfirmedInfo = {
  date: '4月12日(金)',
  time: '夕方 (17:00-20:00)',
  expectedParticipants: 58,
  participationRate: 80,
};

const summaryData: SummaryItem[] = [
  { rank: 1, date: '4月12日(金)', time: '夕方 (17:00-20:00)', totalRate: 80, status: '適正', attending: 52, considering: 6 },
  { rank: 2, date: '4月10日(水)', time: '午後 (13:00-17:00)', totalRate: 69, status: '余裕あり', attending: 45, considering: 8 },
  { rank: 3, date: '4月15日(月)', time: '午後 (13:00-17:00)', totalRate: 58, status: '余裕あり', attending: 38, considering: 12 },
];

const nonParticipationData: NonParticipationReason[] = [
  { reason: '授業', count: 15 },
  { reason: 'バイト', count: 8 },
  { reason: '他の予定', count: 12 },
  { reason: '体調不良', count: 3 },
  { reason: 'その他', count: 5 },
];

const maxReasonCount = Math.max(...nonParticipationData.map(r => r.count), 1);


// --- メインコンポーネント ---
export const AdvancedEventDetailsScreen = () => {
  return (
    <div className="bg-violet-50 min-h-screen font-sans">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <EventHeader details={eventDetailsData} />
        <ConfirmedDateCard info={confirmedInfoData} />
        <ParticipationSummaryCard summaryItems={summaryData} capacity={eventDetailsData.capacity} />
        <NonParticipationAnalysisCard reasons={nonParticipationData} />
      </div>
    </div>
  );
};


// --- 各セクションのコンポーネント ---

const EventHeader: React.FC<{ details: EventDetails }> = ({ details }) => (
  <header className="space-y-4">
    <div className="flex justify-between items-center">
      <button className="flex items-center text-sm text-slate-700 hover:text-slate-900">
        <ChevronLeft className="w-5 h-5" />
        投票画面に戻る
      </button>
      <button className="bg-white rounded-full p-2.5 shadow-sm border border-slate-200">
        <Share2 className="w-5 h-5 text-slate-600" />
      </button>
    </div>
    <div>
      <h1 className="text-3xl font-bold text-slate-800">🎉 {details.title}</h1>
      <p className="mt-2 text-slate-600">{details.description}</p>
    </div>
    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-600">
      <InfoItem icon={<Tag className="w-4 h-4 text-slate-400" />} text={details.category} />
      <InfoItem icon={<MapPin className="w-4 h-4 text-slate-400" />} text={details.location} />
      <InfoItem icon={<Users className="w-4 h-4 text-slate-400" />} text={`定員${details.capacity}人`} />
      <InfoItem icon={<PieChart className="w-4 h-4 text-slate-400" />} text={`回答率${details.responseRate}%`} />
    </div>
  </header>
);

const InfoItem: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span>{text}</span>
  </div>
);

const ConfirmedDateCard: React.FC<{ info: ConfirmedInfo }> = ({ info }) => (
  <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-green-800">開催決定！</h2>
        </div>
        <p className="mt-2 text-lg font-semibold text-slate-800">{info.date}</p>
        <p className="text-sm text-slate-600">{info.time}</p>
        <p className="mt-2 text-sm text-slate-600">予想参加者: {info.expectedParticipants}人</p>
      </div>
      <div className="bg-green-600 text-white text-sm font-bold rounded-md px-3 py-1">
        参加率{info.participationRate}%
      </div>
    </div>
  </div>
);

const ParticipationSummaryCard: React.FC<{ summaryItems: SummaryItem[], capacity: number }> = ({ summaryItems, capacity }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
    <div className="flex items-center gap-2">
      <Clock className="w-6 h-6 text-slate-500" />
      <h2 className="text-xl font-bold text-slate-800">参加率サマリー</h2>
    </div>
    <div className="space-y-6">
      {summaryItems.map(item => (
        <SummaryItem key={item.rank} item={item} capacity={capacity} />
      ))}
    </div>
  </div>
);

const SummaryItem: React.FC<{ item: SummaryItem, capacity: number }> = ({ item, capacity }) => {
  const rankColors = {
    1: 'bg-amber-100 text-amber-600',
    2: 'bg-slate-200 text-slate-600',
    3: 'bg-red-100 text-red-600',
  };
  const statusColors = {
    '適正': 'bg-green-100 text-green-700',
    '余裕あり': 'bg-sky-100 text-sky-700',
  };
  return (
    <div>
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <span className={`flex items-center justify-center w-7 h-7 rounded-full text-base font-bold ${rankColors[item.rank] || 'bg-slate-200'}`}>
            {item.rank}
          </span>
          <div>
            <p className="font-bold text-slate-800">{item.date}</p>
            <p className="text-sm text-slate-500">{item.time}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-800">{item.totalRate}%</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[item.status]}`}>
            {item.status}
          </span>
        </div>
      </div>
      <div className="mt-4 pl-10 space-y-3 text-sm">
        <ProgressBar label="参加" count={item.attending} total={capacity} icon={<CheckCircle2 className="w-4 h-4 text-green-500"/>} />
        <ProgressBar label="検討中" count={item.considering} total={capacity} icon={<Activity className="w-4 h-4 text-yellow-500"/>} />
        <p className="text-xs text-slate-500">
          予想参加者: {item.attending + item.considering}人 / 定員{capacity}人
        </p>
      </div>
    </div>
  );
};

const ProgressBar: React.FC<{ label: string, count: number, total: number, icon: React.ReactNode }> = ({ label, count, total, icon }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-1.5 text-slate-600">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-semibold text-slate-700">{count}人</span>
    </div>
    <div className="w-full bg-slate-200 rounded-full h-1.5">
      <div className="bg-slate-700 h-1.5 rounded-full" style={{ width: `${(count / total) * 100}%` }}></div>
    </div>
  </div>
);

const NonParticipationAnalysisCard: React.FC<{ reasons: NonParticipationReason[] }> = ({ reasons }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
    <h2 className="text-xl font-bold text-slate-800">不参加理由の分析</h2>
    <p className="text-sm text-slate-500 mt-1">今後のイベント企画の参考データ</p>
    <div className="mt-5 space-y-3">
      {reasons.map(reason => (
        <div key={reason.reason} className="flex justify-between items-center text-sm">
          <span className="text-slate-600 w-20">{reason.reason}</span>
          <div className="flex-grow bg-slate-200 rounded-full h-2 mx-4">
            <div className="bg-slate-400 h-2 rounded-full" style={{ width: `${(reason.count / maxReasonCount) * 100}%` }}></div>
          </div>
          <span className="font-semibold text-slate-700 w-8 text-right">{reason.count}人</span>
        </div>
      ))}
    </div>
  </div>
);

export default AdvancedEventDetailsScreen;
