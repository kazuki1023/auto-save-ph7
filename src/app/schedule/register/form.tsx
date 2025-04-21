"use client";
import { useState } from "react";
import { Form } from "@heroui/form";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { RadioGroup, Radio } from "@heroui/radio";
import { Button } from "@heroui/button";
import Link from "next/link";
import {  Modal,  ModalContent,  ModalHeader,  ModalBody,  ModalFooter} from "@heroui/modal";
import { Input } from "@heroui/input";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { dummy_schedule } from "@/const/dummy_scedule";

export default function RegisterForm() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-row gap-5 justify-center items-center mb-2">
        <Button as={Link} href="/schedule" color="secondary">戻る</Button>
        <h1 className="text-2xl font-bold">ダミー日程調整</h1>
        <Button color="primary" startContent={<FaWandMagicSparkles />} onPress={() => setIsOpen(true)}>自動入力</Button>
      </div>
      <div>
        <Form className="flex flex-col gap-5 min-w-[450px] justify-center items-center">
          {dummy_schedule.map((schedule) => (
            <Card key={schedule.id} className="flex flex-col w-full">
              <CardHeader className="">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-bold">{schedule.date}</p>
                  <p className="text-lg font-bold">{schedule.start_time} - {schedule.end_time}</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <RadioGroup orientation="horizontal">
                  <Radio value="ok">参加</Radio>
                  <Radio value="late">途中参加</Radio>
                  <Radio value="leave">途中退出</Radio>
                  <Radio value="cancel">不参加</Radio>
                </RadioGroup>
              </CardBody>
            </Card>
          ))}
          <Button color="primary" className="">登録する</Button>
        </Form>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} placement="center">
        <ModalContent>
          <ModalHeader>
            自動入力
          </ModalHeader>
          <ModalBody>
            <p>検索条件</p>
            <Input type="text" placeholder="カレンダーの予定と少しでも被っていたら、不参加とします" />
          </ModalBody>
          <ModalFooter className="flex flex-row gap-2">
            <Button color="primary">自動入力</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}