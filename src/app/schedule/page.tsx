'use client';

import { Button } from '@heroui/button';
import { Card, CardFooter, CardHeader } from '@heroui/card';
import { Link } from '@heroui/link';

import { SignInButton } from '@/components/auth/signin_button';
import { dummy_schedule } from '@/const/dummy_schedule';

export default function Schedule() {
  return (
    <>
      <div className="flex flex-row gap-5 justify-center items-center mb-2">
        <h1 className="text-2xl font-bold">ダミー日程調整</h1>
        <SignInButton />
      </div>
      <div className="w-full max-w-[400px] px-1 py-2 rounded-small dark:border-default-100 flex flex-col gap-2">
        {dummy_schedule.map(schedule => (
          <Card key={schedule.id}>
            <CardHeader>
              <h2 className="text-lg font-bold">{schedule.name}</h2>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button
                color="primary"
                as={Link}
                href={`/schedule/register/${schedule.id}`}
              >
                登録する
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
