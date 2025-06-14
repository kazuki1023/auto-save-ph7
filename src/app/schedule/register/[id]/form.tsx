'use client';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Radio, RadioGroup } from '@heroui/radio';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaWandMagicSparkles } from 'react-icons/fa6';

import { dummy_candidates } from '@/const/dummy_candidate';

import { checkSchedule, registerSchedule } from './action';

const batchSize = 3;

export default function RegisterForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  if (!id) {
    console.log('dummyの日程を使う');
  }
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState(
    'google calendar の予定を確認中...'
  );
  const [searchCondition, setSearchCondition] = useState('');
  const [result, setResult] = useState<
    {
      id: number;
      schedule_id: number;
      date: string;
      start_time: string;
      end_time: string;
      option: '参加' | '途中参加' | '途中退出' | '不参加';
      reason: string;
    }[]
  >([]);

  // 各スケジュールの選択状態を管理
  const [selections, setSelections] = useState<
    Record<
      number,
      { option: '参加' | '途中参加' | '途中退出' | '不参加'; reason?: string }
    >
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [respondentName, setRespondentName] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmitAiAssistant = async () => {
    try {
      setIsLoading(true);
      for (let i = 0; i < dummy_candidates.length; i += batchSize) {
        const batch = dummy_candidates.slice(i, i + batchSize);
        setProgressMessage(
          `${batch[batch.length - 1].date} までの日程を確認中`
        );
        const result = await checkSchedule(batch, searchCondition);
        setResult(prev => [...prev, ...(result ?? [])]);

        // AI結果を選択状態にも反映
        if (result) {
          const newSelections: Record<
            number,
            {
              option: '参加' | '途中参加' | '途中退出' | '不参加';
              reason?: string;
            }
          > = {};
          result.forEach(r => {
            newSelections[r.schedule_id] = {
              option: r.option,
              reason: r.reason,
            };
          });
          setSelections(prev => ({ ...prev, ...newSelections }));
        }
      }
      setIsLoading(false);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const handleSelectionChange = (
    scheduleId: number,
    option: '参加' | '途中参加' | '途中退出' | '不参加'
  ) => {
    setSelections(prev => ({
      ...prev,
      [scheduleId]: { ...prev[scheduleId], option },
    }));
  };

  const handleRegisterClick = () => {
    // 選択されたデータを確認
    const scheduleData = Object.entries(selections).map(
      ([scheduleId, selection]) => ({
        schedule_id: parseInt(scheduleId),
        option: selection.option,
        reason: selection.reason,
      })
    );

    if (scheduleData.length === 0) {
      alert('回答を選択してください');
      return;
    }

    setIsRegisterModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // 選択されたデータを整形
      const scheduleData = Object.entries(selections).map(
        ([scheduleId, selection]) => ({
          schedule_id: parseInt(scheduleId),
          option: selection.option,
          reason: selection.reason,
        })
      );

      const response = await registerSchedule(
        scheduleData,
        respondentName,
        additionalInfo
      );

      if (response.success) {
        alert(response.message);
        setIsRegisterModalOpen(false);
        router.push('/schedule');
      }
    } catch (error) {
      console.error('登録エラー:', error);
      alert('登録に失敗しました');
    } finally {
      setIsSubmitting(false);
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
          {dummy_candidates.map(schedule => {
            const aiResult = result.find(r => r.id === schedule.id);
            console.log('aiResult', aiResult);
            const currentSelection = selections[schedule.id];

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
                    value={currentSelection?.option || aiResult?.option}
                    onValueChange={value =>
                      handleSelectionChange(
                        schedule.id,
                        value as '参加' | '途中参加' | '途中退出' | '不参加'
                      )
                    }
                    className="flex flex-row gap-5"
                  >
                    <Radio value="参加">参加</Radio>
                    <Radio value="途中参加">途中参加</Radio>
                    <Radio value="途中退出">途中退出</Radio>
                    <Radio value="不参加">不参加</Radio>
                  </RadioGroup>
                  {(currentSelection?.reason || aiResult?.reason) && (
                    <p className="text-sm text-gray-500">
                      {currentSelection?.reason || aiResult?.reason}
                    </p>
                  )}
                </CardBody>
              </Card>
            );
          })}
          <Button color="primary" onPress={handleRegisterClick}>
            登録する
          </Button>
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
              onPress={() => handleSubmitAiAssistant()}
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              {isLoading ? progressMessage : '予定を取得して自動入力'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 登録確認モーダル */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>回答内容の登録</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                label="回答者名"
                placeholder="回答者名を入力してください"
                value={respondentName}
                onChange={e => setRespondentName(e.target.value)}
                isRequired
              />
              <Input
                type="text"
                label="補足情報"
                placeholder="追加の補足情報があれば入力してください"
                value={additionalInfo}
                onChange={e => setAdditionalInfo(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter className="w-full">
            <Button
              color="secondary"
              onPress={() => setIsRegisterModalOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              isDisabled={isSubmitting || !respondentName.trim()}
            >
              {isSubmitting ? '登録中...' : '登録する'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
