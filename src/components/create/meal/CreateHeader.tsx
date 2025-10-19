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
            aria-label="戻る"
          >
            ←
          </button>
          <h1 className="text-xl font-bold">日程候補を選択</h1>
        </div>
      </CardHeader>
    </Card>
  );
};

export default CreateHeader;
