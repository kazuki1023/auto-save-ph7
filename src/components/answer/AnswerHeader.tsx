'use client';

import { FaWandMagicSparkles } from 'react-icons/fa6';

import { Button, Card, CardHeader } from '@/components/heroui';

interface AnswerHeaderProps {
  answeredCount: number;
  totalCount: number;
  onAutoInputClick: () => void;
}

const AnswerHeader = ({
  answeredCount,
  totalCount,
  onAutoInputClick,
}: AnswerHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col w-full space-y-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">日程を選択してください</h1>
            <Button
              color="primary"
              size="sm"
              startContent={<FaWandMagicSparkles />}
              onPress={onAutoInputClick}
            >
              自動入力
            </Button>
          </div>
          <div className="text-center text-sm text-foreground-500">
            {answeredCount}/{totalCount}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default AnswerHeader;
