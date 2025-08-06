// 回答者が回答したあとに遷移して、その後の催促を促すページ

import ShareButton from './ShareButton';

const SharePage = () => {
  // 仮データ（本来はpropsやAPIから取得）
  const answerRank = 4;
  const notAnswered = ['井上岳', '塚越UMA'];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#C8E6A0]">
      <div className="rounded-xl shadow-md p-8 w-full max-w-xs flex flex-col items-center bg-white bg-opacity-60">
        <div className="text-3xl font-extrabold text-[#8B2C4B] mb-6 text-center drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
          日程調整完了！
        </div>
        <div className="mt-2 mb-36 flex flex-col items-center">
          <span className="text-gray-700 text-lg mb-2">
            あなたの日調回答順は
          </span>
          <span className="text-6xl font-extrabold text-[#8B2C4B] mb-2 drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
            {answerRank}位
          </span>
          <span className="text-gray-700 text-lg">でした！</span>
        </div>
        <ShareButton />
        <div className="text-[#6B8E23] text-base text-center mb-2 font-semibold">
          まだ回答していない人
        </div>
        <ul className="text-[#4B4B4B] text-lg text-center">
          {notAnswered.map(name => (
            <li key={name} className="list-disc list-inside">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SharePage;
