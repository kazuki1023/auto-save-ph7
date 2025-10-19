'use client';

import { Card, CardBody } from '@/components/heroui';

interface NameInputFormProps {
  name: string;
  onNameChange: (name: string) => void;
}

const NameInputForm = ({ name, onNameChange }: NameInputFormProps) => {
  return (
    <Card>
      <CardBody className="p-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground"
          >
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => onNameChange(e.target.value)}
            placeholder="回答者のお名前を入力してください"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default NameInputForm;
