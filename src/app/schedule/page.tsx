"use client";

import {
  Listbox,
  ListboxSection,
  ListboxItem,
} from "@heroui/listbox";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { dummy_schedule } from "@/const/dummy_scedule";

const ListboxWrapper = ({children}: {children: React.ReactNode}) => (
  <div className="w-full max-w-[400px] px-1 py-2 rounded-small dark:border-default-100 ">
    {children}
  </div>
);

export default function Schedule() {
  console.log(dummy_schedule);
  return (
    <>
      <h1 className="text-2xl font-bold">ダミー日程調整</h1>
      <ListboxWrapper>
        <Listbox className="flex flex-col gap-2 mb-2">
          {dummy_schedule.map((schedule) => (
            <ListboxItem key={schedule.id} className="mb-2">{schedule.date} {schedule.start_time} - {schedule.end_time}</ListboxItem>
          ))}
        </Listbox>
      </ListboxWrapper>
      <Button color="primary" as={Link} href="/schedule/register">登録する</Button>
    </>
  )
}
