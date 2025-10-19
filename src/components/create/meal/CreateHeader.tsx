import { Card, CardHeader } from '@/components/heroui';

type Props = {
  onBack: () => void;
};

const CreateHeader = ({ onBack }: Props) => {
  return (
    <Card className="w-full mb-6">
      <CardHeader className="text-center">
        <div className="flex items-center gap-2 justify-center mb-2">
          <button
            onClick={onBack}
            className="p-2 hover:bg-default-100 rounded-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold">日程候補を選択</h1>
        </div>
        <p className="text-foreground-500 text-sm">
          日付と時間帯を追加してください
        </p>
      </CardHeader>
    </Card>
  );
};

export default CreateHeader;
