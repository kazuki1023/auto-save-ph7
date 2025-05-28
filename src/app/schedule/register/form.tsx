'use client';
import { Button } from '@heroui/button';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { RadioGroup, Radio } from '@heroui/radio';
import Link from 'next/link';
import { useState } from 'react';
import { FaWandMagicSparkles } from 'react-icons/fa6';

import { dummy_schedule } from '@/const/dummy_scedule';

import { checkSchedule } from './action';

const batchSize = 3;

export default function RegisterForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState(
    'google calendar の予定を確認中...'
  );
  const [searchCondition, setSearchCondition] = useState('');
  const [result, setResult] = useState<
    {
      schedule_id: number;
      date: string;
      start_time: string;
      end_time: string;
      option: '参加' | '途中参加' | '途中退出' | '不参加';
      reason: string;
    }[]
  >([]);
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      for (let i = 0; i < dummy_schedule.length; i += batchSize) {
        const batch = dummy_schedule.slice(i, i + batchSize);
        setProgressMessage(
          `${batch[batch.length - 1].date} までの日程を確認中`
        );
        const result = await checkSchedule(batch, searchCondition);
        setResult(prev => [...prev, ...(result ?? [])]);
      }
      setIsLoading(false);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-row gap-5 justify-center items-center mb-2 ">
        <Button as={Link} href="/schedule" color="secondary">
          戻る
        </Button>
        <h1 className="text-2xl font-bold">ダミー日程調整</h1>
        <Button
          color="primary"
          startContent={<FaWandMagicSparkles />}
          onPress={() => setIsOpen(true)}
        >
          自動入力
        </Button>
      </div>
      <div>
        <Form className="flex flex-col gap-5 min-w-[450px] justify-center items-center">
          {dummy_schedule.map(schedule => {
            const aiResult = result.find(r => r.schedule_id === schedule.id);
            return (
              <Card
                key={schedule.id}
                className="flex flex-col w-full max-w-[600px]"
              >
                <CardHeader className="">
                  <div className="flex flex-row gap-3 items-center justify-between w-full">
                    <p className="text-lg font-bold">{schedule.date}</p>
                    <p className="text-sm font-bold">
                      {schedule.start_time} - {schedule.end_time}
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="flex flex-col gap-3 w-full">
                  <RadioGroup
                    orientation="horizontal"
                    value={aiResult?.option}
                    className="flex flex-row gap-5"
                  >
                    <Radio value="参加">参加</Radio>
                    <Radio value="途中参加">途中参加</Radio>
                    <Radio value="途中退出">途中退出</Radio>
                    <Radio value="不参加">不参加</Radio>
                  </RadioGroup>
                  {aiResult?.reason && (
                    <p className="text-sm text-gray-500">{aiResult.reason}</p>
                  )}
                </CardBody>
              </Card>
            );
          })}
          <Button color="primary">登録する</Button>
        </Form>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>google calendar から予定を取得します</ModalHeader>
          <ModalBody>
            <p>条件</p>
            <Input
              type="text"
              placeholder="カレンダーの予定と少しでも被っていたら、不参加とします"
              onChange={e => setSearchCondition(e.target.value)}
            />
          </ModalBody>
          <ModalFooter className="w-full">
            <Button
              color="primary"
              className="w-full"
              onPress={() => handleSubmit()}
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              {isLoading ? progressMessage : '予定を取得して自動入力'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
